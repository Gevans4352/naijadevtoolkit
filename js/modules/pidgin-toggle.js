import { translations } from "../data/translations.js";
export let isPidgin = false;

export function togglePidgin() {
  isPidgin = !isPidgin;
  const lang = isPidgin ? 'pidgin' : 'en';
  const data = translations[lang];

  document.getElementById('sub-header').innerText = data.subHeader;
  document.getElementById('lang-btn').innerText = data.btnText;
  

  Object.keys(data.labels).forEach(key => {
    document.getElementById(`label-${key}`).innerText = data.labels[key];
  });


  return isPidgin;
}

// Make it globally accessible for onclick in HTML
window.togglePidgin = togglePidgin;
