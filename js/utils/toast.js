let toastTimeout = null;

export function showToast(message) {
  const toast = document.getElementById('toast');

  // Clear any existing toast
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toast.classList.remove('show');
  }

  // Restart animation
  void toast.offsetWidth;

  toast.innerText = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500); // 2.5 seconds
}

export function copyToClipboard(text, isPidgin = false, label = "") {
  navigator.clipboard.writeText(text);

  const message = isPidgin
    ? label ? `${label} don copy!` : "E don set! Copied."
    : label ? `${label} copied!` : "Copied to clipboard!";

  showToast(message);
}
