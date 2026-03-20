// ── app.js ──
// VS Code Portfolio — Editor, Terminal, and Search
//
// Depends on content/*.js being loaded first

// ── File Registry ──
const files = { readme, about, experience, projects, skills, contact, resume };

// ── State ──
let openTabs = ['readme'];
let activeFile = 'readme';
let activePanel = 'explorer'; // 'explorer' | 'search'
let terminalCmdHistory = [];
let terminalHistoryIdx = -1;

// ════════════════════════════════════════════════════════════
//  RENDERING
// ════════════════════════════════════════════════════════════

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderContent(fileKey) {
  const file = files[fileKey];
  const editor = document.getElementById('editorContent');
  const minimap = document.getElementById('minimap');

  if (file.type === 'markdown') {
    editor.innerHTML = file.content;
    generateMinimap(30, minimap);
  } else {
    const lines = file.content;
    let lineNums = '';
    let codeLines = '';
    let ln = 1;

    lines.forEach(line => {
      lineNums += `<div>${ln}</div>`;
      if (!Array.isArray(line) || line.length === 0) {
        codeLines += '<div class="code-line">&nbsp;</div>';
      } else {
        const spans = line
          .map(token => `<span class="${token.cls || ''}">${escapeHtml(token.text)}</span>`)
          .join('');
        codeLines += `<div class="code-line">${spans}</div>`;
      }
      ln++;
    });

    editor.innerHTML = `
      <div class="line-numbers">${lineNums}</div>
      <div class="code-area">${codeLines}</div>
    `;
    generateMinimap(lines.length, minimap);
  }

  document.getElementById('breadcrumbs').innerHTML = `
    <span>portfolio</span><span class="sep">›</span><span>${file.name}</span>
  `;
  document.getElementById('statusLang').textContent = file.lang;
}

function generateMinimap(lineCount, container) {
  const types = ['short', 'med', 'long', 'med indent', 'short indent', 'long'];
  let html = '<div style="padding-top:8px;">';
  for (let i = 0; i < Math.min(lineCount, 50); i++) {
    const t = types[Math.floor(Math.random() * types.length)];
    html += `<div class="minimap-line ${t}"></div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
//  TABS
// ════════════════════════════════════════════════════════════

function openFile(fileKey) {
  if (!openTabs.includes(fileKey)) openTabs.push(fileKey);
  activeFile = fileKey;
  renderTabs();
  renderContent(fileKey);
  updateTreeSelection(fileKey);
  updateMobileTitle();
  if (isMobile()) closeMobileSidebar();
}

function closeTab(fileKey) {
  openTabs = openTabs.filter(t => t !== fileKey);
  if (openTabs.length === 0) openTabs = ['readme'];
  if (activeFile === fileKey) activeFile = openTabs[openTabs.length - 1];
  renderTabs();
  renderContent(activeFile);
  updateTreeSelection(activeFile);
}

function renderTabs() {
  const bar = document.getElementById('tabsBar');
  bar.innerHTML = openTabs.map(key => {
    const f = files[key];
    return `
      <div class="tab ${key === activeFile ? 'active' : ''}" data-file="${key}" draggable="true" onclick="openFile('${key}')">
        <span class="tab-icon ${f.iconClass}">${f.icon}</span>
        <span>${f.name}</span>
        <span class="tab-close" onclick="event.stopPropagation(); closeTab('${key}')">×</span>
      </div>
    `;
  }).join('');
}

function updateTreeSelection(fileKey) {
  document.querySelectorAll('.tree-file').forEach(el => {
    el.classList.toggle('active', el.dataset.file === fileKey);
  });
}

// ════════════════════════════════════════════════════════════
//  SIDEBAR PANELS
// ════════════════════════════════════════════════════════════

function showPanel(panel) {
  const panels = {
    explorer: document.getElementById('sidebarExplorer'),
    search: document.getElementById('sidebarSearch'),
    source: document.getElementById('sidebarSource'),
  };
  const icons = {
    explorer: document.getElementById('activityExplorer'),
    search: document.getElementById('activitySearch'),
    source: document.getElementById('activitySource'),
  };

  // Mobile: open as slide-over drawer
  if (isMobile()) {
    const overlay = document.getElementById('mobileOverlay');
    Object.values(panels).forEach(p => {
      p.classList.remove('mobile-open');
      p.style.display = 'none';
    });
    if (panels[panel]) {
      panels[panel].classList.add('mobile-open');
      panels[panel].style.display = 'flex';
      overlay.classList.add('show');
      if (panel === 'search') {
        setTimeout(() => document.getElementById('searchInput').focus(), 100);
      }
      if (panel === 'source') renderGitHistory();
    }
    return;
  }

  // Desktop: toggle off if clicking the active panel
  if (activePanel === panel) {
    Object.values(panels).forEach(p => p.style.display = 'none');
    Object.values(icons).forEach(i => i.classList.remove('active'));
    activePanel = null;
    return;
  }

  activePanel = panel;
  Object.entries(panels).forEach(([key, p]) => {
    p.style.display = key === panel ? 'flex' : 'none';
  });
  Object.entries(icons).forEach(([key, i]) => {
    i.classList.toggle('active', key === panel);
  });

  if (panel === 'search') {
    setTimeout(() => document.getElementById('searchInput').focus(), 50);
  }
  if (panel === 'source') {
    renderGitHistory();
  }
}

let terminalLastHeight = 200; // remember user's resize preference

function toggleTerminal() {
  const panel = document.getElementById('terminalPanel');
  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    // Save current height before closing
    terminalLastHeight = panel.offsetHeight;
    panel.style.transition = 'height 0.25s ease';
    panel.style.height = '0px';
    panel.classList.remove('open');
    // Clean up transition after animation
    setTimeout(() => { panel.style.transition = ''; }, 260);
  } else {
    panel.style.transition = 'height 0.25s ease';
    panel.style.height = terminalLastHeight + 'px';
    panel.classList.add('open');
    setTimeout(() => {
      panel.style.transition = '';
      document.getElementById('terminalInput').focus();
    }, 260);
  }
}

// ════════════════════════════════════════════════════════════
//  SEARCH
// ════════════════════════════════════════════════════════════

// Extract plain text from a file for searching
function getFileText(fileKey) {
  const file = files[fileKey];
  if (file.type === 'markdown') {
    // Strip HTML tags to get raw text
    const tmp = document.createElement('div');
    tmp.innerHTML = file.content;
    return tmp.textContent || tmp.innerText || '';
  } else {
    // Code files: join all token text
    return file.content
      .map(line => Array.isArray(line) ? line.map(t => t.text).join('') : '')
      .join('\n');
  }
}

function performSearch(query) {
  const results = document.getElementById('searchResults');
  if (!query || query.length < 2) {
    results.innerHTML = '<div class="search-placeholder">Type at least 2 characters to search.</div>';
    return;
  }

  const q = query.toLowerCase();
  let html = '';
  let totalMatches = 0;

  Object.keys(files).forEach(key => {
    const file = files[key];
    const text = getFileText(key);
    const lines = text.split('\n');
    const matchingLines = [];

    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(q)) {
        matchingLines.push({ lineNum: idx + 1, text: line.trim() });
      }
    });

    if (matchingLines.length > 0) {
      totalMatches += matchingLines.length;
      html += `<div class="search-file-group">`;
      html += `<div class="search-file-name" onclick="openFile('${key}')">${file.icon} ${file.name}</div>`;
      matchingLines.forEach(m => {
        // Highlight matches in the preview
        const preview = escapeHtml(m.text.substring(0, 120));
        const highlighted = preview.replace(
          new RegExp(`(${escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
          '<span class="search-highlight">$1</span>'
        );
        html += `<div class="search-match" onclick="openFile('${key}')">
          <span class="search-line-num">Ln ${m.lineNum}</span>
          <span class="search-preview">${highlighted}</span>
        </div>`;
      });
      html += `</div>`;
    }
  });

  if (totalMatches === 0) {
    html = `<div class="search-placeholder">No results found for "<strong>${escapeHtml(query)}</strong>"</div>`;
  } else {
    html = `<div class="search-count">${totalMatches} result${totalMatches !== 1 ? 's' : ''} in ${Object.keys(files).length} files</div>` + html;
  }

  results.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
//  TERMINAL
// ════════════════════════════════════════════════════════════

const terminalCommands = {
  help: () => {
    return [
      '<span class="term-heading">Available commands:</span>',
      '',
      '  <span class="term-cmd">help</span>            Show this help message',
      '  <span class="term-cmd">about</span>           Quick summary of who I am',
      '  <span class="term-cmd">skills</span>          List my technical skills',
      '  <span class="term-cmd">experience</span>      Show work experience',
      '  <span class="term-cmd">education</span>       Show education background',
      '  <span class="term-cmd">contact</span>         Get my contact info',
      '  <span class="term-cmd">projects</span>        List my projects',
      '  <span class="term-cmd">open &lt;file&gt;</span>      Open a file (readme, about, experience, projects, skills, contact)',
      '  <span class="term-cmd">ls</span>              List files in portfolio',
      '  <span class="term-cmd">cat &lt;file&gt;</span>      View file info',
      '  <span class="term-cmd">whoami</span>          Who am I?',
      '  <span class="term-cmd">pwd</span>             Print working directory',
      '  <span class="term-cmd">date</span>            Show current date',
      '  <span class="term-cmd">echo &lt;text&gt;</span>     Echo text back',
      '  <span class="term-cmd">fortune</span>         Random dev quote',
      '  <span class="term-cmd">neofetch</span>        System info (portfolio style)',
      '  <span class="term-cmd">clear</span>           Clear terminal',
    ].join('\n');
  },

  about: () => {
    return [
      '<span class="term-heading">Joshua Patterson</span>',
      'Software Engineer @ IHMC · Pensacola, FL',
      '3+ years building full-stack systems for federally funded research.',
      'Specializing in API design, data pipelines, and workflow automation.',
    ].join('\n');
  },

  skills: () => {
    return [
      '<span class="term-heading">Technical Skills</span>',
      '',
      '  Languages:    Python, Java, JavaScript, C#',
      '  Frameworks:   FastAPI, Flask, Node.js, Plotly Dash',
      '  Data:         Pandas, NumPy, SciPy',
      '  Databases:    PostgreSQL, MySQL, MongoDB, CouchDB, SQLite',
      '  Technologies: REST APIs, WebSockets, Microservices, Docker, AWS, Git',
    ].join('\n');
  },

  experience: () => {
    return [
      '<span class="term-heading">Work Experience</span>',
      '',
      '  <span class="term-accent">Research Associate</span>     IHMC · Aug 2023–Present',
      '  <span class="term-accent">Research Intern</span>        IHMC · Feb–Aug 2023',
      '  <span class="term-accent">Research Assistant</span>     UWF Cybersecurity & AI · Aug 2022–May 2023',
      '  <span class="term-accent">Software Engineer I</span>    DS2 · May–Aug 2022',
    ].join('\n');
  },

  education: () => {
    return [
      '<span class="term-heading">Education</span>',
      '',
      '  M.S. Cybersecurity (Software & System Security) · UWF · 2025',
      '  B.S. Software Design & Development, Minor in CS · UWF · 2023',
      '  Certificates: Cybersecurity, Database Systems',
      '',
      '<span class="term-heading">Certifications</span>',
      '  CompTIA Security+ · CITI Export Compliance · CITI Biomedical Research',
    ].join('\n');
  },

  contact: () => {
    return [
      '<span class="term-heading">Contact</span>',
      '',
      '  Email:    joshpatterson.contact@gmail.com',
      '  LinkedIn: linkedin.com/in/jpatterson-dev',
      '  Phone:    (850) 293-6887',
      '  Location: Pensacola, FL',
    ].join('\n');
  },

  projects: () => {
    return [
      '<span class="term-heading">Projects</span>',
      '',
      '  ▸ Distributed Research Automation Platform  [Python, FastAPI, WebSockets]',
      '  ▸ Time-Series Data Pipeline                 [Python, Pandas, SciPy]',
      '  ▸ Research Dashboard Suite                   [Python, Plotly Dash]',
      '  ▸ OSINT Vehicle Security Portal              [C#, JavaScript]',
      '  ▸ VS Code Portfolio (this site!)             [HTML, CSS, JS]',
    ].join('\n');
  },

  ls: () => {
    const fileList = Object.values(files).map(f => `  ${f.icon} ${f.name}`);
    return ['<span class="term-heading">portfolio/</span>', ''].concat(fileList).join('\n');
  },

  whoami: () => 'joshua-patterson',

  pwd: () => '/home/josh/portfolio',

  date: () => new Date().toString(),

  fortune: () => {
    const quotes = [
      '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
      '"First, solve the problem. Then, write the code." — John Johnson',
      `"Code is like humor. When you have to explain it, it's bad." — Cory House`,
      '"Simplicity is the soul of efficiency." — Austin Freeman',
      '"Make it work, make it right, make it fast." — Kent Beck',
      '"The best error message is the one that never shows up." — Thomas Fuchs',
      `"Programming isn't about what you know; it's about what you can figure out." — Chris Pine`,
      '"Talk is cheap. Show me the code." — Linus Torvalds',
      '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
      '"Deleted code is debugged code." — Jeff Sickel',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  neofetch: () => {
    return [
      '',
      '  <span class="term-accent">      ████████      </span>   <span class="term-heading">josh@portfolio</span>',
      '  <span class="term-accent">    ██        ██    </span>   ──────────────────',
      '  <span class="term-accent">  ██    ████    ██  </span>   <span class="term-cmd">OS:</span>     Portfolio v1.0',
      '  <span class="term-accent">  ██  ██    ██  ██  </span>   <span class="term-cmd">Host:</span>   GitHub Pages',
      '  <span class="term-accent">  ██  ██    ██  ██  </span>   <span class="term-cmd">Shell:</span>  bash 5.1.16',
      '  <span class="term-accent">  ██    ████    ██  </span>   <span class="term-cmd">Theme:</span>  VS Code Dark+',
      '  <span class="term-accent">    ██        ██    </span>   <span class="term-cmd">Font:</span>   Fira Code',
      '  <span class="term-accent">      ████████      </span>   <span class="term-cmd">Stack:</span>  HTML/CSS/JS',
      '                           <span class="term-cmd">Role:</span>   Software Engineer',
      '                           <span class="term-cmd">Loc:</span>    Pensacola, FL',
      '',
    ].join('\n');
  },

  clear: () => '__CLEAR__',
};

// Aliases
terminalCommands.man = terminalCommands.help;

function handleTerminalCommand(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  // echo
  if (cmd === 'echo') {
    return args || '';
  }

  // open <file>
  if (cmd === 'open') {
    const fileKey = args.toLowerCase()
      .replace(/\.(md|py|json|ts|yaml|html|pdf)$/, '')
      .replace('about_me', 'about');
    if (files[fileKey]) {
      openFile(fileKey);
      return `Opened ${files[fileKey].name}`;
    }
    return `<span class="term-error">File not found: ${escapeHtml(args)}</span>\nAvailable: ${Object.values(files).map(f => f.name).join(', ')}`;
  }

  // cat <file>
  if (cmd === 'cat') {
    const fileKey = args.toLowerCase()
      .replace(/\.(md|py|json|ts|yaml|html|pdf)$/, '')
      .replace('about_me', 'about');
    if (files[fileKey]) {
      const f = files[fileKey];
      return `<span class="term-heading">${f.name}</span> (${f.lang})\nType: ${f.type === 'markdown' ? 'Rich content' : 'Syntax-highlighted code'}\nUse "open ${fileKey}" to view in editor.`;
    }
    return `<span class="term-error">cat: ${escapeHtml(args)}: No such file</span>`;
  }

  // Known command
  if (terminalCommands[cmd]) {
    return terminalCommands[cmd]();
  }

  // Unknown
  return `<span class="term-error">command not found: ${escapeHtml(cmd)}</span>\nType <span class="term-cmd">help</span> for available commands.`;
}

function runTerminalInput() {
  const input = document.getElementById('terminalInput');
  const history = document.getElementById('terminalHistory');
  const body = document.getElementById('terminalBody');
  const val = input.value;

  // Add to history display
  const cmdLine = document.createElement('div');
  cmdLine.innerHTML = `<span class="prompt">josh@portfolio</span> <span class="cmd">~ $ </span>${escapeHtml(val)}`;
  history.appendChild(cmdLine);

  // Track command history for up/down
  if (val.trim()) {
    terminalCmdHistory.push(val);
    terminalHistoryIdx = terminalCmdHistory.length;
  }

  // Execute
  const result = handleTerminalCommand(val);

  if (result === '__CLEAR__') {
    history.innerHTML = '';
  } else if (result) {
    const outputEl = document.createElement('div');
    outputEl.className = 'terminal-output';
    outputEl.innerHTML = result;
    history.appendChild(outputEl);
  }

  input.value = '';
  body.scrollTop = body.scrollHeight;
}

// ════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+F → Search
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    showPanel('search');
  }
  // Ctrl+Shift+E → Explorer
  if (e.ctrlKey && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    showPanel('explorer');
  }
  // Ctrl+` → Terminal
  if (e.ctrlKey && e.key === '`') {
    e.preventDefault();
    toggleTerminal();
  }
});

// ════════════════════════════════════════════════════════════
//  EVENT LISTENERS
// ════════════════════════════════════════════════════════════

// Search input
document.getElementById('searchInput').addEventListener('input', (e) => {
  performSearch(e.target.value);
});

// Terminal input
document.getElementById('terminalInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runTerminalInput();
  }
  // Up arrow — previous command
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (terminalCmdHistory.length > 0 && terminalHistoryIdx > 0) {
      terminalHistoryIdx--;
      e.target.value = terminalCmdHistory[terminalHistoryIdx];
    }
  }
  // Down arrow — next command
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (terminalHistoryIdx < terminalCmdHistory.length - 1) {
      terminalHistoryIdx++;
      e.target.value = terminalCmdHistory[terminalHistoryIdx];
    } else {
      terminalHistoryIdx = terminalCmdHistory.length;
      e.target.value = '';
    }
  }
});

// Click terminal body to focus input
document.getElementById('terminalBody').addEventListener('click', () => {
  document.getElementById('terminalInput').focus();
});

// Folder toggle
document.querySelectorAll('.tree-folder-label').forEach(el => {
  el.addEventListener('click', () => {
    el.parentElement.classList.toggle('open');
  });
});

// ════════════════════════════════════════════════════════════
//  TERMINAL RESIZE
// ════════════════════════════════════════════════════════════

(function initTerminalResize() {
  const handle = document.getElementById('terminalResizeHandle');
  const panel = document.getElementById('terminalPanel');
  let isDragging = false;
  let startY = 0;
  let startHeight = 0;

  handle.addEventListener('mousedown', (e) => {
    if (!panel.classList.contains('open')) return;
    isDragging = true;
    startY = e.clientY;
    startHeight = panel.offsetHeight;
    handle.classList.add('dragging');
    panel.classList.add('resizing');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = startY - e.clientY;
    const newHeight = Math.max(100, Math.min(startHeight + delta, window.innerHeight * 0.7));
    panel.style.height = newHeight + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    handle.classList.remove('dragging');
    panel.classList.remove('resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
})();

// ════════════════════════════════════════════════════════════
//  THEME SWITCHER
// ════════════════════════════════════════════════════════════

const themes = [
  { id: 'dark', name: 'Dark+' },
  { id: 'light', name: 'Light' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'dracula', name: 'Dracula' },
];
let currentThemeIdx = 0;

function cycleTheme() {
  currentThemeIdx = (currentThemeIdx + 1) % themes.length;
  const theme = themes[currentThemeIdx];
  if (theme.id === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme.id);
  }
  document.getElementById('statusTheme').textContent = theme.name;
  localStorage.setItem('portfolio-theme', theme.id);
}

function loadSavedTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    const idx = themes.findIndex(t => t.id === saved);
    if (idx >= 0) {
      currentThemeIdx = idx;
      if (saved !== 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
      }
      document.getElementById('statusTheme').textContent = themes[idx].name;
    }
  }
}

// ════════════════════════════════════════════════════════════
//  GIT HISTORY (Source Control panel)
// ════════════════════════════════════════════════════════════

const gitCommits = [
  { hash: 'a3f7c21', msg: 'Add interactive terminal with commands', date: '2 hours ago' },
  { hash: 'e91b4d8', msg: 'Implement search across all files', date: '3 hours ago' },
  { hash: '7c2f9a1', msg: 'Add resume PDF viewer and download', date: '5 hours ago' },
  { hash: 'b8d3e56', msg: 'Split into modular file structure', date: '8 hours ago' },
  { hash: '4f1a7c3', msg: 'Add theme switcher (Dark+, Light, Monokai, Dracula)', date: '1 day ago' },
  { hash: 'd2e8f94', msg: 'Populate with real resume data', date: '1 day ago' },
  { hash: '91c4b27', msg: 'Build VS Code portfolio layout', date: '2 days ago' },
  { hash: 'f5a0d13', msg: 'feat: initial commit', date: '2 days ago' },
];

function renderGitHistory() {
  const panel = document.getElementById('gitPanel');
  let html = '<div class="git-graph-label">Commit History</div>';
  gitCommits.forEach(c => {
    html += `<div class="git-commit">
      <span class="git-commit-hash">${c.hash}</span>
      <span class="git-commit-msg">${c.msg}</span>
      <span class="git-commit-date">${c.date}</span>
    </div>`;
  });
  panel.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
//  TAB DRAG & DROP
// ════════════════════════════════════════════════════════════

let draggedTab = null;

function initTabDrag() {
  const tabsBar = document.getElementById('tabsBar');

  tabsBar.addEventListener('dragstart', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    draggedTab = tab.dataset.file;
    tab.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  tabsBar.addEventListener('dragover', (e) => {
    e.preventDefault();
    const tab = e.target.closest('.tab');
    if (!tab || tab.dataset.file === draggedTab) return;
    // Remove drag-over from all tabs
    tabsBar.querySelectorAll('.tab').forEach(t => t.classList.remove('drag-over'));
    tab.classList.add('drag-over');
  });

  tabsBar.addEventListener('dragleave', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) tab.classList.remove('drag-over');
  });

  tabsBar.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetTab = e.target.closest('.tab');
    if (!targetTab || !draggedTab) return;

    const fromIdx = openTabs.indexOf(draggedTab);
    const toIdx = openTabs.indexOf(targetTab.dataset.file);
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;

    // Reorder
    openTabs.splice(fromIdx, 1);
    openTabs.splice(toIdx, 0, draggedTab);
    renderTabs();
  });

  tabsBar.addEventListener('dragend', () => {
    draggedTab = null;
    tabsBar.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('dragging', 'drag-over');
    });
  });
}


// ════════════════════════════════════════════════════════════
//  STATUS BAR CLOCK
// ════════════════════════════════════════════════════════════

function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  document.getElementById('statusClock').textContent = `${h12}:${m} ${ampm}`;
}

// ════════════════════════════════════════════════════════════
//  MOBILE SIDEBAR
// ════════════════════════════════════════════════════════════

function isMobile() {
  return window.innerWidth <= 768;
}

function toggleMobileSidebar() {
  const overlay = document.getElementById('mobileOverlay');
  const explorer = document.getElementById('sidebarExplorer');
  const search = document.getElementById('sidebarSearch');
  const source = document.getElementById('sidebarSource');

  // If any sidebar is open, close everything
  if (explorer.classList.contains('mobile-open') ||
      search.classList.contains('mobile-open') ||
      source.classList.contains('mobile-open')) {
    closeMobileSidebar();
    return;
  }

  // Open the explorer by default
  explorer.classList.add('mobile-open');
  explorer.style.display = 'flex';
  overlay.classList.add('show');
}

function closeMobileSidebar() {
  const overlay = document.getElementById('mobileOverlay');
  document.querySelectorAll('.sidebar').forEach(s => {
    s.classList.remove('mobile-open');
    // On mobile, sidebars should be hidden unless explicitly opened
    if (isMobile()) {
      s.style.display = 'none';
    }
  });
  overlay.classList.remove('show');
}

function updateMobileTitle() {
  const el = document.getElementById('mobileNavTitle');
  if (el && files[activeFile]) {
    el.textContent = files[activeFile].name;
  }
}


// ── Init ──
renderContent('readme');
loadSavedTheme();
initTabDrag();
updateClock();
setInterval(updateClock, 15000);
updateMobileTitle();
