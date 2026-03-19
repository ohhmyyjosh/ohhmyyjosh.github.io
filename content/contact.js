// ── content/contact.js ──
// Contact info (rendered as markdown/HTML)

const contact = {
  name: 'contact.html',
  lang: 'HTML',
  icon: '&lt;/&gt;',
  iconClass: 'icon-html',
  type: 'markdown',
  content: `
    <div class="markdown-view">
      <h1>📬 Contact</h1>
      <p>Let's connect! Reach out through any of these channels.</p>

      <div class="contact-grid">
        <span class="label">Email</span>
        <span class="value"><a href="mailto:joshpatterson.contact@gmail.com">joshpatterson.contact@gmail.com</a></span>
        
        <span class="label">LinkedIn</span>
        <span class="value"><a href="https://linkedin.com/in/jpatterson-dev" target="_blank" rel="noopener noreferrer">linkedin.com/in/jpatterson-dev</a></span>
        
        <span class="label">Phone</span>
        <span class="value">(850) 293-6887</span>
        
        <span class="label">Location</span>
        <span class="value">Pensacola, FL</span>
      </div>

      <h2 style="margin-top:32px;">💬 Get In Touch</h2>
      <p>I'm always interested in hearing about new opportunities, interesting projects, or just chatting about tech. Don't hesitate to reach out!</p>

      <pre><code>&lt;a href="mailto:joshpatterson.contact@gmail.com"&gt;
  Let's build something together.
&lt;/a&gt;</code></pre>
    </div>
  `
};
