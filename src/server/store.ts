import { createHash, randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import { conflictsFor, progressFor } from "../domain/progress.js";
import { DomainError } from "../domain/validation.js";
import type {
  ActivityInput,
  CompletionEvent,
  CompletionInput,
  CreatePlanInput,
  LearningPlan,
  PlanDetail,
  Profile,
  ScopeEvent,
  StudyActivity,
  UpdatePlanInput,
} from "../shared/contracts.js";

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
  if (versions.some((row) => row.version !== 1))
    throw new Error("Unsupported application schema version");
  if (versions.length) return;
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
}

export class JourneyStore {
  constructor(
    private readonly database: Database.Database,
    private readonly clock: () => Date,
  ) {}

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
        for (const plan of this.list(owner)) {
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

  list(owner: string): LearningPlan[] {
    const rows = this.database
      .prepare("SELECT owner_id, body FROM learning_plan WHERE owner_id = ? ORDER BY rowid DESC")
      .all(owner) as PlanRow[];
    return rows.map((row) => JSON.parse(row.body) as LearningPlan);
  }

  private plan(owner: string, id: string): LearningPlan {
    const row = this.database
      .prepare("SELECT owner_id, body FROM learning_plan WHERE id = ? AND owner_id = ?")
      .get(id, owner) as PlanRow | undefined;
    if (!row) throw new DomainError("not_found", 404);
    return JSON.parse(row.body) as LearningPlan;
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
    ).map((row) => JSON.parse(row.body) as CompletionEvent);
    const scopeEvents = (
      this.database
        .prepare("SELECT body FROM scope_event WHERE plan_id = ? ORDER BY rowid DESC")
        .all(id) as EventRow[]
    ).map((row) => JSON.parse(row.body) as ScopeEvent);
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

  private write(
    owner: string,
    requestId: string,
    operation: string,
    body: unknown,
    action: () => PlanDetail,
  ): PlanDetail {
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
          return JSON.parse(receipt.response) as PlanDetail;
        }
        const result = action();
        this.database
          .prepare(
            "INSERT INTO request_receipt (owner_id, request_id, operation, digest, response) VALUES (?, ?, ?, ?, ?)",
          )
          .run(owner, requestId, operation, digest, JSON.stringify(result));
        return result;
      })
      .immediate();
  }

  create(owner: string, input: CreatePlanInput): PlanDetail {
    return this.write(owner, input.requestId, "create", input, () => {
      const profile = this.profile(owner);
      if (!profile) throw new DomainError("profile_required", 409);
      const now = this.clock().toISOString();
      const plan: LearningPlan = {
        id: randomUUID(),
        goal: input.goal,
        templateId: input.templateId,
        templateVersion: input.templateId === null ? null : 1,
        revision: 1,
        timezone: profile.timezone,
        locale: profile.locale,
        availabilityDates: input.availabilityDates,
        targetDate: input.targetDate,
        references: input.references,
        steps: input.steps.map((step) => ({
          id: randomUUID(),
          title: step.title,
          scheduledDate: step.scheduledDate,
          estimatedMinutes: step.estimatedMinutes,
          completedAt: null,
        })),
        createdAt: now,
        updatedAt: now,
      };
      this.database
        .prepare("INSERT INTO learning_plan (id, owner_id, body) VALUES (?, ?, ?)")
        .run(plan.id, owner, JSON.stringify(plan));
      return this.detail(owner, plan.id);
    });
  }

  update(owner: string, id: string, input: UpdatePlanInput): PlanDetail {
    this.plan(owner, id);
    return this.write(owner, input.requestId, `update:${id}`, input, () => {
      const plan = this.plan(owner, id);
      if (plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
      const nextSteps = input.steps.map((step) => {
        if (!step.id)
          return {
            id: randomUUID(),
            title: step.title,
            scheduledDate: step.scheduledDate,
            estimatedMinutes: step.estimatedMinutes,
            completedAt: null,
          };
        const previous = plan.steps.find((item) => item.id === step.id);
        if (!previous) throw new DomainError("invalid_step", 400, "stepId");
        if (
          previous.completedAt !== null &&
          (previous.title !== step.title ||
            previous.scheduledDate !== step.scheduledDate ||
            previous.estimatedMinutes !== step.estimatedMinutes)
        )
          throw new DomainError("completed_step_immutable", 409, "stepId");
        return {
          ...previous,
          title: step.title,
          scheduledDate: step.scheduledDate,
          estimatedMinutes: step.estimatedMinutes,
        };
      });
      const now = this.clock().toISOString();
      const scope: ScopeEvent = {
        id: randomUUID(),
        previousCount: plan.steps.length,
        currentCount: nextSteps.length,
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
      };
      this.savePlan(updated, owner);
      return this.detail(owner, id);
    });
  }

  activity(owner: string, id: string, input: ActivityInput): PlanDetail {
    this.plan(owner, id);
    return this.write(owner, input.requestId, `activity:${id}`, input, () => {
      const plan = this.plan(owner, id);
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
      return this.detail(owner, id);
    });
  }

  complete(owner: string, id: string, input: CompletionInput): PlanDetail {
    this.plan(owner, id);
    return this.write(owner, input.requestId, `complete:${id}`, input, () => {
      const plan = this.plan(owner, id);
      if (plan.revision !== input.revision) throw new DomainError("stale_revision", 409);
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
}
