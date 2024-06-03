import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const messages = {
    fr: {},
  };

  const locales = import.meta.glob("../locales/fr.json", { eager: true });

  Object.entries(Object.values(locales)[0].default).forEach(
    ([category, keys]) => {
      Object.entries(keys).forEach(([key, value]) => {
        messages["fr"][category + "." + key] = value;
      });
    }
  );

  return messages;
}

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "fr",
  fallbackLocale: "fr",
  messages: loadLocaleMessages(),
  warnHtmlInMessage: "off",
});
