/* Cookie banner configuration (vanilla-cookieconsent by Orest Bida,
   self-hosted in assets/vendor/cookieconsent). The library owns all
   consent-storage/persistence logic; this file only supplies the
   Lux Project copy, categories and layout. */
(function () {
  "use strict";

  if (!window.CookieConsent) return;

  CookieConsent.run({
    cookie: {
      name: "lux_project_consent",
    },

    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        flipButtons: false,
        equalWeightButtons: false,
      },
      preferencesModal: {
        layout: "box",
        flipButtons: false,
        equalWeightButtons: true,
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: false,
      },
      profiling: {
        enabled: false,
      },
    },

    language: {
      default: "it",
      translations: {
        it: {
          consentModal: {
            title: "Questo sito utilizza i cookie",
            description:
              "Utilizziamo cookie tecnici necessari al funzionamento del sito. Potrai modificare le tue preferenze in qualsiasi momento.",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Rifiuta quelli non necessari",
            showPreferencesBtn: "Personalizza",
            footer:
              '<a href="privacy-policy.html">Privacy Policy</a>\n<a href="cookie-policy.html">Cookie Policy</a>',
          },
          preferencesModal: {
            title: "Preferenze Cookie",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Rifiuta tutti",
            savePreferencesBtn: "Salva preferenze",
            closeIconLabel: "Chiudi",
            sections: [
              {
                title: "Come utilizziamo i cookie",
                description:
                  'Puoi scegliere quali categorie di cookie accettare. I cookie tecnici restano sempre attivi perché necessari al funzionamento del sito. Per maggiori dettagli consulta la nostra <a href="cookie-policy.html">Cookie Policy</a>.',
              },
              {
                title: "Cookie tecnici",
                description:
                  "Necessari alla navigazione e al funzionamento di base del sito (es. memorizzazione delle preferenze di consenso e invio del modulo di contatto). Sempre attivi.",
                linkedCategory: "necessary",
              },
              {
                title: "Cookie analitici",
                description:
                  "Utilizzati per raccogliere statistiche in forma aggregata sull'utilizzo del sito. Attualmente non utilizzati su questo sito.",
                linkedCategory: "analytics",
              },
              {
                title: "Cookie di profilazione",
                description:
                  "Utilizzati per proporre contenuti pubblicitari personalizzati in base alle abitudini di navigazione. Attualmente non utilizzati su questo sito.",
                linkedCategory: "profiling",
              },
            ],
          },
        },
      },
    },
  });
})();
