// Small markdown helper for club posts.
// Supports the handful of bits people actually type on a wall.
// HERE IS THE ERROR!! 

function escapeHtml(text) {
  // Escape HTML special characters to prevent XSS attacks!! 
  // no HTML injection possible 
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Ensuring that only safe URLs are used in links to prevent XSS attacks.
// safe links only 
function safeHref(href) {
  const value = href.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (
    !value ||
    /[\u0000-\u001f\\]/.test(value) ||
    /^[a-z][a-z\d+.-]*:/i.test(value) ||
    value.startsWith("//")
  ) return null;
  return value;
}

function renderMarkdown(src) {
  const text = escapeHtml(String(src ?? ""));

  return text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Confirms if a link is safe before it renders
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      const destination = safeHref(href);
      return destination ? `<a href="${destination}">${label}</a>` : label;
    })
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

module.exports = { renderMarkdown };
