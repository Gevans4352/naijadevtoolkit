import { isPidgin } from '../modules/pidgin-toggle.js'; 

let toastTimeout = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (toastTimeout) clearTimeout(toastTimeout);

  toast.innerText = message;
  toast.style.display = "block";
  toast.classList.add('show'); 

  toastTimeout = setTimeout(() => {
    toast.style.display = "none";
    toast.classList.remove('show');
  }, 3000); 
}

export function copyToClipboard(text, label = "") {
  navigator.clipboard.writeText(text);

  let message;

  if (isPidgin) {
    message = label ? `${label} don copy!` : "E don copy! E don set.";
  } else {
    message = label ? `${label} copied!` : "Copied to clipboard!";
  }

  showToast(message);
}