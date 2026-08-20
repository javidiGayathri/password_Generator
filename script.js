
const passwordText = document.getElementById("passwordText");
const copyBtn = document.getElementById("copyBtn");
const copyToast = document.getElementById("copyToast");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const errorText = document.getElementById("errorText");
const gaugeNeedle = document.getElementById("gaugeNeedle");
const gaugeArc = document.getElementById("gaugeArc");
const gaugeLabel = document.getElementById("gaugeLabel");
const tumblers = document.querySelectorAll(".tumbler");


const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

let currentPassword = "";


function getActiveOptions() {
  return Array.from(tumblers)
    .filter((t) => t.classList.contains("active"))
    .map((t) => t.dataset.option);
}

tumblers.forEach((tumbler) => {
  tumbler.addEventListener("click", () => {
    const nowActive = !tumbler.classList.contains("active");
    tumbler.classList.toggle("active", nowActive);
    tumbler.setAttribute("aria-checked", String(nowActive));
    clearError();
  });
});


lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});


function secureRandomInt(maxExclusive) {
  const range = 256 - (256 % maxExclusive);
  const buf = new Uint8Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= range);
  return value % maxExclusive;
}

function pickRandomChar(charset) {
  return charset[secureRandomInt(charset.length)];
}

function secureShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


function clearError() {
  errorText.textContent = "";
}

function showError(message) {
  errorText.textContent = message;
  generateBtn.classList.remove("shake");
  void generateBtn.offsetWidth;
  generateBtn.classList.add("shake");
}


function generatePassword() {
  const length = Number(lengthSlider.value);
  const activeOptions = getActiveOptions();

  if (activeOptions.length === 0) {
    showError("Select at least one character type to cut a key.");
    return;
  }

  if (!length || length < activeOptions.length) {
    showError(`Length must be at least ${activeOptions.length} for the selected options.`);
    return;
  }

  clearError();

  const activeCharsets = activeOptions.map((opt) => CHAR_SETS[opt]);
  const combinedCharset = activeCharsets.join("");

  const passwordChars = activeCharsets.map((set) => pickRandomChar(set));

  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(pickRandomChar(combinedCharset));
  }

  secureShuffle(passwordChars);
  currentPassword = passwordChars.join("");

  passwordText.textContent = currentPassword;
  passwordText.classList.remove("placeholder");
  updateGauge(currentPassword, activeOptions, combinedCharset.length);
}


function updateGauge(password, activeOptions, poolSize) {
  const entropy = password.length * Math.log2(Math.max(poolSize, 2));
  const score = Math.max(0, Math.min(1, (entropy - 28) / (90 - 28)));

  const angle = -90 + score * 180;
  gaugeNeedle.style.transform = `rotate(${angle}deg)`;

  const circumference = 188;
  gaugeArc.style.strokeDashoffset = String(circumference * (1 - score));

  let label = "Weak";
  let color = "#C4634B";
  if (score > 0.75) {
    label = "Strong";
    color = "#7FB57A";
  } else if (score > 0.4) {
    label = "Fair";
    color = "#C9A227";
  }
  gaugeLabel.textContent = label;
  gaugeArc.setAttribute("stroke", color);
}


copyBtn.addEventListener("click", async () => {
  if (!currentPassword) return;

  try {
    await navigator.clipboard.writeText(currentPassword);
  } catch (err) {
    const tempInput = document.createElement("textarea");
    tempInput.value = currentPassword;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  copyToast.classList.add("show");
  setTimeout(() => copyToast.classList.remove("show"), 1200);
});


generateBtn.addEventListener("click", generatePassword);


passwordText.classList.add("placeholder");