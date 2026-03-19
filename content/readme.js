// ── content/readme.js ──
// Landing page content (rendered as markdown/HTML)

const readme = {
  name: 'README.md',
  lang: 'Markdown',
  icon: '📘',
  iconClass: 'icon-md',
  type: 'markdown',
  content: `
    <div class="markdown-view">
      <h1>👋 Hi, I'm Joshua Patterson</h1>
      <p>Software engineer with 3+ years experience building full-stack systems for federally funded research. I specialize in <strong>API design</strong>, <strong>data pipelines</strong>, and <strong>workflow automation</strong> — with experience leading development and mentoring junior engineers.</p>
      
      <h2>⚡ Quick Overview</h2>
      <p>
        <span class="badge badge-blue">Python</span>
        <span class="badge badge-cyan">FastAPI</span>
        <span class="badge badge-green">Data Pipelines</span>
        <span class="badge badge-orange">WebSockets</span>
        <span class="badge badge-purple">REST APIs</span>
        <span class="badge badge-blue">PostgreSQL</span>
        <span class="badge badge-green">Microservices</span>
      </p>

      <h2>🏢 Currently</h2>
      <p><strong>Research Associate</strong> at <a href="https://ihmc.us" target="_blank" rel="noopener noreferrer">Florida Institute for Human &amp; Machine Cognition (IHMC)</a> in Pensacola, FL — leading architecture and development of internal software systems for federally funded research programs.</p>
      
      <h2>📂 Navigate This Portfolio</h2>
      <p>Use the <strong>file explorer</strong> on the left to browse around — each file contains a different section of my portfolio:</p>
      <ul>
        <li><code>about_me.py</code> — Who I am and what drives me</li>
        <li><code>experience.json</code> — Work history and roles</li>
        <li><code>projects.ts</code> — Featured projects and builds</li>
        <li><code>skills.yaml</code> — Technical skills and tools</li>
        <li><code>contact.html</code> — How to reach me</li>
      </ul>

      <h2>🏗️ Built With</h2>
      <p>This portfolio is a single-page site styled to look like VS Code. No frameworks, no build steps — just HTML, CSS, and vanilla JS. Hosted on GitHub Pages.</p>
    </div>
  `
};
