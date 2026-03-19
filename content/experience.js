// ── content/experience.js ──
// Work experience & education (rendered as markdown/HTML)

const experience = {
  name: 'experience.json',
  lang: 'JSON',
  icon: '{ }',
  iconClass: 'icon-json',
  type: 'markdown',
  content: `
    <div class="markdown-view">
      <h1>💼 Experience</h1>
      <p>My professional journey so far.</p>

      <div class="experience-block">
        <div class="role">Research Associate</div>
        <div class="company">Florida Institute for Human &amp; Machine Cognition (IHMC)</div>
        <div class="date">Aug 2023 — Present · Pensacola, FL</div>
        <p style="margin-top:8px;">Lead architecture and development of internal software systems for federally funded research. Design and implement RESTful APIs and WebSocket services using Python (FastAPI, Flask) for real-time communication across distributed research applications. Build data pipelines for large-scale time-series datasets with Pandas and SciPy. Architect modular, object-oriented systems using Pydantic models and interface-driven design. Integrate relational and document databases (PostgreSQL, MySQL, MongoDB, CouchDB, SQLite). Mentor interns through onboarding, code review, and task delegation.</p>
      </div>

      <div class="experience-block">
        <div class="role">Research Intern</div>
        <div class="company">Florida Institute for Human &amp; Machine Cognition (IHMC)</div>
        <div class="date">Feb 2023 — Aug 2023 · Pensacola, FL</div>
        <p style="margin-top:8px;">Automated system configuration and validation processes using Python and Bash scripting. Built internal dashboards and visualization tools using Plotly Dash for data exploration and stakeholder insight generation.</p>
      </div>

      <div class="experience-block">
        <div class="role">Undergraduate Research Assistant</div>
        <div class="company">University of West Florida — Center for Cybersecurity and AI</div>
        <div class="date">Aug 2022 — May 2023 · Pensacola, FL</div>
        <p style="margin-top:8px;">Developed web interfaces for an OSINT vehicle-security portal using C# and JavaScript, including a CVSS calculator to standardize vulnerability scoring and support security assessments.</p>
      </div>

      <div class="experience-block">
        <div class="role">Software Engineer I — Intern</div>
        <div class="company">Dynamic Software Solutions (DS2)</div>
        <div class="date">May 2022 — Aug 2022 · Niceville, FL</div>
        <p style="margin-top:8px;">Developed software components using C#, SQL Server, and game engines (Unity, Unreal Engine 5), contributing to interactive and simulation-based applications.</p>
      </div>

      <h2>🎓 Education</h2>
      <div class="experience-block">
        <div class="role">M.S. Cybersecurity — Software &amp; System Security</div>
        <div class="company">University of West Florida</div>
        <div class="date">May 2025</div>
      </div>
      <div class="experience-block" style="margin-top:12px;">
        <div class="role">B.S. Software Design &amp; Development, Minor in Computer Science</div>
        <div class="company">University of West Florida</div>
        <div class="date">May 2023</div>
        <p style="margin-top:4px;font-size:13px;">Certificates in Cybersecurity and Database Systems</p>
      </div>

      <h2>📜 Certifications</h2>
      <p>
        <span class="badge badge-green">CompTIA Security+</span>
        <span class="badge badge-blue">CITI Export Compliance</span>
        <span class="badge badge-purple">CITI Biomedical Research</span>
      </p>
    </div>
  `
};
