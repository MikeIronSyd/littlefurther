import type { Locale } from "../shared/contracts.js";

const en = {
  appName: "App name",
  learning: "My learning",
  journeys: "Journeys",
  activity: "Activity",
  navigation: "Navigation",
  openNav: "Open navigation",
  collapseNav: "Collapse sidebar",
  expandNav: "Expand sidebar",
  close: "Close",
  skip: "Skip to content",
  darkMode: "Dark mode",
  language: "Language",
  account: "Account",
  signOut: "Sign out",
  localDemo: "Local learning demo · Keep the local server running",
  loading: "Loading your learning…",
  retry: "Try again",
  save: "Save",
  cancel: "Cancel",
  back: "Back",
  next: "Continue",
  optional: "Optional",
  remove: "Remove",
  edit: "Edit",
  add: "Add",
  saved: "Saved",
  saving: "Saving…",
  signIn: "Sign in",
  signUp: "Create an account",
  welcome: "Make room for your next step.",
  welcomeCopy:
    "Build a manageable plan. Keep a record of your effort. Return whenever you are ready.",
  localAccount:
    "Your account and study records stay on this local server. Email verification and password recovery are unavailable in this demo.",
  email: "Email address",
  password: "Password",
  name: "Display name",
  passwordHint: "Use 8–128 characters.",
  haveAccount: "Already have an account? Sign in",
  needAccount: "New here? Create an account",
  credentials: "Check your email and password, then try again.",
  accountError: "We could not create this account. Check your details or try signing in.",
  networkError:
    "We could not reach the local server. Keep this page open, check that the server is running, and retry. Your unsaved input is still here.",
  saveError: "Your changes were not saved. Check your input and try again.",
  stale:
    "This plan changed in another window. Your input is still here. Reload the saved plan before trying again.",
  reloadPlan: "Reload saved plan",
  signedOut: "Your session ended. Sign in again to continue.",
  validation: "Check your input and use valid dates, whole minutes, and http or https links.",
  forbidden: "This request is unavailable for this account.",
  profileTitle: "Make the dates work for you",
  profileCopy:
    "Confirm the timezone used for your study dates. Your device’s timezone is only a suggestion.",
  timezone: "Timezone",
  timezoneHint: "An IANA name, for example Africa/Lagos or Europe/Paris.",
  confirmProfile: "Save preferences and continue",
  preferences: "Preferences",
  profileSaved: "Preferences saved.",
  invalidTimezone: "Enter a valid timezone, such as Africa/Lagos.",
  nextTitle: "Your next step",
  keepGoing: "Keep going, one step at a time.",
  createGoal: "Create a learning plan",
  noPlan: "What would you like to work toward?",
  noPlanCopy:
    "Start with a supported goal or bring your own topics. You can review every step before saving.",
  choosePlan: "Choose a journey",
  stepOf: "Step {number} of {total}",
  estimated: "Estimated {minutes} minutes",
  studyStart: "Start study session",
  shortStart: "Try a 5-minute restart",
  editStep: "Edit step",
  editPlan: "Edit plan",
  finished: "You have completed this plan’s active steps.",
  finishedCopy:
    "Your work is recorded. Review your history, adjust your plan, or begin another journey.",
  noSteps: "Your plan has no active steps.",
  noStepsCopy: "Add an action when you are ready. Your earlier activity is still in your history.",
  currentProgress: "{done} of {total} steps complete",
  selfReport: "Completion is self-reported work, not a measure of mastery.",
  yourPath: "Your path",
  complete: "Complete",
  nextAction: "Next action",
  upcoming: "Upcoming",
  everyDay: "Every study day counts.",
  studyDays: "{count} study days",
  effort: "{count} sessions · {minutes} minutes studied",
  reported: "Minutes are learner-reported.",
  history: "Retained history",
  historyCopy:
    "Earlier activity and completed work stay in your history when the active plan changes.",
  pastCompletions: "{count} completions recorded in history",
  sessionCount: "{count} study sessions",
  noActivity: "No study activity yet. Your first session can be a small one.",
  afterStudy: "After studying",
  reflectionCopy:
    "Add a private reflection during your session, or skip it and choose your next step.",
  returnTitle: "Your completed work is still here.",
  returnCopy: "You can restart with five minutes whenever you are ready.",
  reviewRestartDates: "Review restart dates",
  comebackTitle: "Review your revised schedule",
  comebackHelp:
    "Move unfinished dates together while keeping their spacing. Your completed work and history stay unchanged.",
  backLearning: "Back to my learning",
  restartDate: "Restart date",
  restartDateHint:
    "Choose the date for your first unfinished step, then preview every proposed date.",
  previewDates: "Preview revised dates",
  previewingDates: "Preparing your date preview…",
  previewHelp: "Choose a restart date and preview the changes. Nothing moves until you apply them.",
  dateComparison: "Current and proposed dates",
  currentDate: "Current date",
  proposedDate: "Proposed date",
  shiftEarlier: "{count} unfinished steps will move {days} calendar days earlier.",
  shiftLater: "{count} unfinished steps will move {days} calendar days later.",
  retainedWork: "Your completed work stays",
  retainedHelp: "Completed-step dates, private notes and earlier effort remain in your history.",
  noCompletedSteps: "No active steps are marked complete yet.",
  acknowledgeConflicts:
    "I understand these conflicts. My target and availability will stay unchanged.",
  previewOnly: "Preview only. Your plan has not changed.",
  applyingDates: "Applying the reviewed dates…",
  uncertainDates: "The result is unconfirmed. Retry the same change or reload the saved plan.",
  applyDates: "Apply revised plan",
  retryComeback: "Retry the same change",
  returnSavedPlan: "Open saved plan",
  unchangedDates:
    "These dates are already in your plan. Choose a different restart date to move them.",
  comebackUnavailable:
    "There are no unfinished steps to reschedule. Your earlier work stays recorded.",
  comebackBounds:
    "This move would put at least one step outside 2000–2100. Choose another restart date; no dates were changed.",
  comebackStale:
    "This plan changed after your preview. Reload the saved plan, then preview again before applying any dates.",
  comebackRetryConflict:
    "This request no longer matches its earlier version. Reload the saved plan and make a new preview.",
  comebackUncertain:
    "We could not confirm the response. Your dates may have been saved. Retry the same change safely, or reload the saved plan to check.",
  comebackSavedRefresh:
    "Your revised dates were saved, but the latest plan could not be loaded. Keep the local server running and open the saved plan again.",
  comebackReloaded:
    "Saved plan loaded. Check your restart date and preview again; nothing will be applied automatically.",
  comebackSaved:
    "Your revised dates are saved. Your completed work and earlier effort are unchanged.",
  circleTitle: "Study together",
  circleCopy:
    "Private peer circles are coming in the next build. You can keep studying on your own.",
  resources: "Your references",
  external: "Opens an external resource; internet may be needed.",
  target: "Fixed target date",
  targetOptional: "Fixed target date (optional)",
  conflicts: "Review your schedule",
  conflictTarget: "{step}: {date} is after your target date.",
  conflictAvailability: "{step}: {date} is outside your available dates.",
  conflictNote:
    "These are warnings. Your target and availability will not be changed automatically.",
  planTitle: "Shape a plan you can return to",
  editTitle: "Adjust your learning plan",
  goal: "Learning goal",
  template: "Start from",
  manual: "My own topics or course sections",
  templateHint:
    "Starter actions are suggestions. Estimates are editable. A goal title alone does not generate a curriculum.",
  topics: "Your topics or sections",
  topicsHint: "One action per line. Bring the topics from material you already use.",
  makeDraft: "Review draft steps",
  templateSources: "Template sources",
  prerequisites: "Before you start",
  outcome: "Supported outcome",
  checked: "Checked {date}",
  availability: "Dates you are available",
  availabilityHint:
    "Enter dates as YYYY-MM-DD, separated by commas or new lines. You can study at your own pace.",
  referenceLinks: "Reference links (optional)",
  referenceHint:
    "One absolute http or https URL per line. Links are saved without fetching their content.",
  reviewTitle: "Review every step",
  reviewHint:
    "Edit the order, dates and estimates. Saving confirms this plan; nothing is saved before that.",
  stepTitle: "Action",
  date: "Study date",
  minutes: "Estimated minutes",
  addStep: "Add a step",
  moveUp: "Move step up",
  moveDown: "Move step down",
  confirmPlan: "Confirm and save plan",
  savePlan: "Save revised plan",
  completedLocked: "Completed details are kept unchanged. Removing this step archives its history.",
  removeConfirm:
    "I understand that removing {count} steps changes the active scope. Earlier work remains in history.",
  invalidDraft: "Add at least one topic and one valid available date before reviewing.",
  emptyScopeHint: "This will leave no active steps. Your history will be retained.",
  scopeChanged: "Active scope changed from {before} to {after} steps.",
  planSaved: "Your plan is saved. Choose your next step when you are ready.",
  sessionTitle: "A little study is still study",
  sessionHelp:
    "Use your learning material, then record the minutes you studied. A session does not automatically complete a step.",
  studiedMinutes: "Minutes you studied",
  reflection: "Private reflection (optional)",
  reflectionHint: "A note for yourself. This is never shared with peers.",
  saveSession: "Save study session",
  sessionSaved: "Your study session is saved.",
  completeStep: "Mark this step complete",
  completionHelp: "Choose this separately when you have finished the whole action.",
  completionSaved: "Step completed. Your earlier effort is still recorded.",
  returnLearning: "Choose the next action",
  completionAt: "Completed {date}",
  sessionAt: "Studied {date}",
  privateNote: "Private reflection",
  noReflection: "No reflection added",
  goJourney: "Open journey",
  planCount: "{count} active steps",
  changedScope: "Scope changes",
  notSaved: "Unsaved changes",
  unsavedLeave: "Leave this form and discard your unsaved input?",
  profileRequired: "Confirm your timezone before creating a plan.",
  invalidLink: "Use absolute http or https links without a username or password.",
  invalidDate: "Use valid calendar dates between 2000 and 2100.",
  limitError: "One or more values exceed the allowed size. Shorten your input and try again.",
  genericError: "That action could not be completed. Your input is preserved; please try again.",
} as const;

type MessageKey = keyof typeof en;
const fr: Record<MessageKey, string> = {
  appName: "Nom de l’app",
  learning: "Mon apprentissage",
  journeys: "Parcours",
  activity: "Activité",
  navigation: "Navigation",
  openNav: "Ouvrir la navigation",
  collapseNav: "Réduire la barre latérale",
  expandNav: "Développer la barre latérale",
  close: "Fermer",
  skip: "Aller au contenu",
  darkMode: "Mode sombre",
  language: "Langue",
  account: "Compte",
  signOut: "Se déconnecter",
  localDemo: "Démo d’apprentissage locale · Gardez le serveur local en marche",
  loading: "Chargement de votre parcours…",
  retry: "Réessayer",
  save: "Enregistrer",
  cancel: "Annuler",
  back: "Retour",
  next: "Continuer",
  optional: "Facultatif",
  remove: "Retirer",
  edit: "Modifier",
  add: "Ajouter",
  saved: "Enregistré",
  saving: "Enregistrement…",
  signIn: "Se connecter",
  signUp: "Créer un compte",
  welcome: "Faites place à votre prochaine étape.",
  welcomeCopy:
    "Préparez un parcours à votre rythme. Gardez une trace de vos efforts. Reprenez quand vous le souhaitez.",
  localAccount:
    "Votre compte et vos données restent sur ce serveur local. Cette démo ne propose ni vérification d’adresse e-mail ni récupération de mot de passe.",
  email: "Adresse e-mail",
  password: "Mot de passe",
  name: "Nom affiché",
  passwordHint: "Utilisez entre 8 et 128 caractères.",
  haveAccount: "Déjà un compte ? Se connecter",
  needAccount: "Première visite ? Créer un compte",
  credentials: "Vérifiez votre adresse e-mail et votre mot de passe, puis réessayez.",
  accountError:
    "Impossible de créer ce compte. Vérifiez vos informations ou essayez de vous connecter.",
  networkError:
    "Impossible de joindre le serveur local. Gardez cette page ouverte, vérifiez que le serveur fonctionne et réessayez. Votre saisie non enregistrée est conservée ici.",
  saveError: "Vos modifications n’ont pas été enregistrées. Vérifiez votre saisie et réessayez.",
  stale:
    "Ce parcours a changé dans une autre fenêtre. Votre saisie est conservée. Rechargez la version enregistrée avant de réessayer.",
  reloadPlan: "Recharger le parcours enregistré",
  signedOut: "Votre session a expiré. Reconnectez-vous pour continuer.",
  validation: "Vérifiez les champs, les dates, les minutes entières et les liens http ou https.",
  forbidden: "Cette demande n’est pas accessible à ce compte.",
  profileTitle: "Des dates adaptées à votre quotidien",
  profileCopy:
    "Confirmez le fuseau horaire de vos journées d’étude. Celui de votre appareil n’est qu’une suggestion.",
  timezone: "Fuseau horaire",
  timezoneHint: "Un nom IANA, par exemple Africa/Lagos ou Europe/Paris.",
  confirmProfile: "Enregistrer et continuer",
  preferences: "Préférences",
  profileSaved: "Préférences enregistrées.",
  invalidTimezone: "Saisissez un fuseau horaire valide, comme Africa/Lagos.",
  nextTitle: "Votre prochaine étape",
  keepGoing: "Continuez, une étape à la fois.",
  createGoal: "Créer un parcours",
  noPlan: "Quel objectif souhaitez-vous poursuivre ?",
  noPlanCopy:
    "Choisissez un objectif proposé ou apportez vos propres sujets. Vérifiez chaque étape avant d’enregistrer.",
  choosePlan: "Choisir un parcours",
  stepOf: "Étape {number} sur {total}",
  estimated: "Durée estimée : {minutes} minutes",
  studyStart: "Commencer une séance",
  shortStart: "Reprendre avec 5 minutes",
  editStep: "Modifier l’étape",
  editPlan: "Modifier le parcours",
  finished: "Vous avez terminé les étapes actives de ce parcours.",
  finishedCopy:
    "Votre travail est enregistré. Consultez l’historique, adaptez votre parcours ou commencez-en un autre.",
  noSteps: "Votre parcours n’a aucune étape active.",
  noStepsCopy:
    "Ajoutez une action quand vous le souhaitez. Vos activités précédentes restent dans l’historique.",
  currentProgress: "{done} étapes terminées sur {total}",
  selfReport: "L’achèvement est déclaré par vous ; ce n’est pas une mesure de maîtrise.",
  yourPath: "Votre chemin",
  complete: "Terminée",
  nextAction: "Prochaine action",
  upcoming: "À venir",
  everyDay: "Chaque jour d’étude compte.",
  studyDays: "{count} jours d’étude",
  effort: "{count} séances · {minutes} minutes étudiées",
  reported: "Les minutes sont déclarées par vous.",
  history: "Historique conservé",
  historyCopy:
    "Vos activités et votre travail terminé restent dans l’historique lorsque le parcours actif change.",
  pastCompletions: "{count} étapes terminées dans l’historique",
  sessionCount: "{count} séances d’étude",
  noActivity: "Aucune activité pour le moment. Votre première séance peut être courte.",
  afterStudy: "Après la séance",
  reflectionCopy:
    "Ajoutez une note privée pendant votre séance, ou passez à l’étape suivante sans en écrire.",
  returnTitle: "Votre travail terminé est conservé.",
  returnCopy: "Vous pouvez reprendre avec cinq minutes quand vous le souhaitez.",
  reviewRestartDates: "Revoir les dates de reprise",
  comebackTitle: "Vérifiez votre calendrier révisé",
  comebackHelp:
    "Déplacez ensemble les dates des étapes restantes en conservant leurs intervalles. Votre travail terminé et votre historique restent inchangés.",
  backLearning: "Retour à mon parcours",
  restartDate: "Date de reprise",
  restartDateHint:
    "Choisissez la date de votre première étape restante, puis vérifiez toutes les dates proposées.",
  previewDates: "Prévisualiser les dates révisées",
  previewingDates: "Préparation de l’aperçu des dates…",
  previewHelp:
    "Choisissez une date de reprise et prévisualisez les modifications. Aucune date ne change avant votre confirmation.",
  dateComparison: "Dates actuelles et proposées",
  currentDate: "Date actuelle",
  proposedDate: "Date proposée",
  shiftEarlier: "{count} étapes restantes seront avancées de {days} jours calendaires.",
  shiftLater: "{count} étapes restantes seront décalées de {days} jours calendaires.",
  retainedWork: "Votre travail terminé est conservé",
  retainedHelp:
    "Les dates des étapes terminées, vos notes privées et vos efforts antérieurs restent dans l’historique.",
  noCompletedSteps: "Aucune étape active n’est encore marquée comme terminée.",
  acknowledgeConflicts:
    "Je comprends ces conflits. Ma date cible et mes disponibilités restent inchangées.",
  previewOnly: "Aperçu uniquement. Votre parcours n’a pas changé.",
  applyingDates: "Application des dates vérifiées…",
  uncertainDates:
    "Le résultat n’est pas confirmé. Réessayez la même modification ou rechargez le parcours enregistré.",
  applyDates: "Appliquer le parcours révisé",
  retryComeback: "Réessayer la même modification",
  returnSavedPlan: "Ouvrir le parcours enregistré",
  unchangedDates:
    "Ces dates figurent déjà dans votre parcours. Choisissez une autre date de reprise pour les déplacer.",
  comebackUnavailable:
    "Il ne reste aucune étape à reprogrammer. Vos efforts antérieurs restent enregistrés.",
  comebackBounds:
    "Ce déplacement placerait au moins une étape hors de la période 2000–2100. Choisissez une autre date de reprise ; aucune date n’a changé.",
  comebackStale:
    "Ce parcours a changé après votre aperçu. Rechargez le parcours enregistré, puis créez un nouvel aperçu avant d’appliquer des dates.",
  comebackRetryConflict:
    "Cette demande ne correspond plus à sa version précédente. Rechargez le parcours enregistré et créez un nouvel aperçu.",
  comebackUncertain:
    "Nous n’avons pas pu confirmer la réponse. Vos dates ont peut-être été enregistrées. Réessayez la même modification sans risque de doublon, ou rechargez le parcours pour vérifier.",
  comebackSavedRefresh:
    "Vos dates révisées sont enregistrées, mais le dernier parcours n’a pas pu être chargé. Gardez le serveur local actif et rouvrez le parcours enregistré.",
  comebackReloaded:
    "Parcours enregistré chargé. Vérifiez la date de reprise et créez un nouvel aperçu ; rien ne sera appliqué automatiquement.",
  comebackSaved:
    "Vos dates révisées sont enregistrées. Votre travail terminé et vos efforts antérieurs restent inchangés.",
  circleTitle: "Étudier ensemble",
  circleCopy:
    "Les cercles privés arriveront dans la prochaine version. Vous pouvez continuer à étudier en solo.",
  resources: "Vos références",
  external: "Ouvre une ressource externe ; une connexion peut être nécessaire.",
  target: "Date cible fixe",
  targetOptional: "Date cible fixe (facultative)",
  conflicts: "Vérifiez votre calendrier",
  conflictTarget: "{step} : le {date} dépasse votre date cible.",
  conflictAvailability: "{step} : le {date} ne fait pas partie de vos disponibilités.",
  conflictNote:
    "Ce sont des avertissements. Votre date cible et vos disponibilités ne seront pas modifiées automatiquement.",
  planTitle: "Un parcours que vous pouvez reprendre",
  editTitle: "Adaptez votre parcours",
  goal: "Objectif d’apprentissage",
  template: "Point de départ",
  manual: "Mes propres sujets ou sections de cours",
  templateHint:
    "Les actions proposées et les durées estimées sont modifiables. Un titre seul ne génère pas de programme.",
  topics: "Vos sujets ou sections",
  topicsHint: "Une action par ligne, tirée du matériel que vous utilisez déjà.",
  makeDraft: "Vérifier les étapes proposées",
  templateSources: "Sources du modèle",
  prerequisites: "Avant de commencer",
  outcome: "Objectif du modèle",
  checked: "Vérifié le {date}",
  availability: "Vos dates disponibles",
  availabilityHint:
    "Saisissez des dates au format AAAA-MM-JJ, séparées par des virgules ou des sauts de ligne. Avancez à votre rythme.",
  referenceLinks: "Liens de référence (facultatifs)",
  referenceHint:
    "Une URL absolue http ou https par ligne. Les liens sont conservés sans télécharger leur contenu.",
  reviewTitle: "Vérifiez chaque étape",
  reviewHint:
    "Modifiez l’ordre, les dates et les durées. Rien n’est conservé avant votre confirmation.",
  stepTitle: "Action",
  date: "Date d’étude",
  minutes: "Minutes estimées",
  addStep: "Ajouter une étape",
  moveUp: "Monter l’étape",
  moveDown: "Descendre l’étape",
  confirmPlan: "Confirmer et enregistrer",
  savePlan: "Enregistrer le parcours révisé",
  completedLocked:
    "Les détails d’une étape terminée sont conservés. Son retrait archive son historique.",
  removeConfirm:
    "Je comprends que le retrait de {count} étapes modifie le parcours actif. Le travail antérieur reste dans l’historique.",
  invalidDraft:
    "Ajoutez au moins un sujet et une date disponible valide avant de vérifier les étapes.",
  emptyScopeHint: "Il ne restera aucune étape active. Votre historique sera conservé.",
  scopeChanged: "Le parcours actif est passé de {before} à {after} étapes.",
  planSaved:
    "Votre parcours est enregistré. Choisissez votre prochaine étape quand vous le souhaitez.",
  sessionTitle: "Même une courte séance compte",
  sessionHelp:
    "Étudiez avec votre matériel, puis indiquez les minutes étudiées. Une séance ne termine pas automatiquement l’étape.",
  studiedMinutes: "Minutes étudiées",
  reflection: "Note privée (facultative)",
  reflectionHint: "Une note pour vous. Elle n’est jamais partagée avec les autres.",
  saveSession: "Enregistrer la séance",
  sessionSaved: "Votre séance d’étude est enregistrée.",
  completeStep: "Marquer cette étape comme terminée",
  completionHelp: "Choisissez cette action séparément lorsque toute l’étape est terminée.",
  completionSaved: "Étape terminée. Vos efforts précédents restent enregistrés.",
  returnLearning: "Choisir la prochaine action",
  completionAt: "Terminée le {date}",
  sessionAt: "Étudié le {date}",
  privateNote: "Note privée",
  noReflection: "Aucune note ajoutée",
  goJourney: "Ouvrir le parcours",
  planCount: "{count} étapes actives",
  changedScope: "Modifications du parcours",
  notSaved: "Modifications non enregistrées",
  unsavedLeave: "Quitter ce formulaire et abandonner la saisie non enregistrée ?",
  profileRequired: "Confirmez votre fuseau horaire avant de créer un parcours.",
  invalidLink: "Utilisez des liens absolus http ou https, sans identifiant ni mot de passe.",
  invalidDate: "Utilisez des dates valides entre 2000 et 2100.",
  limitError:
    "Certaines valeurs dépassent la taille autorisée. Raccourcissez la saisie et réessayez.",
  genericError: "Impossible de terminer cette action. Votre saisie est conservée ; réessayez.",
};

export type { MessageKey };

let locale: Locale = "en";
const bindings = new Map<Node, () => void>();
export function getLocale(): Locale {
  return locale;
}
export function message(key: MessageKey, values: Record<string, string | number> = {}): string {
  let result: string = (locale === "fr" ? fr : en)[key];
  const count = Number(values.count);
  if (key === "studyDays" && count === 1)
    result = locale === "fr" ? "1 jour d’étude" : "1 study day";
  if (key === "sessionCount" && count === 1)
    result = locale === "fr" ? "1 séance d’étude" : "1 study session";
  if (key === "pastCompletions" && count === 1)
    result =
      locale === "fr" ? "1 étape terminée dans l’historique" : "1 completion recorded in history";
  if (key === "planCount" && count === 1)
    result = locale === "fr" ? "1 étape active" : "1 active step";
  if (key === "effort")
    result =
      locale === "fr"
        ? `{count} séance${count === 1 ? "" : "s"} · {minutes} minute${Number(values.minutes) === 1 ? "" : "s"} étudiée${Number(values.minutes) === 1 ? "" : "s"}`
        : `{count} session${count === 1 ? "" : "s"} · {minutes} minute${Number(values.minutes) === 1 ? "" : "s"} studied`;
  if (key === "currentProgress")
    result =
      locale === "fr"
        ? `{done} étape${Number(values.done) === 1 ? "" : "s"} terminée${Number(values.done) === 1 ? "" : "s"} sur {total}`
        : `{done} of {total} step${Number(values.total) === 1 ? "" : "s"} complete`;
  if (key === "shiftEarlier" || key === "shiftLater") {
    const days = Number(values.days);
    result =
      locale === "fr"
        ? `{count} étape${count === 1 ? "" : "s"} restante${count === 1 ? "" : "s"} ${count === 1 ? "sera" : "seront"} ${key === "shiftEarlier" ? `avancée${count === 1 ? "" : "s"}` : `décalée${count === 1 ? "" : "s"}`} de {days} jour${days === 1 ? "" : "s"} calendaire${days === 1 ? "" : "s"}.`
        : `{count} unfinished step${count === 1 ? "" : "s"} will move {days} calendar day${days === 1 ? "" : "s"} ${key === "shiftEarlier" ? "earlier" : "later"}.`;
  }
  for (const [name, value] of Object.entries(values))
    result = result.replaceAll(`{${name}}`, String(value));
  return result;
}
export function bind(node: Node, update: () => void): void {
  bindings.set(node, update);
  update();
}
export function setLocale(value: Locale): void {
  locale = value;
  document.documentElement.lang = value;
  document.title = message("learning");
  for (const [node, update] of bindings) {
    if (node.isConnected) update();
    else bindings.delete(node);
  }
}
export function dateLabel(date: string, timezone?: string): string {
  const instant = date.length === 10 ? new Date(`${date}T12:00:00Z`) : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: date.length === 10 ? "UTC" : (timezone ?? "Africa/Lagos"),
  }).format(instant);
}
