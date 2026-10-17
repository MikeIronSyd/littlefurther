import type { AiAssistInput, AiAssistResponse, AiStatus } from "../shared/ai-contracts.js";
import type { LearningSource } from "../shared/contracts.js";
import { errorKey, RequestError, request } from "./api.js";
import { bind, dateLabel, getLocale, type MessageKey, message } from "./i18n.js";
import { button, el, focusFailure, text } from "./ui.js";

const activeOperations = new Set<() => void>();
export function cancelAiOperations(): void {
  for (const cancel of activeOperations) cancel();
}

function uniqueSources(sources: LearningSource[]): LearningSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.id)) return false;
    seen.add(source.id);
    return true;
  });
}

function sourceLink(source: LearningSource): HTMLAnchorElement {
  const link = el("a", "resource-link", source.title ?? source.url);
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

export function sourceLinks(sources: LearningSource[]): HTMLElement {
  const list = el("ul", "ai-source-links");
  for (const source of uniqueSources(sources)) {
    const row = el("li", "", sourceLink(source));
    row.dataset.sourceId = source.id;
    list.append(row);
  }
  return list;
}

export function sourceList(sources: LearningSource[]): HTMLElement {
  const list = el("ul", "ai-source-list");
  for (const source of uniqueSources(sources)) {
    const domain = new URL(source.url).hostname;
    const publisher = source.publisher === domain ? domain : `${domain} · ${source.publisher}`;
    const row = el("li", "", sourceLink(source), el("p", "hint", publisher));
    row.dataset.sourceId = source.id;
    const details = el("details", "ai-source-details");
    const summary = text("summary", "aiSourceDetails", "ai-source-summary", {
      title: source.title ?? source.url,
    });
    const observed = el("p", "hint");
    bind(observed, () => {
      observed.textContent = message("aiSourceObserved", { date: dateLabel(source.observedAt) });
    });
    details.append(
      summary,
      observed,
      text("p", source.kind === "user_supplied" ? "aiSourceSupplied" : "aiSourceSearch", "hint"),
    );
    const language = el("p", "hint");
    const evidence = el("p", "hint");
    const evidenceKeys = {
      supplied: "aiEvidenceSupplied",
      listed: "aiEvidenceListed",
      cited: "aiEvidenceCited",
      opened: "aiEvidenceOpened",
    } as const;
    bind(language, () => {
      language.textContent = message("aiSourceLanguage", {
        language: source.languageHint === "unknown" ? message("aiUnknown") : source.languageHint,
      });
    });
    bind(evidence, () => {
      evidence.textContent = source.evidence
        .map((value) => message(evidenceKeys[value]))
        .join(" · ");
    });
    details.append(language, evidence);
    row.append(details);
    list.append(row);
  }
  return list;
}

interface AiPanelOptions {
  title: MessageKey;
  action: MessageKey;
  disclosure: MessageKey;
  controls?: HTMLElement[];
  build: () => AiAssistInput | null;
  current: () => boolean;
  signature: () => string;
  watch?: HTMLElement[];
  use?: (result: AiAssistResponse) => void;
  canUse?: () => boolean;
  useLabel?: MessageKey;
  suggestionChanged?: (available: boolean) => void;
  initiallyExpanded?: boolean;
}

// Each inline assistant owns its operation and result. It never locks the manual form.
export function aiPanel(options: AiPanelOptions): HTMLElement {
  const panel = el("section", "ai-assistance");
  panel.dataset.aiPanel = "true";
  const heading = text("h2", options.title);
  heading.id = `ai-${crypto.randomUUID()}`;
  panel.setAttribute("aria-labelledby", heading.id);
  const disclosure = el("details", "ai-disclosure");
  disclosure.open = options.initiallyExpanded ?? false;
  const summary = el(
    "summary",
    "ai-summary",
    heading,
    text("span", options.action, "ai-summary-action"),
  );
  heading.classList.add("ai-summary-title");
  const body = el("div", "ai-body");
  const ready = el("p", "hint ai-ready");
  ready.setAttribute("role", "status");
  ready.setAttribute("aria-live", "polite");
  ready.setAttribute("aria-atomic", "true");
  const status = el("div", "ai-status");
  const resultHost = el("div", "ai-result");
  let controller: AbortController | null = null;
  let version = 0;
  let resultSignature = "";
  let response: AiAssistResponse | null = null;
  const current = (): boolean =>
    panel.isConnected &&
    options.current() &&
    !panel.parentElement?.closest('[aria-busy="true"], [inert]');
  const invalidate = (): void => {
    const wasPending = Boolean(controller);
    version += 1;
    controller?.abort();
    controller = null;
    activeOperations.delete(invalidate);
    panel.removeAttribute("aria-busy");
    run.disabled = false;
    cancel.hidden = true;
    response = null;
    ready.textContent = "";
    resultHost.replaceChildren();
    options.suggestionChanged?.(false);
    if (wasPending) status.replaceChildren(text("p", "aiCancelled", "hint"));
  };
  const cancel = button(
    "aiCancel",
    () => {
      invalidate();
      status.replaceChildren(text("p", "aiCancelled", "hint"));
      run.focus();
    },
    "button subtle",
  );
  cancel.hidden = true;
  const render = (result: AiAssistResponse): void => {
    resultHost.replaceChildren();
    if (result.kind === "insufficient") {
      resultHost.append(text("h3", "aiInsufficient"), el("p", "", result.reason));
    } else if (result.kind === "guidance") {
      resultHost.append(el("h3", "", result.title), el("p", "ai-prose", result.summary));
      if (result.microActions.length)
        resultHost.append(
          el("ol", "ai-micro-actions", ...result.microActions.map((item) => el("li", "", item))),
        );
      if (result.nextAction) resultHost.append(el("p", "ai-prose", result.nextAction));
    } else if (result.kind === "circle") {
      resultHost.append(text("h3", "aiSuggestedCopy"), el("p", "ai-prose", result.text));
    } else {
      resultHost.append(
        el("h3", "", result.goal),
        text("h3", "outcome"),
        el("p", "", result.outcome),
        text("h3", "prerequisites"),
        el("p", "", result.prerequisites),
      );
      resultHost.append(
        el(
          "ol",
          "ai-plan-preview",
          ...result.steps.map((step) =>
            el(
              "li",
              "",
              el("p", "", step.title),
              text("p", "estimated", "hint", { minutes: step.estimatedMinutes }),
              sourceLinks(result.sources.filter((source) => step.sourceIds.includes(source.id))),
            ),
          ),
        ),
      );
      resultHost.append(
        text("h3", "resources"),
        sourceList(result.sources),
        text("p", "aiSourceLimits", "hint"),
      );
    }
    resultHost.append(text("p", "aiReview", "hint"));
    const discard = button(
      "aiDiscard",
      () => {
        invalidate();
        status.replaceChildren();
        run.focus();
      },
      "button subtle",
    );
    const use =
      options.use && result.kind !== "insufficient"
        ? button(
            options.useLabel ?? "aiUse",
            () => {
              if (
                !current() ||
                !response ||
                resultSignature !== options.signature() ||
                options.canUse?.() === false
              ) {
                invalidate();
                return;
              }
              options.use?.(response);
              invalidate();
              status.replaceChildren(text("p", "aiAccepted", "hint"));
            },
            "button",
          )
        : null;
    resultHost.append(el("div", "form-actions", use, discard));
    options.suggestionChanged?.(result.kind !== "insufficient" && Boolean(options.use));
    // Arrival is asynchronous: announce it without moving the learner away from
    // another field, or reopening a deliberately collapsed assistant.
    ready.textContent = message("aiReady");
  };
  const run = button(
    options.action,
    () => {
      if (!current() || controller) return;
      const body = options.build();
      if (!body) return;
      invalidate();
      const operation = ++version;
      const locale = getLocale();
      const signature = options.signature();
      const abort = new AbortController();
      controller = abort;
      activeOperations.add(invalidate);
      run.disabled = true;
      cancel.hidden = false;
      panel.setAttribute("aria-busy", "true");
      const pending = text("p", "aiPending", "hint");
      pending.setAttribute("role", "status");
      status.replaceChildren(pending);
      const timeout = window.setTimeout(() => abort.abort(), 90_000);
      void request<AiAssistResponse>("/api/ai/assist", "POST", body, abort.signal)
        .then((result) => {
          if (
            !current() ||
            operation !== version ||
            locale !== getLocale() ||
            signature !== options.signature() ||
            abort.signal.aborted
          )
            return;
          response = result;
          resultSignature = signature;
          status.replaceChildren();
          render(result);
        })
        .catch((error: unknown) => {
          if (!current() || operation !== version) return;
          const codes: Record<string, MessageKey> = {
            ai_connection_failed: "aiConnection",
            ai_cancelled: "aiCancelled",
            source_limit: "aiSourcesUnavailable",
            source_unavailable: "aiSourcesUnavailable",
          };
          const key: MessageKey =
            error instanceof RequestError && codes[error.code]
              ? (codes[error.code] ?? "aiInvalid")
              : abort.signal.aborted
                ? "aiTimeout"
                : error instanceof RequestError &&
                    ["ai_quota", "ai_unavailable"].includes(error.code)
                  ? "aiUnavailable"
                  : error instanceof RequestError &&
                      ["ai_rate_limited", "ai_busy"].includes(error.code)
                    ? "aiBusy"
                    : error instanceof RequestError && error.code === "ai_refused"
                      ? "aiRefused"
                      : error instanceof RequestError &&
                          ["ai_invalid_result", "ai_invalid_output", "ai_incomplete"].includes(
                            error.code,
                          )
                        ? "aiInvalid"
                        : error instanceof RequestError && error.code === "ai_timeout"
                          ? "aiTimeout"
                          : errorKey(error);
          const failure = text("p", key, "notice error");
          failure.setAttribute("role", "alert");
          status.replaceChildren(failure, text("p", "aiManual", "hint"));
          if (disclosure.open && panel.contains(document.activeElement))
            focusFailure(status, current);
          if (error instanceof RequestError && error.status === 401)
            window.dispatchEvent(new Event("littlefurther-session-expired"));
        })
        .finally(() => {
          window.clearTimeout(timeout);
          if (operation !== version) return;
          // View/language changes must also clear a ready, unaccepted suggestion.
          if (!response) activeOperations.delete(invalidate);
          controller = null;
          run.disabled = false;
          cancel.hidden = true;
          panel.removeAttribute("aria-busy");
        });
    },
    "button subtle",
  );
  for (const node of options.watch ?? []) {
    for (const event of ["input", "change"])
      node.addEventListener(event, () => {
        if (controller || response) {
          invalidate();
          status.replaceChildren(text("p", "aiChanged", "hint"));
        }
      });
  }
  body.append(
    text("p", options.disclosure, "hint"),
    ...(options.controls ?? []),
    el("div", "form-actions", run, cancel),
    status,
    resultHost,
  );
  disclosure.append(summary, body);
  panel.append(disclosure, ready);
  bind(ready, () => {
    ready.textContent = response ? message("aiReady") : "";
  });
  // Abort when the enclosing view disappears, including circle's internal navigation.
  const observer = new MutationObserver(() => {
    if (!panel.isConnected) {
      invalidate();
      observer.disconnect();
    }
  });
  queueMicrotask(() => {
    if (panel.isConnected)
      observer.observe(document.getElementById("app") ?? document.body, {
        childList: true,
        subtree: true,
      });
  });
  void request<AiStatus>("/api/ai/status")
    .then((state) => {
      if (current() && !state.available && !controller && !response)
        status.replaceChildren(text("p", "aiUnavailable", "hint"));
    })
    .catch(() => {});
  bind(heading, () => {
    heading.textContent = message(options.title);
  });
  return panel;
}
