/* Public-facing rendering: index.html + post.html.
   Reads only from data/posts.json so every visitor sees the same, published content. */

window.addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload();
});

const CATEGORY_EMOJI = {
  milestones: '🌸',
  goals: '🎯',
  thoughts: '💭'
};

const CATEGORY_LABEL = {
  milestones: 'Milestones',
  goals: 'Goals',
  thoughts: 'Thoughts'
};

function revealWriteLinkIfUnlocked() {
  const link = document.getElementById('write-link');
  if (link && localStorage.getItem('chaosBlogEditorUnlocked') === '1') {
    link.style.display = '';
  }
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function fetchPosts() {
  const res = await fetch('data/posts.json?v=' + Date.now(), { cache: 'no-store' });
  const posts = await res.json();
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function cardHtml(post) {
  const cover = post.images && post.images.length
    ? `<img class="card-media" src="${post.images[0]}" alt="">`
    : `<div class="card-media">${CATEGORY_EMOJI[post.category] || '🌷'}</div>`;

  const excerpt = post.excerpt || stripHtml(post.contentHtml).slice(0, 110) + '…';

  return `
    <a class="card" href="post.html?id=${encodeURIComponent(post.id)}">
      ${cover}
      <div class="card-body">
        <span class="badge ${post.category}">${CATEGORY_LABEL[post.category] || post.category}</span>
        <h3>${post.title}</h3>
        <p class="excerpt">${excerpt}</p>
        <div class="meta">${formatDate(post.date)}</div>
      </div>
    </a>
  `;
}

async function initIndex() {
  revealWriteLinkIfUnlocked();
  const grid = document.getElementById('post-grid');
  const pills = document.querySelectorAll('.nav-pill[data-filter]');
  let allPosts = [];
  let activeFilter = 'all';

  function render() {
    const filtered = activeFilter === 'all'
      ? allPosts
      : allPosts.filter(p => p.category === activeFilter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="big-emoji">🌷</div>
          <p>No posts here yet. Time to write one in the editor.</p>
        </div>`;
      return;
    }
    grid.innerHTML = filtered.map(cardHtml).join('');
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      render();
    });
  });

  try {
    allPosts = await fetchPosts();
  } catch (e) {
    allPosts = [];
  }
  render();
}

async function initPost() {
  revealWriteLinkIfUnlocked();
  const container = document.getElementById('post-container');
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (e) {
    posts = [];
  }

  const post = posts.find(p => p.id === id);

  if (!post) {
    container.innerHTML = `
      <a class="back-link" href="index.html">&larr; Back home</a>
      <div class="empty-state">
        <div class="big-emoji">🥲</div>
        <p>This post doesn't exist (anymore).</p>
      </div>`;
    document.title = 'Not found · the chaos of being in your 20s';
    return;
  }

  document.title = post.title + ' · the chaos of being in your 20s';

  const cover = post.images && post.images.length
    ? `<img class="cover" src="${post.images[0]}" alt="">`
    : '';

  const gallery = post.images && post.images.length > 1
    ? `<div class="gallery">${post.images.slice(1).map(src => `<img src="${src}" alt="">`).join('')}</div>`
    : '';

  container.innerHTML = `
    <a class="back-link" href="index.html">&larr; Back home</a>
    ${cover}
    <span class="badge ${post.category}">${CATEGORY_LABEL[post.category] || post.category}</span>
    <h1>${post.title}</h1>
    <div class="meta">${formatDate(post.date)}</div>
    <div class="post-content">${post.contentHtml}</div>
    ${gallery}
  `;

  loadComments(post.id);
}

function loadComments(postId) {
  const wrap = document.getElementById('comments-container');
  const mount = document.getElementById('giscus-mount');
  wrap.style.display = 'block';

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'justagirl1/chaos-of-your-20s');
  script.setAttribute('data-repo-id', 'R_kgDOTdSYHg');
  script.setAttribute('data-category', 'Announcements');
  script.setAttribute('data-category-id', 'DIC_kwDOTdSYHs4DBhpW');
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', postId);
  script.setAttribute('data-strict', '1');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'light');
  script.setAttribute('data-lang', 'en');
  script.crossOrigin = 'anonymous';
  script.async = true;
  mount.appendChild(script);
}
