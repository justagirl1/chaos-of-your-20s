/* Simple client-side password gate for the editor.
   Not high security (this is a static site with no server) — it just keeps
   casual visitors from opening the writing desk. Real publishing safety
   comes from the GitHub token, which only the site owner has. */

const GATE_HASH = 'b3c02a655a4c34398ed6f0a3dfa1746e96cbde7218e9b74dd243d848567b386c';
const GATE_KEY = 'chaosBlogEditorUnlocked';

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function showGate() {
  document.getElementById('gate-overlay').style.display = 'flex';
  document.getElementById('gate-password').focus();
}

function hideGate() {
  document.getElementById('gate-overlay').style.display = 'none';
}

async function tryUnlock() {
  const input = document.getElementById('gate-password');
  const errorEl = document.getElementById('gate-error');
  const hash = await sha256Hex(input.value);
  if (hash === GATE_HASH) {
    sessionStorage.setItem(GATE_KEY, '1');
    errorEl.textContent = '';
    input.value = '';
    hideGate();
  } else {
    errorEl.textContent = 'Falsches Passwort.';
    input.value = '';
    input.focus();
  }
}

(function initGate() {
  // Only trust an existing unlock if this load is a genuine in-page reload
  // (F5) or a back/forward step. Any other kind of load — a freshly typed
  // URL, a bookmark, a brand new tab, or the browser restoring a previous
  // session after being reopened — forces the password again, even though
  // some browsers would otherwise silently carry sessionStorage over.
  const navEntries = performance.getEntriesByType('navigation');
  const navType = navEntries.length ? navEntries[0].type : 'navigate';
  const isContinuation = navType === 'reload' || navType === 'back_forward';

  if (!isContinuation) {
    sessionStorage.removeItem(GATE_KEY);
  }

  if (sessionStorage.getItem(GATE_KEY) === '1') {
    hideGate();
  } else {
    showGate();
  }
  document.getElementById('gate-unlock-btn').addEventListener('click', tryUnlock);
  document.getElementById('gate-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
})();
