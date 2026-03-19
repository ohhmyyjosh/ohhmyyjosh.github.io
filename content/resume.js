// ── content/resume.js ──
// Resume page — embedded PDF viewer with download button

const resume = {
  name: 'resume.pdf',
  lang: 'PDF',
  icon: '📄',
  iconClass: 'icon-pdf',
  type: 'markdown',
  content: `
    <div class="markdown-view" style="max-width:100%; padding:24px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <h1 style="border:none; padding:0; margin:0;">📄 Resume</h1>
        <a href="JPatterson-Resume.pdf" download="JPatterson-Resume.pdf"
           style="display:inline-flex; align-items:center; gap:8px;
                  background:var(--accent); color:#fff; padding:8px 16px;
                  border-radius:4px; font-family:'Inter',sans-serif;
                  font-size:13px; font-weight:500; text-decoration:none;
                  transition:background 0.15s;">
          ⬇ Download PDF
        </a>
      </div>
      <div style="flex:1; border-radius:4px; overflow:hidden; border:1px solid var(--border); height:calc(100vh - 200px);">
        <iframe src="JPatterson-Resume.pdf"
                style="width:100%; height:100%; border:none; background:#fff;">
        </iframe>
      </div>
    </div>
  `
};
