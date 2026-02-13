import { banks } from '../data/banks.js';
import { copyToClipboard } from '../utils/toast.js';
import { isPidgin } from './pidgin-toggle.js';

let selectedBankIndex = -1;
let focusedItemIndex = -1; // ADD THIS

export function initBankSearch() {
  const bankSearch = document.getElementById('bankSearch');
  const bankList = document.getElementById('bankList');

  function renderBanks(query = "") {
    bankList.innerHTML = "";
    const filtered = banks.filter(b => 
      b.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      const noResult = document.createElement('div');
      noResult.className = "dropdown-item";
      noResult.style.pointerEvents = "none";
      noResult.style.opacity = "0.6";
      noResult.innerText = isPidgin 
        ? "No bank match wetin you find" 
        : "No banks found";
      bankList.appendChild(noResult);
      return;
    }

    filtered.forEach((b, index) => {
      const item = document.createElement('div');
      item.className = "dropdown-item";
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', index);
      item.setAttribute('tabindex', '-1'); // ADD THIS - makes it programmatically focusable
      item.setAttribute('id', `bank-item-${Date.now()}-${index}`); // ADD THIS - unique ID for aria-activedescendant
      item.innerHTML = `<span>${b.name}</span><strong>${b.code}</strong>`;
      item.onclick = () => {
        copyToClipboard(b.code, isPidgin, b.name + " code");
        bankSearch.value = b.name;
        bankList.style.display = 'none';
        bankSearch.setAttribute('aria-expanded', 'false');
        bankSearch.focus(); // ADD THIS - return focus to search input
      };
      bankList.appendChild(item);
    });

    selectedBankIndex = -1;
    focusedItemIndex = -1;
    bankSearch.removeAttribute('aria-activedescendant'); // ADD THIS
  }

  function updateSelectedBank(items) {
    items.forEach((item, idx) => {
      if (idx === selectedBankIndex) {
        item.style.background = 'var(--primary)';
        item.style.color = 'white';
        item.scrollIntoView({ block: 'nearest' });
        bankSearch.setAttribute('aria-activedescendant', item.id); // ADD THIS
      } else {
        item.style.background = '';
        item.style.color = '';
      }
    });
  }

  bankSearch.addEventListener('focus', () => {
    bankList.style.display = 'block';
    bankSearch.setAttribute('aria-expanded', 'true');
    renderBanks(bankSearch.value);
  });

  bankSearch.addEventListener('input', (e) => {
    renderBanks(e.target.value);
    selectedBankIndex = -1;
    focusedItemIndex = -1;
  });

  // ADD THIS - Tab key trap for accessibility
  bankSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && bankList.style.display === 'block') {
      e.preventDefault(); // Stop focus from leaving dropdown
      const items = bankList.querySelectorAll('.dropdown-item');
      if (items.length > 0) {
        focusedItemIndex = 0;
        items[0].focus();
        bankSearch.setAttribute('aria-activedescendant', items[0].id);
      }
    }
  });

  // MODIFY this existing keydown handler - add aria-activedescendant update
  bankSearch.addEventListener('keydown', (e) => {
    const items = bankList.querySelectorAll('.dropdown-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedBankIndex = (selectedBankIndex + 1) % items.length;
      updateSelectedBank(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedBankIndex = selectedBankIndex <= 0 ? items.length - 1 : selectedBankIndex - 1;
      updateSelectedBank(items);
    } else if (e.key === 'Enter' && selectedBankIndex >= 0) {
      e.preventDefault();
      items[selectedBankIndex].click();
    } else if (e.key === 'Escape') {
      bankList.style.display = 'none';
      bankSearch.setAttribute('aria-expanded', 'false');
      bankSearch.setAttribute('aria-activedescendant', ''); // ADD THIS
      selectedBankIndex = -1;
      focusedItemIndex = -1;
      bankSearch.focus(); // ADD THIS
    }
  });

  // ADD THIS - Handle focus leaving dropdown items
  bankList.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && bankList.style.display === 'block') {
      e.preventDefault();
      // Shift+Tab goes back to search, Tab stays in dropdown
      const items = bankList.querySelectorAll('.dropdown-item');
      const focused = document.activeElement;
      const currentIndex = Array.from(items).indexOf(focused);
      
      if (e.shiftKey) {
        // Shift+Tab: go back to search
        bankSearch.focus();
        bankSearch.setAttribute('aria-activedescendant', items[selectedBankIndex]?.id || '');
      } else {
        // Tab: cycle to next item
        let nextIndex = currentIndex + 1;
        if (nextIndex < items.length) {
          items[nextIndex].focus();
          bankSearch.setAttribute('aria-activedescendant', items[nextIndex].id);
          selectedBankIndex = nextIndex;
        } else {
          // Loop back to first item
          items[0].focus();
          bankSearch.setAttribute('aria-activedescendant', items[0].id);
          selectedBankIndex = 0;
        }
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!bankSearch.contains(e.target) && !bankList.contains(e.target)) {
      bankList.style.display = 'none';
      bankSearch.setAttribute('aria-expanded', 'false');
      bankSearch.setAttribute('aria-activedescendant', ''); // ADD THIS
      selectedBankIndex = -1;
      focusedItemIndex = -1;
    }
  });

  renderBanks();
}