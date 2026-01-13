import { isPidgin } from './pidgin-toggle.js';
import { networks } from '../data/networks.js';

export function initPhoneValidator() {
  const input = document.getElementById('phoneInput');
  const result = document.getElementById('phoneResult');

  input.addEventListener('input', (e) => {
    // 1. Clean input: remove non-digits
    let rawVal = e.target.value.replace(/\D/g, '');

    // 2. Handle +234 / 234 prefix
    // If it starts with 234 and has more digits, replace 234 with 0
    if (rawVal.startsWith('234') && rawVal.length > 3) {
      rawVal = '0' + rawVal.substring(3);
    }

    // Update input value only if it's a simple case to avoid fighting cursor
    // For now, let's just use rawVal for detection logic

    if (!rawVal) {
      result.classList.add('hidden');
      return;
    }

    result.classList.remove('hidden');

    // 3. Detect Network
    // We look at the first 4 or 5 digits (some prefixes like 07025 are 5 digits)
    // But standard matching on first 4 is usually enough for the big ones.
    // Let's iterate through our networks object.

    let detectedNetwork = null;

    // Check for 5-digit prefixes first (priority)
    const prefix5 = rawVal.substring(0, 5);
    // Check for 4-digit prefixes
    const prefix4 = rawVal.substring(0, 4);

    if (networks.mtn.includes(prefix5) || networks.mtn.includes(prefix4)) detectedNetwork = 'mtn';
    else if (networks.airtel.includes(prefix4)) detectedNetwork = 'airtel';
    else if (networks.glo.includes(prefix4)) detectedNetwork = 'glo';
    else if (networks.m9.includes(prefix4)) detectedNetwork = 'm9';
    else if (networks.ntel.includes(prefix4)) detectedNetwork = 'ntel';
    else if (networks.mafab.includes(prefix4)) detectedNetwork = 'mafab';
    else if (networks.smile.includes(prefix5)) detectedNetwork = 'smile';

    let html = "";

    if (detectedNetwork === 'mtn') {
      html = `<i class="fas fa-check-circle" style="color: #FFCC00;"></i> ${isPidgin ? "Na MTN User" : "MTN User"}`;
    } else if (detectedNetwork === 'airtel') {
      html = `<i class="fas fa-check-circle" style="color: #ED1C24;"></i> ${isPidgin ? "Na Airtel User" : "Airtel User"}`;
    } else if (detectedNetwork === 'glo') {
      html = `<i class="fas fa-check-circle" style="color: #00B140;"></i> ${isPidgin ? "Na Glo User" : "Glo User"}`;
    } else if (detectedNetwork === 'm9') {
      html = `<i class="fas fa-check-circle" style="color: #00923F;"></i> ${isPidgin ? "Na 9mobile User" : "9mobile User"}`;
    } else if (detectedNetwork === 'ntel') {
      html = `<i class="fas fa-check-circle" style="color: #D60B51;"></i> ${isPidgin ? "Na Ntel User" : "Ntel User"}`;
    } else if (detectedNetwork === 'mafab') {
      html = `<i class="fas fa-check-circle" style="color: #C00;"></i> ${isPidgin ? "Na Mafab User" : "Mafab User"}`;
    } else if (detectedNetwork === 'smile') {
      html = `<i class="fas fa-check-circle" style="color: #FF0066;"></i> ${isPidgin ? "Na Smile User" : "Smile User"}`;
    } else {
      html = `<i class="fas fa-question-circle" style="color: #888;"></i> ${isPidgin ? "We no know dis number" : "Unknown Network"}`;
    }

    result.innerHTML = html;
  });
}
