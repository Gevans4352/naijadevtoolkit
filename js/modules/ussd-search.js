import { ussdCodes } from '../data/ussd.js';
import { copyToClipboard } from '../utils/toast.js';
import { isPidgin } from './pidgin-toggle.js';

let selectedUssdIndex = -1;
let focusedUssdIndex = -1; // ADD THIS

export function initUssdSearch() {
  const ussdSearch = document.getElementById('ussdSearch');
  const ussdList = document.getElementById('ussdList');

  function renderUssd(query = "") {
    ussdList.innerHTML = "";
    const filtered = ussdCodes.filter(u => 
      u.service.toLowerCase().includes(query.toLowerCase()) ||
      u.code.includes(query)
    );

    if (filtered.length === 0) {
      const noResult = document.createElement('div');
      noResult.className = "dropdown-item";
      noResult.style.pointerEvents = "none";
      noResult.style.opacity = "0.6";
      noResult.innerText = isPidgin 
        ? "No service match wetin you find" 
        : "No services found";
      ussdList.appendChild(noResult);
      return;
    }

    filtered.forEach((u, index) => {
      const item = document.createElement('div');
      item.className = "dropdown-item";
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', index);
      item.setAttribute('tabindex', '-1'); // ADD THIS - programmatically focusable
      item.setAttribute('id', `ussd-item-${Date.now()}-${index}`); // ADD THIS - unique ID for aria-activedescendant
      item.innerHTML = `<span>${u.service}</span><strong>${u.code}</strong>`;
      item.onclick = () => {
        copyToClipboard(u.code, isPidgin, u.service);
        ussdSearch.value = u.service;
        ussdList.style.display = 'none';
        ussdSearch.setAttribute('aria-expanded', 'false');
        ussdSearch.focus(); // ADD THIS - return focus to search input
      };
      ussdList.appendChild(item);
    });

    selectedUssdIndex = -1;
    focusedUssdIndex = -1;
    ussdSearch.removeAttribute('aria-activedescendant'); // ADD THIS
  }

  function updateSelectedUssd(items) {
    items.forEach((item, idx) => {
      if (idx === selectedUssdIndex) {
        item.style.background = 'var(--primary)';
        item.style.color = 'white';
        item.scrollIntoView({ block: 'nearest' });
        ussdSearch.setAttribute('aria-activedescendant', item.id); // ADD THIS
      } else {
        item.style.background = '';
        item.style.color = '';
      }
    });
  }

  ussdSearch.addEventListener('focus', () => {
    ussdList.style.display = 'block';
    ussdSearch.setAttribute('aria-expanded', 'true');
    renderUssd(ussdSearch.value);
  });

  ussdSearch.addEventListener('input', (e) => {
    renderUssd(e.target.value);
    selectedUssdIndex = -1;
    focusedUssdIndex = -1;
  });

  // ADD THIS - Tab key trap for accessibility
  ussdSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && ussdList.style.display === 'block') {
      e.preventDefault(); // Stop focus from leaving dropdown
      const items = ussdList.querySelectorAll('.dropdown-item');
      if (items.length > 0) {
        focusedUssdIndex = 0;
        items[0].focus();
        ussdSearch.setAttribute('aria-activedescendant', items[0].id);
      }
    }
  });

  // MODIFY this existing keydown handler - add aria-activedescendant update
  ussdSearch.addEventListener('keydown', (e) => {
    const items = ussdList.querySelectorAll('.dropdown-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedUssdIndex = (selectedUssdIndex + 1) % items.length;
      updateSelectedUssd(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedUssdIndex = selectedUssdIndex <= 0 ? items.length - 1 : selectedUssdIndex - 1;
      updateSelectedUssd(items);
    } else if (e.key === 'Enter' && selectedUssdIndex >= 0) {
      e.preventDefault();
      items[selectedUssdIndex].click();
    } else if (e.key === 'Escape') {
      ussdList.style.display = 'none';
      ussdSearch.setAttribute('aria-expanded', 'false');
      ussdSearch.setAttribute('aria-activedescendant', ''); // ADD THIS
      selectedUssdIndex = -1;
      focusedUssdIndex = -1;
      ussdSearch.focus(); // ADD THIS
    }
  });

  // ADD THIS - Handle focus leaving dropdown items
  ussdList.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && ussdList.style.display === 'block') {
      e.preventDefault();
      // Shift+Tab goes back to search, Tab stays in dropdown
      const items = ussdList.querySelectorAll('.dropdown-item');
      const focused = document.activeElement;
      const currentIndex = Array.from(items).indexOf(focused);
      
      if (e.shiftKey) {
        // Shift+Tab: go back to search
        ussdSearch.focus();
        ussdSearch.setAttribute('aria-activedescendant', items[selectedUssdIndex]?.id || '');
      } else {
        // Tab: cycle to next item
        let nextIndex = currentIndex + 1;
        if (nextIndex < items.length) {
          items[nextIndex].focus();
          ussdSearch.setAttribute('aria-activedescendant', items[nextIndex].id);
          selectedUssdIndex = nextIndex;
        } else {
          // Loop back to first item
          items[0].focus();
          ussdSearch.setAttribute('aria-activedescendant', items[0].id);
          selectedUssdIndex = 0;
        }
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!ussdSearch.contains(e.target) && !ussdList.contains(e.target)) {
      ussdList.style.display = 'none';
      ussdSearch.setAttribute('aria-expanded', 'false');
      ussdSearch.setAttribute('aria-activedescendant', ''); // ADD THIS
      selectedUssdIndex = -1;
      focusedUssdIndex = -1;
    }
  });

  renderUssd();
}