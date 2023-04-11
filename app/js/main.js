// i18n change languages
(function() {
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
      langSelector.checked = language === 'en';

      langSelector.addEventListener('change', () => {
        const newLanguage = langSelector.checked ? 'en' : 'ua';
        localStorage.setItem('language', newLanguage);
        i18next.changeLanguage(newLanguage);
      });

      i18next.on('languageChanged', () => {
        updateContent();
        langSelector.checked = i18next.language === 'en';
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
})();

// menu
(function() {
	const iconMenu = document.querySelector('.header__icon');
	if(iconMenu) {
		const headerMenu = document.querySelector('.header__menu');
		const menuLinks = document.querySelectorAll('.menu__link');
		iconMenu.addEventListener('click', (event) => {
			document.body.classList.toggle('lock')
			iconMenu.classList.toggle('active')
			headerMenu.classList.toggle('active')
		})
		// menu link
		menuLinks.forEach(elem => {
			elem.addEventListener('click', (event) => {
				document.body.classList.remove('lock')
				iconMenu.classList.remove('active')
				headerMenu.classList.remove('active')
			})
		})
	}
})();