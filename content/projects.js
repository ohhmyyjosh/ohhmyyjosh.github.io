// ── content/projects.js ──
// Featured projects (rendered as markdown/HTML with project cards)

const projects = {
  name: 'projects.ts',
  lang: 'TypeScript',
  icon: 'TS',
  iconClass: 'icon-ts',
  type: 'markdown',
  content: `
    <div class="markdown-view">
      <h1>🚀 Projects</h1>
      <p>A selection of systems and tools I've built.</p>

      <div class="project-card">
        <h3>Distributed Research Automation Platform</h3>
        <p>RESTful API and WebSocket services enabling real-time communication and automation across distributed research applications. Built with FastAPI and Flask, supporting multi-run experiment workflows with graceful shutdown and per-run state management.</p>
        <span class="badge badge-blue">Python</span>
        <span class="badge badge-cyan">FastAPI</span>
        <span class="badge badge-orange">WebSockets</span>
        <span class="badge badge-purple">Pydantic</span>
      </div>

      <div class="project-card">
        <h3>Time-Series Data Pipeline</h3>
        <p>End-to-end pipeline for processing large-scale time-series datasets from experimental research, using Pandas and SciPy for data preparation, analysis, and visualization.</p>
        <span class="badge badge-blue">Python</span>
        <span class="badge badge-green">Pandas</span>
        <span class="badge badge-cyan">SciPy</span>
        <span class="badge badge-purple">NumPy</span>
      </div>

      <div class="project-card">
        <h3>Research Dashboard Suite</h3>
        <p>Interactive dashboards built with Plotly Dash for data exploration, validation, and stakeholder insight generation across multiple research programs.</p>
        <span class="badge badge-blue">Python</span>
        <span class="badge badge-orange">Plotly Dash</span>
        <span class="badge badge-green">Data Viz</span>
      </div>

      <div class="project-card">
        <h3>OSINT Vehicle Security Portal</h3>
        <p>Web interface for an open-source intelligence vehicle-security portal featuring a CVSS calculator to standardize vulnerability scoring and support security assessments.</p>
        <span class="badge badge-purple">C#</span>
        <span class="badge badge-orange">JavaScript</span>
        <span class="badge badge-cyan">Cybersecurity</span>
      </div>

      <div class="project-card">
        <h3>VS Code Portfolio (This Site!)</h3>
        <p>Single-page portfolio site styled as a VS Code editor. Vanilla HTML/CSS/JS, no build tools. Hosted on GitHub Pages.</p>
        <span class="badge badge-orange">HTML</span>
        <span class="badge badge-purple">CSS</span>
        <span class="badge badge-cyan">JavaScript</span>
      </div>
    </div>
  `
};
