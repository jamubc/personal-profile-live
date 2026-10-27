import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Science hub: #app missing');
}

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-brand">
      <strong>Science</strong>
      <span class="sep">/</span>
      <span>Index</span>
    </div>
    <div class="topbar-meta">
      <span><b>/science</b></span>
    </div>
  </header>

  <main class="page page--index">
    <h1 class="index-title">Science</h1>

    <div class="section-label">
      <span>Linear algebra</span>
    </div>
    <ul class="catalog">
      <li class="catalog-row">
        <a href="./linalg/">
          <span class="title">Linear algebra</span>
          <p class="desc">Define vectors, write expressions, plot results.</p>
        </a>
        <div class="meta">linalg <span class="arrow">→</span></div>
      </li>
    </ul>

    <div class="section-label">
      <span>Build</span>
    </div>
    <ul class="catalog">
      <li class="catalog-row">
        <a href="./stub/">
          <span class="title">Shell verify</span>
          <p class="desc">MPA / asset path check.</p>
        </a>
        <div class="meta">stub <span class="arrow">→</span></div>
      </li>
    </ul>

    <footer class="foot">
      <span></span>
      <a href="/">Portfolio</a>
    </footer>
  </main>
`;
