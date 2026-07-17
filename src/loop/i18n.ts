import type { FeedbackType } from "./types";

export interface Strings {
  fabLabel: string;
  title: string;
  screenshot: string;
  optional: string;
  fullPage: string;
  fullPageDesc: string;
  selectArea: string;
  selectAreaDesc: string;
  placeholder: string;
  feedbackAria: string;
  types: Record<FeedbackType, string>;
  typeGroupAria: string;
  annotate: string;
  editMarks: string;
  retake: string;
  remove: string;
  send: string;
  from: string;
  sending: string;
  sendingSub: string;
  successTitle: string;
  successSub: string;
  errorTitle: string;
  errorSub: string;
  back: string;
  tryAgain: string;
  captureFailed: string;
  dragHint: string;
  escToCancel: string;
  toolbarAria: string;
  toolBox: string;
  toolArrow: string;
  toolPin: string;
  undo: string;
  cancel: string;
  done: string;
  close: string;
}

const en: Strings = {
  fabLabel: "Feedback",
  title: "Send feedback",
  screenshot: "Screenshot",
  optional: "optional",
  fullPage: "Full page",
  fullPageDesc: "Grab the whole screen",
  selectArea: "Select area",
  selectAreaDesc: "Drag to pick a region",
  placeholder: "What's going on? Describe the bug or idea…",
  feedbackAria: "Your feedback",
  types: { bug: "Bug", idea: "Idea", question: "Question", praise: "Praise" },
  typeGroupAria: "Feedback type",
  annotate: "Annotate",
  editMarks: "Edit marks",
  retake: "Retake",
  remove: "Remove",
  send: "Send feedback",
  from: "From",
  sending: "Sending…",
  sendingSub: "Packing up your screenshot and note.",
  successTitle: "Sent — thank you!",
  successSub: "Your feedback is on its way. We'll take a look shortly.",
  errorTitle: "Couldn't send",
  errorSub: "Something went wrong. Your note is still here — try again.",
  back: "Back",
  tryAgain: "Try again",
  captureFailed: "Couldn't capture the screen. You can still send a note.",
  dragHint: "Drag to select an area",
  escToCancel: "to cancel",
  toolbarAria: "Annotation tools",
  toolBox: "Box",
  toolArrow: "Arrow",
  toolPin: "Pin",
  undo: "Undo",
  cancel: "Cancel",
  done: "Done",
  close: "Close",
};

const fr: Strings = {
  fabLabel: "Votre avis",
  title: "Faire un retour",
  screenshot: "Capture d'écran",
  optional: "facultatif",
  fullPage: "Page entière",
  fullPageDesc: "Capturer tout l'écran",
  selectArea: "Sélection",
  selectAreaDesc: "Choisir une zone",
  placeholder: "Que se passe-t-il ? Décrivez le bug ou l'idée…",
  feedbackAria: "Votre retour",
  types: { bug: "Bug", idea: "Idée", question: "Question", praise: "Bravo" },
  typeGroupAria: "Type de retour",
  annotate: "Annoter",
  editMarks: "Modifier",
  retake: "Reprendre",
  remove: "Retirer",
  send: "Envoyer",
  from: "Depuis",
  sending: "Envoi…",
  sendingSub: "Préparation de votre capture et de votre note.",
  successTitle: "Envoyé — merci !",
  successSub: "Votre retour est en route. Nous allons y jeter un œil.",
  errorTitle: "Échec de l'envoi",
  errorSub: "Une erreur s'est produite. Votre note est conservée — réessayez.",
  back: "Retour",
  tryAgain: "Réessayer",
  captureFailed: "Impossible de capturer l'écran. Vous pouvez tout de même envoyer une note.",
  dragHint: "Glissez pour sélectionner une zone",
  escToCancel: "pour annuler",
  toolbarAria: "Outils d'annotation",
  toolBox: "Cadre",
  toolArrow: "Flèche",
  toolPin: "Repère",
  undo: "Annuler",
  cancel: "Annuler",
  done: "Terminé",
  close: "Fermer",
};

const de: Strings = {
  fabLabel: "Feedback",
  title: "Feedback senden",
  screenshot: "Screenshot",
  optional: "optional",
  fullPage: "Ganze Seite",
  fullPageDesc: "Ganzen Bildschirm aufnehmen",
  selectArea: "Bereich",
  selectAreaDesc: "Bereich auswählen",
  placeholder: "Was ist los? Beschreibe den Fehler oder die Idee…",
  feedbackAria: "Dein Feedback",
  types: { bug: "Fehler", idea: "Idee", question: "Frage", praise: "Lob" },
  typeGroupAria: "Feedback-Typ",
  annotate: "Markieren",
  editMarks: "Bearbeiten",
  retake: "Neu",
  remove: "Entfernen",
  send: "Senden",
  from: "Von",
  sending: "Wird gesendet…",
  sendingSub: "Screenshot und Notiz werden vorbereitet.",
  successTitle: "Gesendet — danke!",
  successSub: "Dein Feedback ist unterwegs. Wir schauen es uns bald an.",
  errorTitle: "Senden fehlgeschlagen",
  errorSub: "Etwas ist schiefgelaufen. Deine Notiz ist noch da — versuch es erneut.",
  back: "Zurück",
  tryAgain: "Erneut versuchen",
  captureFailed: "Bildschirm konnte nicht aufgenommen werden. Du kannst trotzdem eine Notiz senden.",
  dragHint: "Zum Auswählen ziehen",
  escToCancel: "zum Abbrechen",
  toolbarAria: "Anmerkungswerkzeuge",
  toolBox: "Rahmen",
  toolArrow: "Pfeil",
  toolPin: "Marker",
  undo: "Rückgängig",
  cancel: "Abbrechen",
  done: "Fertig",
  close: "Schließen",
};

const es: Strings = {
  fabLabel: "Comentarios",
  title: "Enviar comentarios",
  screenshot: "Captura",
  optional: "opcional",
  fullPage: "Página completa",
  fullPageDesc: "Capturar toda la pantalla",
  selectArea: "Seleccionar",
  selectAreaDesc: "Elige una zona",
  placeholder: "¿Qué ocurre? Describe el error o la idea…",
  feedbackAria: "Tus comentarios",
  types: { bug: "Error", idea: "Idea", question: "Pregunta", praise: "Elogio" },
  typeGroupAria: "Tipo de comentario",
  annotate: "Anotar",
  editMarks: "Editar",
  retake: "Repetir",
  remove: "Quitar",
  send: "Enviar",
  from: "Desde",
  sending: "Enviando…",
  sendingSub: "Preparando tu captura y tu nota.",
  successTitle: "¡Enviado, gracias!",
  successSub: "Tus comentarios van en camino. Los revisaremos pronto.",
  errorTitle: "No se pudo enviar",
  errorSub: "Algo salió mal. Tu nota sigue aquí, inténtalo de nuevo.",
  back: "Atrás",
  tryAgain: "Reintentar",
  captureFailed: "No se pudo capturar la pantalla. Aún puedes enviar una nota.",
  dragHint: "Arrastra para seleccionar una zona",
  escToCancel: "para cancelar",
  toolbarAria: "Herramientas de anotación",
  toolBox: "Caja",
  toolArrow: "Flecha",
  toolPin: "Marca",
  undo: "Deshacer",
  cancel: "Cancelar",
  done: "Listo",
  close: "Cerrar",
};

const it: Strings = {
  fabLabel: "Feedback",
  title: "Invia feedback",
  screenshot: "Screenshot",
  optional: "facoltativo",
  fullPage: "Pagina intera",
  fullPageDesc: "Cattura tutto lo schermo",
  selectArea: "Seleziona",
  selectAreaDesc: "Scegli un'area",
  placeholder: "Cosa succede? Descrivi il bug o l'idea…",
  feedbackAria: "Il tuo feedback",
  types: { bug: "Bug", idea: "Idea", question: "Domanda", praise: "Elogio" },
  typeGroupAria: "Tipo di feedback",
  annotate: "Annota",
  editMarks: "Modifica",
  retake: "Rifai",
  remove: "Rimuovi",
  send: "Invia",
  from: "Da",
  sending: "Invio…",
  sendingSub: "Preparazione dello screenshot e della nota.",
  successTitle: "Inviato — grazie!",
  successSub: "Il tuo feedback è in arrivo. Lo esamineremo a breve.",
  errorTitle: "Invio non riuscito",
  errorSub: "Qualcosa è andato storto. La tua nota è ancora qui, riprova.",
  back: "Indietro",
  tryAgain: "Riprova",
  captureFailed: "Impossibile catturare lo schermo. Puoi comunque inviare una nota.",
  dragHint: "Trascina per selezionare un'area",
  escToCancel: "per annullare",
  toolbarAria: "Strumenti di annotazione",
  toolBox: "Riquadro",
  toolArrow: "Freccia",
  toolPin: "Segnaposto",
  undo: "Annulla",
  cancel: "Annulla",
  done: "Fatto",
  close: "Chiudi",
};

const DICT: Record<string, Strings> = { en, fr, de, es, it };

/** Locales the widget ships with. Unknown locales fall back to English. */
export const SUPPORTED_LOCALES = Object.keys(DICT);

/**
 * Resolves the string table. Honors an explicit config.locale, otherwise reads
 * the browser language (primary subtag), falling back to English.
 */
export function resolveStrings(locale?: string): Strings {
  const tag = (locale || navigator.language || "en").toLowerCase().split("-")[0];
  return DICT[tag] ?? en;
}
