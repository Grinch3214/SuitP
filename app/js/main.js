// i18n change languages
function changeLanguagei18n() {
  const elements = document.querySelectorAll('[data-i18n]');

  async function loadLanguageResources() {
    const languages = ['en', 'ua'];
    const resources = {};
    
    try {
      for (const language of languages) {
				const response = await fetch(
          `/files/i18/${language}.json`
        );
        const json = await response.json();
        resources[language] = { translation: json };
      }
    } catch (err) {
      console.error(err);
    }
    
    return resources;
  }

  async function initialize() {
    try {
      const resources = await loadLanguageResources();
      const language = localStorage.getItem('language') || 'ua';
      await i18next.init({
        lng: language,
        debug: true,
        resources
      });
      
      updateContent();
      i18next.on('languageChanged', () => {
        updateContent();
      });
      
      const langSelector = document.querySelector('.switch__input');
      langSelector.checked = language === 'ua';

      langSelector.addEventListener('change', () => {
        const newLanguage = langSelector.checked ? 'ua' : 'en';
        localStorage.setItem('language', newLanguage);
        i18next.changeLanguage(newLanguage);
      });

      i18next.on('languageChanged', () => {
        updateContent();
        langSelector.checked = i18next.language === 'ua';
      });
    } catch (err) {
      console.error(err);
    }
  }

  function updateContent() {
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      element.innerHTML = i18next.t(key);
    });
  }

  initialize();
}
changeLanguagei18n();