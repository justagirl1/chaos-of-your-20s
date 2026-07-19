/* Editor logic: create/edit posts locally (IndexedDB) with photo upload,
   then publish directly to the live site via the GitHub API. */

const GH_OWNER = 'justagirl1';
const GH_REPO = 'chaos-of-your-20s';
const GH_BRANCH = 'master';
const GH_PATH = 'data/posts.json';
const GH_TOKEN_KEY = 'chaosBlogGhToken';

let currentId = null;
let currentImages = [];

const titleInput = document.getElementById('f-title');
const categorySelect = document.getElementById('f-category');
const richEditor = document.getElementById('f-content');
const uploadInput = document.getElementById('f-upload');
const previews = document.getElementById('image-previews');
const statusMsg = document.getElementById('status-msg');
const postList = document.getElementById('post-list');
const newPostBtn = document.getElementById('new-post-btn');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const exportBtn = document.getElementById('export-btn');
const importInput = document.getElementById('import-input');
const publishBtn = document.getElementById('publish-btn');
const tokenInput = document.getElementById('f-token');
const saveTokenBtn = document.getElementById('save-token-btn');
const connectHint = document.getElementById('connect-hint');

function setStatus(msg) {
  statusMsg.textContent = msg;
  if (msg) setTimeout(() => { if (statusMsg.textContent === msg) statusMsg.textContent = ''; }, 3500);
}

function resizeImage(file, maxWidth = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  previews.innerHTML = currentImages.map((src, i) => `
    <div class="thumb">
      <img src="${src}" alt="">
      <button type="button" data-idx="${i}" title="Remove">✕</button>
    </div>
  `).join('');

  previews.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentImages.splice(Number(btn.dataset.idx), 1);
      renderPreviews();
    });
  });
}

uploadInput.addEventListener('change', async () => {
  const files = Array.from(uploadInput.files || []);
  for (const file of files) {
    try {
      const dataUrl = await resizeImage(file);
      currentImages.push(dataUrl);
    } catch (e) {
      console.error('Image processing failed', e);
    }
  }
  uploadInput.value = '';
  renderPreviews();
});

document.querySelectorAll('.toolbar button[data-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    richEditor.focus();
    document.execCommand(btn.dataset.cmd, false, btn.dataset.value || null);
  });
});

function clearForm() {
  currentId = null;
  currentImages = [];
  titleInput.value = '';
  categorySelect.value = 'milestones';
  richEditor.innerHTML = '';
  renderPreviews();
  deleteBtn.style.display = 'none';
  document.querySelectorAll('.post-list-item').forEach(el => el.classList.remove('active'));
}

function loadPostIntoForm(post) {
  currentId = post.id;
  currentImages = (post.images || []).slice();
  titleInput.value = post.title;
  categorySelect.value = post.category;
  richEditor.innerHTML = post.contentHtml || '';
  renderPreviews();
  deleteBtn.style.display = 'inline-block';
}

async function refreshList() {
  const posts = (await dbGetAll()).sort((a, b) => new Date(b.date) - new Date(a.date));
  if (posts.length === 0) {
    postList.innerHTML = `<p style="font-size:0.82rem;color:var(--text-light)">No posts yet — write your first one!</p>`;
    return;
  }
  postList.innerHTML = posts.map(p => `
    <div class="post-list-item ${p.id === currentId ? 'active' : ''}" data-id="${p.id}">
      <div class="title">${p.title || '(untitled)'}</div>
      <div class="sub">${p.category} · ${new Date(p.date).toLocaleDateString('en-US')}</div>
    </div>
  `).join('');

  postList.querySelectorAll('.post-list-item').forEach(el => {
    el.addEventListener('click', async () => {
      const post = await dbGet(el.dataset.id);
      if (post) {
        loadPostIntoForm(post);
        postList.querySelectorAll('.post-list-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
      }
    });
  });
}

newPostBtn.addEventListener('click', () => clearForm());

saveBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  if (!title) {
    setStatus('Please add a title first 🌸');
    return;
  }
  const plain = richEditor.textContent.trim();
  const post = {
    id: currentId || ('post-' + Date.now()),
    title,
    category: categorySelect.value,
    contentHtml: richEditor.innerHTML,
    excerpt: plain.slice(0, 120) + (plain.length > 120 ? '…' : ''),
    images: currentImages,
    date: currentId ? (await dbGet(currentId))?.date || new Date().toISOString() : new Date().toISOString()
  };
  await dbPut(post);
  currentId = post.id;
  deleteBtn.style.display = 'inline-block';
  await refreshList();
  setStatus('Saved locally ✓ — export when you\'re ready to publish.');
});

deleteBtn.addEventListener('click', async () => {
  if (!currentId) return;
  if (!confirm('Delete this post? This cannot be undone locally.')) return;
  await dbDelete(currentId);
  clearForm();
  await refreshList();
  setStatus('Post deleted.');
});

exportBtn.addEventListener('click', async () => {
  const posts = (await dbGetAll()).sort((a, b) => new Date(b.date) - new Date(a.date));
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.json';
  a.click();
  URL.revokeObjectURL(url);
  setStatus('Exported! Replace data/posts.json with this file and redeploy to publish.');
});

importInput.addEventListener('change', async () => {
  const file = importInput.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const posts = JSON.parse(text);
    for (const p of posts) {
      await dbPut(p);
    }
    await refreshList();
    setStatus('Imported ' + posts.length + ' post(s) into the local editor.');
  } catch (e) {
    setStatus('Could not read that file.');
  }
  importInput.value = '';
});

function getGhToken() {
  return localStorage.getItem(GH_TOKEN_KEY) || '';
}

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function updateConnectHint() {
  if (getGhToken()) {
    connectHint.innerHTML = '✅ Connected to your website. Click <strong>Publish</strong> any time to go live.';
  } else {
    connectHint.textContent = 'Writing here saves locally in this browser only. To make it visible to everyone, connect your website once below.';
  }
}

saveTokenBtn.addEventListener('click', () => {
  const token = tokenInput.value.trim();
  if (!token) {
    setStatus('Paste your token first.');
    return;
  }
  localStorage.setItem(GH_TOKEN_KEY, token);
  tokenInput.value = '';
  updateConnectHint();
  setStatus('Connected ✓ — you can publish now.');
});

publishBtn.addEventListener('click', async () => {
  const token = getGhToken();
  if (!token) {
    setStatus('Connect your website first (see "Connect website" below).');
    return;
  }

  publishBtn.disabled = true;
  setStatus('Publishing…');

  try {
    const posts = (await dbGetAll()).sort((a, b) => new Date(b.date) - new Date(a.date));
    const contentB64 = utf8ToBase64(JSON.stringify(posts, null, 2));

    const apiUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    };

    let sha;
    const getRes = await fetch(`${apiUrl}?ref=${GH_BRANCH}`, { headers });
    if (getRes.ok) {
      sha = (await getRes.json()).sha;
    } else if (getRes.status === 401) {
      throw new Error('Your token was rejected. Please create a new one and reconnect.');
    } else if (getRes.status !== 404) {
      throw new Error('Could not check the current live version (status ' + getRes.status + ').');
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update posts from the editor',
        content: contentB64,
        sha,
        branch: GH_BRANCH
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      throw new Error(err.message || ('Publish failed (status ' + putRes.status + ').'));
    }

    setStatus('Published 🚀 — live on your website in about a minute.');
  } catch (e) {
    setStatus('⚠ ' + e.message);
  } finally {
    publishBtn.disabled = false;
  }
});

(async function init() {
  await seedFromPublishedIfEmpty();
  await refreshList();
  clearForm();
  updateConnectHint();
})();
