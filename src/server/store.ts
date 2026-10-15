import { createHash, randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import { comebackPreview } from "../domain/comeback.js";
import { learningSource, normalizedSourceUrl } from "../domain/ai-validation.js";
import { conflictsFor, progressFor } from "../domain/progress.js";
import { DomainError } from "../domain/validation.js";
import type {
  ActivityInput,
  ComebackConfirmInput,
  ComebackPreview,
  ComebackPreviewInput,
  CompletionEvent,
  CompletionInput,
  CreatePlanInput,
  DeletedPlan,
  PlanActionInput,
  RemovedStep,
  RestoreStepInput,
  LearningPlan,
  LearningSource,
  PlanFields,
  PlanDetail,
  Profile,
  ScopeEvent,
  StudyActivity,
  UpdatePlanInput,
} from "../shared/contracts.js";
import { LIMITS } from "../shared/contracts.js";
import { AiSourceStore } from "./ai-sources.js";

interface PlanRow {
  owner_id: string;
  body: string;
}
interface EventRow {
  body: string;
}
interface RequestRow {
  operation: string;
  digest: string;
  response: string;
}

export function migrate(database: Database.Database): void {
  database.exec("CREATE TABLE IF NOT EXISTS app_schema (version INTEGER PRIMARY KEY)");
  const versions = database.prepare("SELECT version FROM app_schema").all() as {
    version: number;
  }[];
  const ordered = versions.map((row) => row.version).sort((a, b) => a - b);
  if (ordered.length > 3 || ordered.some((version, index) => version !== index + 1))
    throw new Error("Unsupported application schema version");
  if (!ordered.includes(1))
    database
      .transaction(() => {
        database.exec(`
      CREATE TABLE learner_profile (owner_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE, locale TEXT NOT NULL, timezone TEXT NOT NULL);
      CREATE TABLE learning_plan (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, body TEXT NOT NULL);
      CREATE INDEX learning_plan_owner ON learning_plan(owner_id);
      CREATE TABLE study_activity (id TEXT PRIMARY KEY, plan_id TEXT NOT NULL REFERENCES learning_plan(id), body TEXT NOT NULL);
      CREATE INDEX activity_plan ON study_activity(plan_id);
      CREATE TABLE step_completion (id TEXT PRIMARY KEY, plan_id TEXT NOT NULL REFERENCES learning_plan(id), body TEXT NOT NULL);
      CREATE INDEX completion_plan ON step_completion(plan_id);
      CREATE TABLE scope_event (id TEXT PRIMARY KEY, plan_id TEXT NOT NULL REFERENCES learning_plan(id), body TEXT NOT NULL, before_json TEXT NOT NULL);
      CREATE INDEX scope_plan ON scope_event(plan_id);
      CREATE TABLE request_receipt (owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, request_id TEXT NOT NULL, operation TEXT NOT NULL, digest TEXT NOT NULL, response TEXT NOT NULL, PRIMARY KEY(owner_id, request_id));
      INSERT INTO app_schema (version) VALUES (1);
    `);
      })
      .immediate();
  if (!ordered.includes(2))
    database
      .transaction(() => {
        database.exec(`
      CREATE TABLE study_circle (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at TEXT NOT NULL, closed_at TEXT);
      CREATE TABLE circle_member (id TEXT PRIMARY KEY, circle_id TEXT NOT NULL REFERENCES study_circle(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, joined_at TEXT NOT NULL, UNIQUE(circle_id,user_id), UNIQUE(circle_id,id));
      CREATE INDEX circle_member_user ON circle_member(user_id);
      CREATE TABLE circle_invite (id TEXT PRIMARY KEY, circle_id TEXT NOT NULL REFERENCES study_circle(id) ON DELETE CASCADE, creator_id TEXT NOT NULL REFERENCES user(id), token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT, redeemed_at TEXT, redeemed_member_id TEXT);
      CREATE INDEX circle_invite_circle ON circle_invite(circle_id);
      CREATE TABLE circle_item (id TEXT PRIMARY KEY, circle_id TEXT NOT NULL, author_member_id TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('commitment','check_in')), text TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(circle_id,id), FOREIGN KEY(circle_id,author_member_id) REFERENCES circle_member(circle_id,id) ON DELETE CASCADE);
      CREATE TABLE circle_encouragement (id TEXT PRIMARY KEY, circle_id TEXT NOT NULL, item_id TEXT NOT NULL, sender_member_id TEXT NOT NULL, preset TEXT NOT NULL CHECK(preset IN ('keep_going','small_steps_count','glad_you_returned')), created_at TEXT NOT NULL, UNIQUE(item_id,sender_member_id), FOREIGN KEY(circle_id,item_id) REFERENCES circle_item(circle_id,id) ON DELETE CASCADE, FOREIGN KEY(circle_id,sender_member_id) REFERENCES circle_member(circle_id,id) ON DELETE CASCADE);
      CREATE TABLE circle_receipt (owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, request_id TEXT NOT NULL, operation TEXT NOT NULL, digest TEXT NOT NULL, circle_id TEXT NOT NULL, member_id TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT NOT NULL, PRIMARY KEY(owner_id,request_id));
      INSERT INTO app_schema (version) VALUES (2);
    `);
      })
      .immediate();
  if (!ordered.includes(3))
    database
      .transaction(() => {
        database.exec(`
      CREATE TABLE ai_source_draft (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE, body TEXT NOT NULL CHECK(length(body) <= 4096), created_at TEXT NOT NULL, expires_at TEXT NOT NULL CHECK(expires_at > created_at));
      CREATE INDEX ai_source_draft_owner ON ai_source_draft(owner_id, expires_at);
      CREATE INDEX ai_source_draft_expiry ON ai_source_draft(expires_at);
      INSERT INTO app_schema (version) VALUES (3);
    `);
      })
      .immediate();
}

export class JourneyStore {
  private readonly sources: AiSourceStore;
  constructor(
    private readonly database: Database.Database,
    private readonly clock: () => Date,
  ) {
    this.sources = new AiSourceStore(database, clock);
  }

  private resolveSources(
    owner: string,
    input: PlanFields,
    current?: LearningPlan,
  ): LearningSource[] {
    const ids = input.sourceIds ?? current?.sources?.map((source) => source.id) ?? [];
    const sources = this.sources.resolve(owner, ids, current?.sources);
    const references = new Set(input.references.map(normalizedSourceUrl));
    if (sources.some((source) => !references.has(normalizedSourceUrl(source.url))))
      throw new DomainError("source_unavailable", 409, "references");
    return sources;
  }

  private associations(ids: string[] | undefined, sources: readonly LearningSource[]): void {
    const permitted = new Set(sources.map((source) => source.id));
    if (ids?.some((id) => !permitted.has(id)))
      throw new DomainError("source_unavailable", 409, "sourceIds");
  }

  profile(owner: string): Profile | null {
    return (
      (this.database
        .prepare("SELECT locale, timezone FROM learner_profile WHERE owner_id = ?")
        .get(owner) as Profile | undefined) ?? null
    );
  }

  saveProfile(owner: string, profile: Profile): void {
    this.database
      .transaction(() => {
        this.database
          .prepare(
            "INSERT INTO learner_profile (owner_id, locale, timezone) VALUES (?, ?, ?) ON CONFLICT(owner_id) DO UPDATE SET locale=excluded.locale, timezone=excluded.timezone",
          )
          .run(owner, profile.locale, profile.timezone);
        for (const plan of this.list(owner, "all")) {
          if (plan.timezone !== profile.timezone || plan.locale !== profile.locale) {
            plan.timezone = profile.timezone;
            plan.locale = profile.locale;
            plan.updatedAt = this.clock().toISOString();
            this.savePlan(plan, owner);
          }
        }
      })
      .immediate();
  }

  list(owner: string, status: "active" | "archived" | "all" = "active"): LearningPlan[] {
    const rows = this.database
      .prepare("SELECT owner_id, body FROM learning_plan WHERE owner_id = ? ORDER BY rowid DESC")
      .all(owner) as PlanRow[];
    return rows
      .map((row) => this.normalizePlan(JSON.parse(row.body) as LearningPlan))
      .filter(
        (plan) =>
          status === "all" ||
          (status === "archived" ? plan.archivedAt !== null : plan.archivedAt === null),
      );
  }

  private plan(owner: string, id: string): LearningPlan {
    const row = this.database
      .prepare("SELECT owner_id, body FROM learning_plan WHERE id = ? AND owner_id = ?")
      .get(id, owner) as PlanRow | undefined;
    if (!row) throw new DomainError("not_found", 404);
    return this.normalizePlan(JSON.parse(row.body) as LearningPlan);
  }

  private normalizePlan(plan: LearningPlan): LearningPlan {
    return { ...plan, archivedAt: plan.archivedAt ?? null };
  }

  private active(owner: string, id: string, revision?: number): LearningPlan {
    const plan = this.plan(owner, id);
    if (plan.archivedAt) throw new DomainError("plan_archived", 409);
    if (revision !== undefined && plan.revision !== revision)
      throw new DomainError("stale_revision", 409);
    return plan;
  }

  private advance(plan: LearningPlan, owner: string): void {
    plan.revision++;
    plan.updatedAt = this.clock().toISOString();
    this.savePlan(plan, owner);
  }

  detail(owner: string, id: string): PlanDetail {
    const plan = this.plan(owner, id);
    const activities = (
      this.database
        .prepare("SELECT body FROM study_activity WHERE plan_id = ? ORDER BY rowid DESC")
        .all(id) as EventRow[]
    ).map((row) => JSON.parse(row.body) as StudyActivity);
    const completions = (
      this.database
        .prepare("SELECT body FROM step_completion WHERE plan_id = ? ORDER BY rowid DESC")
        .all(id) as EventRow[]
    ).map((row) => {
      const event = JSON.parse(row.body) as CompletionEvent;
      return { ...event, correctedAt: event.correctedAt ?? null };
    });
    const scopeEvents = (
      this.database
        .prepare("SELECT body FROM scope_event WHERE plan_id = ? ORDER BY rowid DESC")
        .all(id) as EventRow[]
    ).map((row) => {
      const event = JSON.parse(row.body) as ScopeEvent;
      return { ...event, kind: event.kind ?? "edit" };
    });
    return {
      plan,
      activities,
      completions,
      scopeEvents,
      progress: progressFor(plan, activities, completions, this.clock()),
      nextStepId: plan.steps.find((step) => step.completedAt === null)?.id ?? null,
      conflicts: conflictsFor(plan),
    };
  }

  private savePlan(plan: LearningPlan, owner: string): void {
    this.database
      .prepare("UPDATE learning_plan SET body = ? WHERE id = ? AND owner_id = ?")
      .run(JSON.stringify(plan), plan.id, owner);
  }

  private receiptPlanId(value: unknown): string | null {
    if (!value || typeof value !== "object") return null;
    if ("planId" in value && typeof value.planId === "string") return value.planId;
    if (
      "plan" in value &&
      value.plan &&
      typeof value.plan === "object" &&
      "id" in value.plan &&
      typeof value.plan.id === "string"
    )
      return value.plan.id;
    return null;
  }

  private scrubReceipts(owner: string, id: string): void {
    const rows = this.database
      .prepare("SELECT request_id, response FROM request_receipt WHERE owner_id = ?")
      .all(owner) as { request_id: string; response: string }[];
    const update = this.database.prepare(
      "UPDATE request_receipt SET response = ? WHERE owner_id = ? AND request_id = ?",
    );
    for (const row of rows) {
      const value: unknown = JSON.parse(row.response);
      if (this.receiptPlanId(value) === id)
        update.run(JSON.stringify({ planId: id }), owner, row.request_id);
    }
  }

  private write<T extends PlanDetail | DeletedPlan>(
    owner: string,
    requestId: string,
    operation: string,
    body: unknown,
    action: () => T,
  ): T {
    const digest = createHash("sha256").update(JSON.stringify(body)).digest("hex");
    return this.database
      .transaction(() => {
        const receipt = this.database
          .prepare(
            "SELECT operation, digest, response FROM request_receipt WHERE owner_id = ? AND request_id = ?",
          )
          .get(owner, requestId) as RequestRow | undefined;
        if (receipt) {
          if (receipt.operation !== operation || receipt.digest !== digest)
            throw new DomainError("idempotency_conflict", 409);
          const value: unknown = JSON.parse(receipt.response);
          const planId = this.receiptPlanId(value);
          if (!planId) throw new DomainError("not_found", 404);
          if (operation === `delete:${planId}`) return { deletedPlanId: planId } as T;
          const result = this.detail(owner, planId);
          if (
            !operation.startsWith("archive:") &&
            !operation.startsWith("restore:") &&
            result.plan.archivedAt
          )
            throw new DomainError("plan_archived", 409);
          return result as T;
        }
        const result = action();
        const response =
          "plan" in result
            ? { planId: result.plan.id }
            : { planId: result.deletedPlanId, deleted: true };
        this.database
          .prepare(
            "INSERT INTO request_receipt (owner_id, request_id, operation, digest, response) VALUES (?, ?, ?, ?, ?)",
          )
          .run(owner, requestId, operation, digest, JSON.stringify(response));
        return result;
      })
      .immediate();
  }

  create(owner: string, input: CreatePlanInput): PlanDetail {
    return this.write(owner, input.requestId, "create", input, () => {
      const profile = this.profile(owner);
      if (!profile) throw new DomainError("profile_required", 409);
      const now = this.clock().toISOString();
      const sources = this.resolveSources(owner, input);
      const plan: LearningPlan = {
        id: randomUUID(),
        goal: input.goal,
        templateId: input.templateId,
        templateVersion: input.templateId === null ? null : 1,
        revision: 1,
        archivedAt: null,
        timezone: profile.timezone,
        locale: profile.locale,
        availabilityDates: input.availabilityDates,
        targetDate: input.targetDate,
        references: input.references,
        steps: input.steps.map((step) => {
          this.associations(step.sourceIds, sources);
          return {
            id: randomUUID(),
            title: step.title,
            scheduledDate: step.scheduledDate,
            estimatedMinutes: step.estimatedMinutes,
            completedAt: null,
            ...(step.sourceIds === undefined ? {} : { sourceIds: step.sourceIds }),
          };
        }),
        createdAt: now,
        updatedAt: now,
        ...(input.sourceIds === undefined ? {} : { sources }),
      };
      this.database
        .prepare("INSERT INTO learning_plan (id, owner_id, body) VALUES (?, ?, ?)")
        .run(plan.id, owner, JSON.stringify(plan));
      this.sources.consume(
        owner,
        sources.map((source) => source.id),
      );
      return this.detail(owner, plan.id);
    });
  }

  update(owner: string, id: string, input: UpdatePlanInput): PlanDetail {
    return this.write(owner, input.requestId, `update:${id}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      const sources = this.resolveSources(owner, input, plan);
      const nextSteps = input.steps.map((step) => {
        if (!step.id) {
          this.associations(step.sourceIds, sources);
          return {
            id: randomUUID(),
            title: step.title,
            scheduledDate: step.scheduledDate,
            estimatedMinutes: step.estimatedMinutes,
            completedAt: null,
            ...(step.sourceIds === undefined ? {} : { sourceIds: step.sourceIds }),
          };
        }
        const previous = plan.steps.find((item) => item.id === step.id);
        if (!previous) throw new DomainError("invalid_step", 400, "stepId");
        const ids = step.sourceIds ?? previous.sourceIds;
        this.associations(ids, sources);
        if (
          previous.completedAt !== null &&
          (previous.title !== step.title ||
            previous.scheduledDate !== step.scheduledDate ||
            previous.estimatedMinutes !== step.estimatedMinutes ||
            (ids?.length ?? 0) !== (previous.sourceIds?.length ?? 0) ||
            ids?.some((sourceId) => !previous.sourceIds?.includes(sourceId)))
        )
          throw new DomainError("completed_step_immutable", 409, "stepId");
        return {
          ...previous,
          title: step.title,
          scheduledDate: step.scheduledDate,
          estimatedMinutes: step.estimatedMinutes,
          ...(ids === undefined ? {} : { sourceIds: ids }),
        };
      });
      const now = this.clock().toISOString();
      const scope: ScopeEvent = {
        id: randomUUID(),
        previousCount: plan.steps.length,
        currentCount: nextSteps.length,
        kind: "edit",
        createdAt: now,
      };
      this.database
        .prepare("INSERT INTO scope_event (id, plan_id, body, before_json) VALUES (?, ?, ?, ?)")
        .run(scope.id, id, JSON.stringify(scope), JSON.stringify(plan));
      const updated: LearningPlan = {
        ...plan,
        goal: input.goal,
        availabilityDates: input.availabilityDates,
        targetDate: input.targetDate,
        references: input.references,
        steps: nextSteps,
        revision: plan.revision + 1,
        updatedAt: now,
        ...(input.sourceIds === undefined && plan.sources === undefined ? {} : { sources }),
      };
      this.savePlan(updated, owner);
      this.sources.consume(
        owner,
        sources.map((source) => source.id),
      );
      return this.detail(owner, id);
    });
  }

  activity(owner: string, id: string, input: ActivityInput): PlanDetail {
    return this.write(owner, input.requestId, `activity:${id}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      const step = plan.steps.find((item) => item.id === input.stepId);
      if (!step) throw new DomainError("invalid_step", 400, "stepId");
      const activity: StudyActivity = {
        id: randomUUID(),
        stepId: step.id,
        stepTitle: step.title,
        minutes: input.minutes,
        reflection: input.reflection || null,
        createdAt: this.clock().toISOString(),
      };
      this.database
        .prepare("INSERT INTO study_activity (id, plan_id, body) VALUES (?, ?, ?)")
        .run(activity.id, id, JSON.stringify(activity));
      this.advance(plan, owner);
      return this.detail(owner, id);
    });
  }

  complete(owner: string, id: string, input: CompletionInput): PlanDetail {
    return this.write(owner, input.requestId, `complete:${id}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      const step = plan.steps.find((item) => item.id === input.stepId);
      if (!step) throw new DomainError("invalid_step", 400, "stepId");
      if (step.completedAt !== null) throw new DomainError("already_complete", 409);
      const now = this.clock().toISOString();
      const completion: CompletionEvent = {
        id: randomUUID(),
        stepId: step.id,
        stepTitle: step.title,
        scheduledDate: step.scheduledDate,
        createdAt: now,
        correctedAt: null,
      };
      this.database
        .prepare("INSERT INTO step_completion (id, plan_id, body) VALUES (?, ?, ?)")
        .run(completion.id, id, JSON.stringify(completion));
      step.completedAt = now;
      plan.revision++;
      plan.updatedAt = now;
      this.savePlan(plan, owner);
      return this.detail(owner, id);
    });
  }

  archive(owner: string, id: string, input: PlanActionInput): PlanDetail {
    return this.write(owner, input.requestId, `archive:${id}`, input, () => {
      const plan = this.plan(owner, id);
      if (plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
      if (plan.archivedAt) throw new DomainError("already_archived", 409);
      plan.archivedAt = this.clock().toISOString();
      this.advance(plan, owner);
      return this.detail(owner, id);
    });
  }

  restore(owner: string, id: string, input: PlanActionInput): PlanDetail {
    return this.write(owner, input.requestId, `restore:${id}`, input, () => {
      const plan = this.plan(owner, id);
      if (plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
      if (!plan.archivedAt) throw new DomainError("not_archived", 409);
      plan.archivedAt = null;
      this.advance(plan, owner);
      return this.detail(owner, id);
    });
  }

  delete(owner: string, id: string, input: PlanActionInput): DeletedPlan {
    return this.write(owner, input.requestId, `delete:${id}`, input, () => {
      const plan = this.plan(owner, id);
      if (plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
      this.scrubReceipts(owner, id);
      for (const table of ["study_activity", "step_completion", "scope_event"])
        this.database.prepare(`DELETE FROM ${table} WHERE plan_id = ?`).run(id);
      this.database
        .prepare("DELETE FROM learning_plan WHERE id = ? AND owner_id = ?")
        .run(id, owner);
      return { deletedPlanId: id };
    });
  }

  deleteActivity(
    owner: string,
    id: string,
    activityId: string,
    input: PlanActionInput,
  ): PlanDetail {
    return this.write(owner, input.requestId, `delete_activity:${id}:${activityId}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      const removed = this.database
        .prepare("DELETE FROM study_activity WHERE id = ? AND plan_id = ?")
        .run(activityId, id);
      if (!removed.changes) throw new DomainError("not_found", 404);
      this.scrubReceipts(owner, id);
      this.advance(plan, owner);
      return this.detail(owner, id);
    });
  }

  removeReflection(
    owner: string,
    id: string,
    activityId: string,
    input: PlanActionInput,
  ): PlanDetail {
    return this.write(
      owner,
      input.requestId,
      `remove_reflection:${id}:${activityId}`,
      input,
      () => {
        const plan = this.active(owner, id, input.revision);
        const row = this.database
          .prepare("SELECT body FROM study_activity WHERE id = ? AND plan_id = ?")
          .get(activityId, id) as EventRow | undefined;
        if (!row) throw new DomainError("not_found", 404);
        const activity = JSON.parse(row.body) as StudyActivity;
        if (activity.reflection === null) throw new DomainError("reflection_unavailable", 409);
        activity.reflection = null;
        this.database
          .prepare("UPDATE study_activity SET body = ? WHERE id = ? AND plan_id = ?")
          .run(JSON.stringify(activity), activityId, id);
        this.scrubReceipts(owner, id);
        this.advance(plan, owner);
        return this.detail(owner, id);
      },
    );
  }

  correctCompletion(
    owner: string,
    id: string,
    completionId: string,
    input: PlanActionInput,
  ): PlanDetail {
    return this.write(
      owner,
      input.requestId,
      `correct_completion:${id}:${completionId}`,
      input,
      () => {
        const plan = this.active(owner, id, input.revision);
        const completions = this.detail(owner, id).completions;
        const completion = completions.find((event) => event.id === completionId);
        if (!completion) throw new DomainError("not_found", 404);
        if (completion.correctedAt) throw new DomainError("already_corrected", 409);
        const current = completions.find(
          (event) => event.stepId === completion.stepId && !event.correctedAt,
        );
        completion.correctedAt = this.clock().toISOString();
        this.database
          .prepare("UPDATE step_completion SET body = ? WHERE id = ? AND plan_id = ?")
          .run(JSON.stringify(completion), completionId, id);
        const step = plan.steps.find((item) => item.id === completion.stepId);
        if (step && current?.id === completion.id) step.completedAt = null;
        this.advance(plan, owner);
        return this.detail(owner, id);
      },
    );
  }

  removedSteps(owner: string, id: string): RemovedStep[] {
    const detail = this.detail(owner, id);
    const active = new Set(detail.plan.steps.map((step) => step.id));
    const found = new Set<string>();
    const rows = this.database
      .prepare("SELECT body, before_json FROM scope_event WHERE plan_id = ? ORDER BY rowid DESC")
      .all(id) as { body: string; before_json: string }[];
    const candidates: RemovedStep[] = [];
    for (const row of rows) {
      const event = JSON.parse(row.body) as ScopeEvent;
      const before = JSON.parse(row.before_json) as LearningPlan;
      for (const saved of before.steps) {
        if (active.has(saved.id) || found.has(saved.id)) continue;
        found.add(saved.id);
        const latest = detail.completions.find(
          (completion) => completion.stepId === saved.id && !completion.correctedAt,
        );
        const step = { ...saved, completedAt: latest?.createdAt ?? null };
        const sources = (before.sources ?? []).filter((source) =>
          saved.sourceIds?.includes(source.id),
        );
        const associated = new Set(sources.map((source) => normalizedSourceUrl(source.url)));
        const currentReferences = new Set(detail.plan.references.map(normalizedSourceUrl));
        candidates.push({
          step,
          scopeEventId: event.id,
          removedAt: event.createdAt,
          sources,
          references: [
            ...new Map(
              before.references
                .filter(
                  (url) =>
                    !associated.has(normalizedSourceUrl(url)) &&
                    !currentReferences.has(normalizedSourceUrl(url)),
                )
                .map((url) => [normalizedSourceUrl(url), url]),
            ).values(),
          ],
          conflicts: conflictsFor({ ...detail.plan, steps: [step] }),
        });
      }
    }
    return candidates;
  }

  restoreStep(owner: string, id: string, stepId: string, input: RestoreStepInput): PlanDetail {
    return this.write(owner, input.requestId, `restore_step:${id}:${stepId}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      if (plan.steps.some((step) => step.id === stepId))
        throw new DomainError("step_already_present", 409);
      const candidate = this.removedSteps(owner, id).find((item) => item.step.id === stepId);
      if (!candidate) throw new DomainError("not_found", 404);
      if (candidate.scopeEventId !== input.scopeEventId)
        throw new DomainError("stale_revision", 409);
      if (candidate.conflicts.length && !input.acknowledgeConflicts)
        throw new DomainError("restore_conflicts", 409, "acknowledgeConflicts");
      if (plan.steps.length >= LIMITS.steps) throw new DomainError("restore_limit", 409, "steps");
      const permitted = new Set(candidate.references.map(normalizedSourceUrl));
      if (input.references.some((url) => !permitted.has(normalizedSourceUrl(url))))
        throw new DomainError("invalid_input", 400, "references");
      this.associations(candidate.step.sourceIds, candidate.sources);
      const sources = new Map((plan.sources ?? []).map((source) => [source.id, source]));
      for (const snapshot of candidate.sources) {
        let source: LearningSource;
        try {
          source = learningSource(snapshot);
        } catch {
          throw new DomainError("source_unavailable", 409, "sourceIds");
        }
        const current = sources.get(source.id);
        if (current) {
          let normalized: LearningSource;
          try {
            normalized = learningSource(current);
          } catch {
            throw new DomainError("source_unavailable", 409, "sourceIds");
          }
          if (JSON.stringify(normalized) !== JSON.stringify(source))
            throw new DomainError("source_unavailable", 409, "sourceIds");
        }
        sources.set(source.id, source);
      }
      this.associations(candidate.step.sourceIds, [...sources.values()]);
      const references = new Map(plan.references.map((url) => [normalizedSourceUrl(url), url]));
      for (const url of [...candidate.sources.map((source) => source.url), ...input.references])
        if (!references.has(normalizedSourceUrl(url)))
          references.set(normalizedSourceUrl(url), url);
      if (references.size > LIMITS.references || sources.size > LIMITS.references)
        throw new DomainError("restore_limit", 409, "references");
      const now = this.clock().toISOString();
      const event: ScopeEvent = {
        id: randomUUID(),
        previousCount: plan.steps.length,
        currentCount: plan.steps.length + 1,
        createdAt: now,
        kind: "restore",
        restoredStepId: stepId,
      };
      this.database
        .prepare("INSERT INTO scope_event (id, plan_id, body, before_json) VALUES (?, ?, ?, ?)")
        .run(event.id, id, JSON.stringify(event), JSON.stringify(plan));
      plan.steps.push(candidate.step);
      plan.references = [...references.values()];
      if (sources.size || plan.sources !== undefined) plan.sources = [...sources.values()];
      this.advance(plan, owner);
      return this.detail(owner, id);
    });
  }

  previewComeback(owner: string, id: string, input: ComebackPreviewInput): ComebackPreview {
    const plan = this.active(owner, id, input.revision);
    return comebackPreview(plan, input.restartDate);
  }

  confirmComeback(owner: string, id: string, input: ComebackConfirmInput): PlanDetail {
    return this.write(owner, input.requestId, `comeback:${id}`, input, () => {
      const plan = this.active(owner, id, input.revision);
      const preview = comebackPreview(plan, input.restartDate);
      if (preview.shiftDays === 0) return this.detail(owner, id);
      const dates = new Map(preview.changes.map((change) => [change.stepId, change.proposedDate]));
      for (const step of plan.steps) {
        const date = dates.get(step.id);
        if (date !== undefined) step.scheduledDate = date;
      }
      plan.revision++;
      plan.updatedAt = this.clock().toISOString();
      this.savePlan(plan, owner);
      return this.detail(owner, id);
    });
  }
}
