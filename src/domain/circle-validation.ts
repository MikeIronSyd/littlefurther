import {
  CIRCLE_LIMITS,
  ENCOURAGEMENT_PRESETS,
  type CircleEncouragementInput,
  type CircleRequestInput,
  type CreateCircleInput,
  type EncouragementPreset,
  type RedeemCircleInviteInput,
  type ShareCircleItemInput,
} from "../shared/contracts.js";
import { DomainError, identifier, record, text } from "./validation.js";

function strict(value: unknown, allowed: string[]): Record<string, unknown> {
  const input = record(value);
  for (const key of Object.keys(input))
    if (!allowed.includes(key)) throw new DomainError("invalid_input", 400, key);
  return input;
}
export function circleRequestInput(value: unknown): CircleRequestInput {
  const input = strict(value, ["requestId"]);
  return { requestId: identifier(input.requestId, "requestId") };
}
export function createCircleInput(value: unknown): CreateCircleInput {
  const input = strict(value, ["requestId", "name"]);
  return {
    requestId: identifier(input.requestId, "requestId"),
    name: text(input.name, "name", CIRCLE_LIMITS.name),
  };
}
export function redeemCircleInviteInput(value: unknown): RedeemCircleInviteInput {
  const input = strict(value, ["requestId", "token"]);
  if (typeof input.token !== "string" || !/^[A-Za-z0-9_-]{43}$/u.test(input.token))
    throw new DomainError("invalid_input", 400, "token");
  return { requestId: identifier(input.requestId, "requestId"), token: input.token };
}
export function shareCircleItemInput(value: unknown): ShareCircleItemInput {
  const input = strict(value, ["requestId", "kind", "text"]);
  if (input.kind !== "commitment" && input.kind !== "check_in")
    throw new DomainError("invalid_input", 400, "kind");
  return {
    requestId: identifier(input.requestId, "requestId"),
    kind: input.kind,
    text: text(input.text, "text", CIRCLE_LIMITS.text),
  };
}
export function circleEncouragementInput(value: unknown): CircleEncouragementInput {
  const input = strict(value, ["requestId", "preset"]);
  if (!ENCOURAGEMENT_PRESETS.includes(input.preset as EncouragementPreset))
    throw new DomainError("invalid_input", 400, "preset");
  return {
    requestId: identifier(input.requestId, "requestId"),
    preset: input.preset as EncouragementPreset,
  };
}
