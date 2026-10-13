import type Database from "better-sqlite3";
import { learningSource, sourceIds } from "../domain/ai-validation.js";
import { DomainError } from "../domain/validation.js";
import { AI_LIMITS } from "../shared/ai-contracts.js";
import type { LearningSource } from "../shared/contracts.js";

interface SourceRow {
  body: string;
  expires_at: string;
}
export class AiSourceStore {
  constructor(
    private readonly database: Database.Database,
    private readonly clock: () => Date,
  ) {
    this.cleanup();
  }

  cleanup(): void {
    this.database
      .prepare("DELETE FROM ai_source_draft WHERE expires_at <= ?")
      .run(this.clock().toISOString());
  }

  stage(owner: string, values: readonly LearningSource[]): LearningSource[] {
    if (values.length > 10) throw new DomainError("invalid_input", 400, "sources");
    const sources = values.map(learningSource);
    sourceIds(sources.map((source) => source.id));
    return this.database
      .transaction(() => {
        this.cleanup();
        const ownerCount = this.database
          .prepare("SELECT count(*) AS count FROM ai_source_draft WHERE owner_id = ?")
          .get(owner) as { count: number };
        const totalCount = this.database
          .prepare("SELECT count(*) AS count FROM ai_source_draft")
          .get() as { count: number };
        if (
          ownerCount.count + sources.length > AI_LIMITS.ownerSources ||
          totalCount.count + sources.length > AI_LIMITS.totalSources
        )
          throw new DomainError("source_limit", 409);
        const createdAt = this.clock().toISOString();
        const expiresAt = new Date(
          new Date(createdAt).getTime() + AI_LIMITS.sourceHours * 60 * 60 * 1000,
        ).toISOString();
        const insert = this.database.prepare(
          "INSERT INTO ai_source_draft (id, owner_id, body, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
        );
        for (const source of sources)
          insert.run(source.id, owner, JSON.stringify(source), createdAt, expiresAt);
        return sources;
      })
      .immediate();
  }

  resolve(
    owner: string,
    ids: readonly string[],
    current: readonly LearningSource[] = [],
  ): LearningSource[] {
    const validatedIds = sourceIds(ids);
    const saved = new Map(current.map((source) => [source.id, source]));
    const now = this.clock().toISOString();
    return validatedIds.map((id) => {
      const snapshot = saved.get(id);
      if (snapshot) return learningSource(snapshot);
      const row = this.database
        .prepare("SELECT body, expires_at FROM ai_source_draft WHERE id = ? AND owner_id = ?")
        .get(id, owner) as SourceRow | undefined;
      if (!row || row.expires_at <= now)
        throw new DomainError("source_unavailable", 409, "sourceIds");
      const source = learningSource(JSON.parse(row.body));
      if (source.id !== id) throw new DomainError("source_unavailable", 409, "sourceIds");
      return source;
    });
  }

  consume(owner: string, ids: readonly string[]): void {
    const remove = this.database.prepare(
      "DELETE FROM ai_source_draft WHERE id = ? AND owner_id = ?",
    );
    for (const id of ids) remove.run(id, owner);
  }
}
