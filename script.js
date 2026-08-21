
const CATEGORY_POOLS = {
  chkUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  chkLower: "abcdefghijklmnopqrstuvwxyz",
  chkDigits: "0123456789",
  chkSymbols: "!@#$%^&*()_+-=[]{};:,.<>?",
};

const el = {
  output: document.getElementById("outputField"),
  copyBtn: document.getElementById("copyAction"),
  copyMsg: document.getElementById("copyMsg"),
  meterBar: document.getElementById("meterBar"),
  meterText: document.getElementById("meterText"),
  lenInput: document.getElementById("lenInput"),
  lenDisplay: document.getElementById("lenDisplay"),
  warnMsg: document.getElementById("warnMsg"),
  buildBtn: document.getElementById("buildAction"),
  checkboxes: Object.keys(CATEGORY_POOLS).map((id) => document.getElementById(id)),
};

let lastPassword = "";

function randomIndex(upperBound) {
  const ceiling = Math.floor(256 / upperBound) * upperBound;
  const byte = new Uint8Array(1);
  let n;
  do {
    crypto.getRandomValues(byte);
    n = byte[0];
  } while (n >= ceiling);
  return n % upperBound;
}

function randomChar(pool) {
  return pool.charAt(randomIndex(pool.length));
}

function activeCategoryIds() {
  return el.checkboxes.filter((box) => box.checked).map((box) => box.id);
}

function buildPassword(length, categoryIds) {
  const chars = [];

  for (let i = 0; i < length; i++) {
    const categoryId = categoryIds[randomIndex(categoryIds.length)];
    chars.push(randomChar(CATEGORY_POOLS[categoryId]));
  }

  ensureAllCategoriesPresent(chars, categoryIds);
  return chars.join("");
}


function ensureAllCategoriesPresent(chars, categoryIds) {
  categoryIds.forEach((categoryId) => {
    const pool = CATEGORY_POOLS[categoryId];
    const alreadyPresent = chars.some((c) => pool.includes(c));
    if (!alreadyPresent) {
      const slot = randomIndex(chars.length);
      chars[slot] = randomChar(pool);
    }
  });
}


function validate(length, categoryIds) {
  if (categoryIds.length === 0) {
    return "Pick at least one character type.";
  }
  if (length < categoryIds.length) {
    return `Length needs to be at least ${categoryIds.length} for the types you picked.`;
  }
  return null;
}

function flagError(message) {
  el.warnMsg.textContent = message;
  el.buildBtn.classList.remove("rattle");
  void el.buildBtn.offsetWidth;
  el.buildBtn.classList.add("rattle");
}

function clearFlag() {
  el.warnMsg.textContent = "";
}


function scoreStrength(password, categoryIds) {
  const poolSize = categoryIds.reduce((sum, id) => sum + CATEGORY_POOLS[id].length, 0);
  const bits = password.length * Math.log2(Math.max(poolSize, 2));
  return Math.max(0, Math.min(1, (bits - 30) / (85 - 30)));
}

function paintMeter(score) {
  el.meterBar.style.width = `${Math.round(score * 100)}%`;

  let label = "Weak";
  let color = "var(--bad)";
  if (score > 0.75) {
    label = "Strong";
    color = "var(--good)";
  } else if (score > 0.4) {
    label = "Okay";
    color = "var(--gold)";
  }
  el.meterBar.style.background = color;
  el.meterText.textContent = label;
}

el.lenInput.addEventListener("input", () => {
  el.lenDisplay.textContent = el.lenInput.value;
});

el.buildBtn.addEventListener("click", () => {
  const length = Number(el.lenInput.value);
  const categoryIds = activeCategoryIds();

  const problem = validate(length, categoryIds);
  if (problem) {
    flagError(problem);
    return;
  }
  clearFlag();

  lastPassword = buildPassword(length, categoryIds);
  el.output.textContent = lastPassword;

  paintMeter(scoreStrength(lastPassword, categoryIds));
});

el.copyBtn.addEventListener("click", async () => {
  if (!lastPassword) return;

  try {
    await navigator.clipboard.writeText(lastPassword);
  } catch (err) {
    const holder = document.createElement("textarea");
    holder.value = lastPassword;
    document.body.appendChild(holder);
    holder.select();
    document.execCommand("copy");
    document.body.removeChild(holder);
  }

  el.copyMsg.textContent = "Copied to clipboard";
  setTimeout(() => {
    el.copyMsg.textContent = "";
  }, 1400);
});
