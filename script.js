let isPidgin = false;

const banks = [
  { name: "Access Bank", code: "044" },
  { name: "GTBank", code: "058" },
  { name: "Zenith Bank", code: "057" },
  { name: "United Bank for Africa", code: "033" },
  { name: "First Bank", code: "011" },
  { name: "Kuda Bank", code: "998" },
  { name: "Opay", code: "999" },
  { name: "Moniepoint", code: "506" },
  { name: "Fidelity Bank", code: "070" },
  { name: "Union Bank", code: "032" },
  { name: "Stanbic IBTC Bank", code: "039" },
  { name: "Sterling Bank", code: "232" },
  { name: "Wema Bank", code: "035" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Heritage Bank", code: "030" },
  { name: "Polaris Bank", code: "076" },
  { name: "Keystone Bank", code: "082" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Unity Bank", code: "215" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Titan Trust Bank", code: "102" },
  { name: "Globus Bank", code: "103" },
  { name: "Providus Bank", code: "101" }
];

const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

function togglePidgin() {
  isPidgin = !isPidgin;
  const btn = document.getElementById('lang-btn');
  const sub = document.getElementById('sub-header');
  const labels = {
    phone: document.querySelector('section.tool-card:nth-child(1) h3'),
    naira: document.querySelector('section.tool-card:nth-child(2) h3'),
    bank: document.querySelector('section.tool-card:nth-child(3) h3'),
    id: document.querySelector('section.tool-card:nth-child(4) h3')
  };

  const inputs = {
    phone: document.getElementById('phoneInput'),
    naira: document.getElementById('nairaInput'),
    bank: document.getElementById('bankSearch'),
    id: document.getElementById('idInput')
  };

  if (isPidgin) {
    sub.innerText = "Tools wey go make your dev life easy.";
    btn.innerText = "Switch to English";

    labels.phone.innerText = "Phone Checker";
    labels.naira.innerText = "Naira Format";
    labels.bank.innerText = "Bank Codes";
    labels.id.innerText = "ID Checker";

    inputs.phone.placeholder = "0803...";
    inputs.naira.placeholder = "Put amount";
    inputs.bank.placeholder = "Find bank...";
    inputs.id.placeholder = "BVN/NIN";

  } else {
    sub.innerText = "Essential utilities for the Nigerian ecosystem.";
    btn.innerText = "Switch to Pidgin";

    labels.phone.innerText = "Phone Validator";
    labels.naira.innerText = "Naira Formatter";
    labels.bank.innerText = "Bank Codes";
    labels.id.innerText = "ID Validator";

    inputs.phone.placeholder = "0803...";
    inputs.naira.placeholder = "Enter amount";
    inputs.bank.placeholder = "Search bank...";
    inputs.id.placeholder = "BVN or NIN";
  }
}


document.getElementById('phoneInput').addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g,'');
  e.target.value = val;
  const res = document.getElementById('phoneResult');
  if(!val) return res.classList.add('hidden');
  res.classList.remove('hidden');

  const networks = {
    mtn: /^(0703|0706|0803|0806|0810|0813|0814|0816|0903|0906|0913|0916)/,
    airtel: /^(0701|0708|0802|0808|0812|0901|0902|0904|0907|0912)/,
    glo: /^(0705|0805|0807|0811|0815|0905|0915)/,
    m9: /^(0809|0817|0818|0908|0909)/
  };

  let html = "";
  if(networks.mtn.test(val)) html = `<i class="fas fa-circle" style="color:#fbbf24"></i> MTN User`;
  else if(networks.airtel.test(val)) html = `<i class="fas fa-circle" style="color:#ef4444"></i> Airtel User`;
  else if(networks.glo.test(val)) html = `<i class="fas fa-circle" style="color:#22c55e"></i> Glo User`;
  else if(networks.m9.test(val)) html = `<i class="fas fa-circle" style="color:#10b981"></i> 9mobile User`;
  else html = `<i class="fas fa-question-circle"></i> Unknown`;

  res.innerHTML = html;
});

document.getElementById('nairaInput').addEventListener('input', (e) => {
  let val = parseFloat(e.target.value) || 0;
  document.getElementById('nairaResult').innerText = `₦${val.toLocaleString()}.00`;
});

document.getElementById('idInput').addEventListener('input', (e) => {
  const val = e.target.value.replace(/\D/g,'');
  e.target.value = val;
  const res = document.getElementById('idResult');
  if(val.length === 11) {
    res.innerHTML = `<i class="fas fa-check-circle" style="color: #22c55e"></i> Valid ${isPidgin ? "ID" : "ID"}`;
  } else {
    res.innerHTML = `<i class="fas fa-info-circle"></i> ${isPidgin ? "Enter 11 digits" : "Enter 11 digits to validate"}`;
  }
});

const bankSearch = document.getElementById('bankSearch');
const bankList = document.getElementById('bankList');

function renderBanks(query="") {
  bankList.innerHTML = "";
  const filtered = banks.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));
  filtered.forEach(b => {
    const item = document.createElement('div');
    item.className = "dropdown-item";
    item.innerHTML = `<span>${b.name}</span><strong>${b.code}</strong>`;
    item.onclick = () => {
      copyToClipboard(b.code);
      bankSearch.value = b.name;
      bankList.style.display = 'none';
    };
    bankList.appendChild(item);
  });
}

bankSearch.addEventListener('focus', ()=>bankList.style.display='block');
bankSearch.addEventListener('input', (e)=>renderBanks(e.target.value));
document.addEventListener('click', (e)=>{if(!bankSearch.contains(e.target)) bankList.style.display='none';});
renderBanks();

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  const toast = document.getElementById('toast');
  toast.innerText = isPidgin ? "E don set! Copied." : "Copied to clipboard!";
  toast.style.display = "block";
  setTimeout(()=>toast.style.display="none", 2000);
}
