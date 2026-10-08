import { createHash, randomBytes, randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import { DomainError } from "../domain/validation.js";
import {
  CIRCLE_LIMITS,
  type CircleDetail,
  type CircleEncouragementInput,
  type CircleInvite,
  type CircleInviteCreated,
  type CircleItem,
  type CircleItemKind,
  type CircleRequestInput,
  type CircleSummary,
  type CreateCircleInput,
  type EncouragementPreset,
  type RedeemCircleInviteInput,
  type ShareCircleItemInput,
} from "../shared/contracts.js";

interface Access {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  member_id: string;
}
interface InviteRow {
  id: string;
  circle_id: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  redeemed_at: string | null;
}
type ResourceType = "circle" | "invite" | "item" | "member";
interface Receipt {
  operation: string;
  digest: string;
  circle_id: string;
  member_id: string;
  resource_type: ResourceType;
  resource_id: string;
}
interface ItemRow {
  id: string;
  author_member_id: string;
  name: string;
  kind: CircleItemKind;
  text: string;
  created_at: string;
}
const ok = (): { ok: true } => ({ ok: true });
const hash = (text: string): string => createHash("sha256").update(text).digest("hex");

export class CircleStore {
  constructor(
    private readonly database: Database.Database,
    private readonly clock: () => Date,
  ) {}

  private access(user: string, circleId: string, ownerOnly = false): Access {
    const row = this.database
      .prepare(`SELECT c.id,c.owner_id,c.name,c.created_at,m.id AS member_id
      FROM study_circle c JOIN circle_member m ON m.circle_id=c.id
      WHERE c.id=? AND m.user_id=? AND c.closed_at IS NULL`)
      .get(circleId, user) as Access | undefined;
    if (!row) throw new DomainError("not_found", 404);
    if (ownerOnly && row.owner_id !== user) throw new DomainError("owner_required", 403);
    return row;
  }

  private count(sql: string, ...params: string[]): number {
    return (this.database.prepare(sql).get(...params) as { count: number }).count;
  }

  private summary(user: string, row: Access): CircleSummary {
    return {
      id: row.id,
      name: row.name,
      role: row.owner_id === user ? "owner" : "member",
      memberCount: this.count(
        "SELECT count(*) AS count FROM circle_member WHERE circle_id=?",
        row.id,
      ),
      createdAt: row.created_at,
    };
  }

  list(user: string): CircleSummary[] {
    const rows = this.database
      .prepare(`SELECT c.id,c.owner_id,c.name,c.created_at,m.id AS member_id
      FROM study_circle c JOIN circle_member m ON m.circle_id=c.id
      WHERE m.user_id=? AND c.closed_at IS NULL ORDER BY c.rowid DESC`)
      .all(user) as Access[];
    return rows.map((row) => this.summary(user, row));
  }

  detail(user: string, circleId: string): CircleDetail {
    const access = this.access(user, circleId);
    const members = this.database
      .prepare(`SELECT m.id,m.user_id,m.joined_at,u.name
      FROM circle_member m JOIN user u ON u.id=m.user_id WHERE m.circle_id=? ORDER BY m.rowid`)
      .all(circleId) as {
      id: string;
      user_id: string;
      joined_at: string;
      name: string;
    }[];
    const rows = this.database
      .prepare(`SELECT i.id,i.author_member_id,i.kind,i.text,i.created_at,u.name
      FROM circle_item i JOIN circle_member m ON m.id=i.author_member_id JOIN user u ON u.id=m.user_id
      WHERE i.circle_id=? ORDER BY i.rowid DESC`)
      .all(circleId) as ItemRow[];
    const items: CircleItem[] = rows.map((row) => {
      const encouragements = this.database
        .prepare(`SELECT e.id,e.sender_member_id,e.preset,e.created_at,u.name
        FROM circle_encouragement e JOIN circle_member m ON m.id=e.sender_member_id JOIN user u ON u.id=m.user_id
        WHERE e.circle_id=? AND e.item_id=? ORDER BY e.rowid`)
        .all(circleId, row.id) as {
        id: string;
        sender_member_id: string;
        preset: EncouragementPreset;
        created_at: string;
        name: string;
      }[];
      return {
        id: row.id,
        authorMemberId: row.author_member_id,
        authorName: row.name,
        kind: row.kind,
        text: row.text,
        createdAt: row.created_at,
        encouragements: encouragements.map((item) => ({
          id: item.id,
          senderMemberId: item.sender_member_id,
          senderName: item.name,
          preset: item.preset,
          createdAt: item.created_at,
        })),
      };
    });
    return {
      circle: this.summary(user, access),
      members: members.map((member) => ({
        id: member.id,
        displayName: member.name,
        role: member.user_id === access.owner_id ? "owner" : "member",
        isSelf: member.user_id === user,
        joinedAt: member.joined_at,
      })),
      items,
    };
  }

  private receipt(
    user: string,
    requestId: string,
    operation: string,
    input: unknown,
  ): Receipt | undefined {
    const receipt = this.database
      .prepare(
        "SELECT operation,digest,circle_id,member_id,resource_type,resource_id FROM circle_receipt WHERE owner_id=? AND request_id=?",
      )
      .get(user, requestId) as Receipt | undefined;
    if (
      receipt &&
      (receipt.operation !== operation || receipt.digest !== hash(JSON.stringify(input)))
    )
      throw new DomainError("idempotency_conflict", 409);
    return receipt;
  }

  private saveReceipt(
    user: string,
    input: CircleRequestInput,
    operation: string,
    access: Access,
    type: ResourceType,
    resourceId: string,
  ): void {
    this.database
      .prepare(
        "INSERT INTO circle_receipt(owner_id,request_id,operation,digest,circle_id,member_id,resource_type,resource_id) VALUES(?,?,?,?,?,?,?,?)",
      )
      .run(
        user,
        input.requestId,
        operation,
        hash(JSON.stringify(input)),
        access.id,
        access.member_id,
        type,
        resourceId,
      );
  }

  private replayAccess(
    user: string,
    receipt: Receipt,
    access = this.access(user, receipt.circle_id),
  ): Access {
    if (access.id !== receipt.circle_id || access.member_id !== receipt.member_id)
      throw new DomainError("not_found", 404);
    // Receipts intentionally outlive deleted shared resources, preventing resurrection.
    const tables: Record<ResourceType, string> = {
      circle: "study_circle",
      invite: "circle_invite",
      item: "circle_item",
      member: "circle_member",
    };
    const table = tables[receipt.resource_type];
    if (
      !table ||
      !this.database.prepare(`SELECT id FROM ${table} WHERE id=?`).get(receipt.resource_id)
    )
      throw new DomainError("not_found", 404);
    return access;
  }

  private write(
    user: string,
    circleId: string,
    input: CircleRequestInput,
    operation: string,
    type: ResourceType,
    ownerOnly: boolean,
    action: (access: Access) => string,
  ): string {
    return this.database
      .transaction(() => {
        const access = this.access(user, circleId, ownerOnly);
        const receipt = this.receipt(user, input.requestId, operation, input);
        if (receipt) {
          this.replayAccess(user, receipt, access);
          return receipt.resource_id;
        }
        const resourceId = action(access);
        this.saveReceipt(user, input, operation, access, type, resourceId);
        return resourceId;
      })
      .immediate();
  }

  private checkCircleCapacity(user: string): void {
    if (
      this.count("SELECT count(*) AS count FROM circle_member WHERE user_id=?", user) >=
      CIRCLE_LIMITS.circles
    )
      throw new DomainError("circle_limit", 409);
  }

  create(user: string, input: CreateCircleInput): { circleId: string } {
    return this.database
      .transaction(() => {
        const receipt = this.receipt(user, input.requestId, "circle:create", input);
        if (receipt) {
          this.replayAccess(user, receipt);
          return { circleId: receipt.circle_id };
        }
        this.checkCircleCapacity(user);
        const id = randomUUID();
        const memberId = randomUUID();
        const now = this.clock().toISOString();
        this.database
          .prepare("INSERT INTO study_circle(id,owner_id,name,created_at) VALUES(?,?,?,?)")
          .run(id, user, input.name, now);
        this.database
          .prepare("INSERT INTO circle_member(id,circle_id,user_id,joined_at) VALUES(?,?,?,?)")
          .run(memberId, id, user, now);
        this.saveReceipt(user, input, "circle:create", this.access(user, id), "circle", id);
        return { circleId: id };
      })
      .immediate();
  }

  private invite(circleId: string, inviteId: string): InviteRow {
    const row = this.database
      .prepare(
        "SELECT id,circle_id,created_at,expires_at,revoked_at,redeemed_at FROM circle_invite WHERE id=? AND circle_id=?",
      )
      .get(inviteId, circleId) as InviteRow | undefined;
    if (!row) throw new DomainError("not_found", 404);
    return row;
  }

  private inviteDto(row: InviteRow): CircleInvite {
    return {
      id: row.id,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      status: row.redeemed_at
        ? "redeemed"
        : row.revoked_at
          ? "revoked"
          : this.clock().toISOString() >= row.expires_at
            ? "expired"
            : "active",
    };
  }

  invites(user: string, circleId: string): CircleInvite[] {
    this.access(user, circleId, true);
    const rows = this.database
      .prepare(
        "SELECT id,circle_id,created_at,expires_at,revoked_at,redeemed_at FROM circle_invite WHERE circle_id=? AND revoked_at IS NULL AND redeemed_at IS NULL AND expires_at>? ORDER BY rowid DESC",
      )
      .all(circleId, this.clock().toISOString()) as InviteRow[];
    return rows.map((row) => this.inviteDto(row));
  }

  createInvite(user: string, circleId: string, input: CircleRequestInput): CircleInviteCreated {
    let token: string | null = null;
    const id = this.write(
      user,
      circleId,
      input,
      `invite:create:${circleId}`,
      "invite",
      true,
      () => {
        const now = this.clock();
        if (
          this.count(
            "SELECT count(*) AS count FROM circle_invite WHERE circle_id=? AND revoked_at IS NULL AND redeemed_at IS NULL AND expires_at>?",
            circleId,
            now.toISOString(),
          ) >= CIRCLE_LIMITS.invites
        )
          throw new DomainError("invite_limit", 409);
        const id = randomUUID();
        token = randomBytes(32).toString("base64url");
        this.database
          .prepare(
            "INSERT INTO circle_invite(id,circle_id,creator_id,token_hash,created_at,expires_at) VALUES(?,?,?,?,?,?)",
          )
          .run(
            id,
            circleId,
            user,
            hash(token),
            now.toISOString(),
            new Date(now.getTime() + CIRCLE_LIMITS.inviteHours * 3600000).toISOString(),
          );
        return id;
      },
    );
    return { invite: this.inviteDto(this.invite(circleId, id)), token };
  }

  revokeInvite(
    user: string,
    circleId: string,
    inviteId: string,
    input: CircleRequestInput,
  ): { ok: true } {
    this.write(
      user,
      circleId,
      input,
      `invite:revoke:${circleId}:${inviteId}`,
      "invite",
      true,
      () => {
        const invite = this.invite(circleId, inviteId);
        if (invite.redeemed_at) throw new DomainError("invite_unavailable", 410);
        this.database
          .prepare("UPDATE circle_invite SET revoked_at=COALESCE(revoked_at,?) WHERE id=?")
          .run(this.clock().toISOString(), inviteId);
        return inviteId;
      },
    );
    return ok();
  }

  redeem(user: string, input: RedeemCircleInviteInput): { circleId: string } {
    return this.database
      .transaction(() => {
        const receipt = this.receipt(user, input.requestId, "invite:redeem", input);
        if (receipt) {
          this.replayAccess(user, receipt);
          return { circleId: receipt.circle_id };
        }
        const invite = this.database
          .prepare(`SELECT i.id,i.circle_id,i.created_at,i.expires_at,i.revoked_at,i.redeemed_at
        FROM circle_invite i JOIN study_circle c ON c.id=i.circle_id WHERE i.token_hash=? AND c.closed_at IS NULL`)
          .get(hash(input.token)) as InviteRow | undefined;
        if (!invite || this.inviteDto(invite).status !== "active")
          throw new DomainError("invite_unavailable", 410);
        if (
          this.database
            .prepare("SELECT id FROM circle_member WHERE circle_id=? AND user_id=?")
            .get(invite.circle_id, user)
        )
          throw new DomainError("already_member", 409);
        this.checkCircleCapacity(user);
        if (
          this.count(
            "SELECT count(*) AS count FROM circle_member WHERE circle_id=?",
            invite.circle_id,
          ) >= CIRCLE_LIMITS.members
        )
          throw new DomainError("member_limit", 409);
        const memberId = randomUUID();
        const now = this.clock().toISOString();
        this.database
          .prepare("INSERT INTO circle_member(id,circle_id,user_id,joined_at) VALUES(?,?,?,?)")
          .run(memberId, invite.circle_id, user, now);
        this.database
          .prepare("UPDATE circle_invite SET redeemed_at=?,redeemed_member_id=? WHERE id=?")
          .run(now, memberId, invite.id);
        this.saveReceipt(
          user,
          input,
          "invite:redeem",
          this.access(user, invite.circle_id),
          "member",
          memberId,
        );
        return { circleId: invite.circle_id };
      })
      .immediate();
  }

  share(user: string, circleId: string, input: ShareCircleItemInput): { itemId: string } {
    const itemId = this.write(
      user,
      circleId,
      input,
      `item:create:${circleId}`,
      "item",
      false,
      (access) => {
        if (
          this.count("SELECT count(*) AS count FROM circle_item WHERE circle_id=?", circleId) >=
          CIRCLE_LIMITS.items
        )
          throw new DomainError("shared_item_limit", 409);
        const id = randomUUID();
        this.database
          .prepare(
            "INSERT INTO circle_item(id,circle_id,author_member_id,kind,text,created_at) VALUES(?,?,?,?,?,?)",
          )
          .run(id, circleId, access.member_id, input.kind, input.text, this.clock().toISOString());
        return id;
      },
    );
    return { itemId };
  }

  private item(circleId: string, itemId: string): { author_member_id: string } {
    const row = this.database
      .prepare("SELECT author_member_id FROM circle_item WHERE circle_id=? AND id=?")
      .get(circleId, itemId) as { author_member_id: string } | undefined;
    if (!row) throw new DomainError("not_found", 404);
    return row;
  }

  deleteItem(
    user: string,
    circleId: string,
    itemId: string,
    input: CircleRequestInput,
  ): { ok: true } {
    this.write(
      user,
      circleId,
      input,
      `item:delete:${circleId}:${itemId}`,
      "item",
      false,
      (access) => {
        if (this.item(circleId, itemId).author_member_id !== access.member_id)
          throw new DomainError("shared_item_owner_required", 403);
        this.database
          .prepare("DELETE FROM circle_item WHERE circle_id=? AND id=?")
          .run(circleId, itemId);
        return itemId;
      },
    );
    return ok();
  }

  encourage(
    user: string,
    circleId: string,
    itemId: string,
    input: CircleEncouragementInput,
  ): { ok: true } {
    this.write(
      user,
      circleId,
      input,
      `item:encourage:${circleId}:${itemId}`,
      "item",
      false,
      (access) => {
        if (this.item(circleId, itemId).author_member_id === access.member_id)
          throw new DomainError("not_allowed", 403);
        this.database
          .prepare(`INSERT INTO circle_encouragement(id,circle_id,item_id,sender_member_id,preset,created_at) VALUES(?,?,?,?,?,?)
        ON CONFLICT(item_id,sender_member_id) DO UPDATE SET preset=excluded.preset,created_at=excluded.created_at`)
          .run(
            randomUUID(),
            circleId,
            itemId,
            access.member_id,
            input.preset,
            this.clock().toISOString(),
          );
        return itemId;
      },
    );
    return ok();
  }

  leave(user: string, circleId: string, input: CircleRequestInput): { ok: true } {
    this.write(user, circleId, input, `member:leave:${circleId}`, "member", false, (access) => {
      if (access.owner_id === user) throw new DomainError("owner_must_close", 409);
      this.database.prepare("DELETE FROM circle_member WHERE id=?").run(access.member_id);
      return access.member_id;
    });
    return ok();
  }

  remove(
    user: string,
    circleId: string,
    memberId: string,
    input: CircleRequestInput,
  ): { ok: true } {
    this.write(
      user,
      circleId,
      input,
      `member:remove:${circleId}:${memberId}`,
      "member",
      true,
      (access) => {
        const member = this.database
          .prepare("SELECT id FROM circle_member WHERE circle_id=? AND id=?")
          .get(circleId, memberId);
        if (!member) throw new DomainError("not_found", 404);
        if (memberId === access.member_id) throw new DomainError("owner_must_close", 409);
        this.database
          .prepare("DELETE FROM circle_member WHERE circle_id=? AND id=?")
          .run(circleId, memberId);
        return memberId;
      },
    );
    return ok();
  }

  close(user: string, circleId: string, input: CircleRequestInput): { ok: true } {
    this.write(user, circleId, input, `circle:close:${circleId}`, "circle", true, () => {
      const now = this.clock().toISOString();
      this.database.prepare("UPDATE study_circle SET closed_at=? WHERE id=?").run(now, circleId);
      this.database
        .prepare(
          "UPDATE circle_invite SET revoked_at=COALESCE(revoked_at,?) WHERE circle_id=? AND redeemed_at IS NULL",
        )
        .run(now, circleId);
      this.database.prepare("DELETE FROM circle_member WHERE circle_id=?").run(circleId);
      return circleId;
    });
    return ok();
  }
}
