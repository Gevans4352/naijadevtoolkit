// Main entry point - imports and initializes all modules
import { initThemeToggle } from './modules/theme-toggle.js';
import { togglePidgin } from './modules/pidgin-toggle.js';
import { initPhoneValidator } from './modules/phone-validator.js';
import { initNairaFormatter } from './modules/naira-formatter.js';
import { initBankSearch } from './modules/bank-search.js';
import { initIdValidator } from './modules/id-validator.js';
import { initUssdSearch } from './modules/ussd-search.js';

// Initialize all features on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPhoneValidator();
  initNairaFormatter();
  initBankSearch();
  initIdValidator();
  initUssdSearch();
  
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      togglePidgin();
    });
  }
});
