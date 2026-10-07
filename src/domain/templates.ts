import type { GoalTemplate } from "../shared/contracts.js";

const base = "https://developer.mozilla.org/";
const lesson = "/docs/Learn_web_development/Getting_started/Your_first_website/";
// Original editable task prompts; lessons remain linked at the publisher.
export const templates: GoalTemplate[] = [
  {
    id: "html-first-page@1",
    version: 1,
    sources: {
      en: [
        {
          label: "MDN — HTML: Creating the content",
          url: `${base}en-US${lesson}Creating_the_content`,
          checkedOn: "2026-10-07",
        },
        {
          label: "MDN — CSS: Styling the content",
          url: `${base}en-US${lesson}Styling_the_content`,
          checkedOn: "2026-10-07",
        },
      ],
      fr: [
        {
          label: "MDN — HTML : Créer le contenu",
          url: `${base}fr${lesson}Creating_the_content`,
          checkedOn: "2026-10-07",
        },
        {
          label: "MDN — CSS : Mettre en forme le contenu",
          url: `${base}fr${lesson}Styling_the_content`,
          checkedOn: "2026-10-07",
        },
      ],
    },
    text: {
      en: {
        title: "Build a simple web page",
        outcome:
          "Make one local HTML page with text, a link, an image and basic styling. These are editable suggestions and time estimates, not a certificate or a promise of mastery.",
        prerequisites:
          "Basic familiarity with your computer, files, a text editor and a browser. Open the linked lessons when internet is available; this app does not store their content. Purpose, small-screen inspection and reflection are project task suggestions.",
        steps: [
          { title: "Choose your page purpose", estimatedMinutes: 5 },
          { title: "Set up your file", estimatedMinutes: 10 },
          { title: "Build the page structure", estimatedMinutes: 15 },
          { title: "Add a heading and paragraph", estimatedMinutes: 10 },
          { title: "Add a link and image", estimatedMinutes: 15 },
          { title: "Style your page", estimatedMinutes: 20 },
          { title: "Check a small screen", estimatedMinutes: 10 },
          { title: "Finish and reflect", estimatedMinutes: 5 },
        ],
      },
      fr: {
        title: "Créer une page web simple",
        outcome:
          "Créer une page HTML locale avec du texte, un lien, une image et une mise en forme simple. Suggestions et durées estimées modifiables, sans certificat ni garantie de maîtrise.",
        prerequisites:
          "Savoir utiliser son ordinateur, ses fichiers, un éditeur de texte et un navigateur. Ouvrez les leçons liées avec internet ; leur contenu n’est pas conservé ici. Le choix du sujet, la vérification sur petit écran et la réflexion sont des suggestions du projet.",
        steps: [
          { title: "Choisir le but de votre page", estimatedMinutes: 5 },
          { title: "Préparer votre fichier", estimatedMinutes: 10 },
          { title: "Construire la structure de la page", estimatedMinutes: 15 },
          { title: "Ajouter un titre et un paragraphe", estimatedMinutes: 10 },
          { title: "Ajouter un lien et une image", estimatedMinutes: 15 },
          { title: "Mettre votre page en forme", estimatedMinutes: 20 },
          { title: "Vérifier sur un petit écran", estimatedMinutes: 10 },
          { title: "Terminer et faire le point", estimatedMinutes: 5 },
        ],
      },
    },
  },
];
