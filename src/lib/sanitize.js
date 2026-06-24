/**
 * Simple HTML Sanitizer to prevent XSS attacks in rich text descriptions.
 * Strips dangerous tags (script, iframe, style, embed, object, meta, link) and inline event listeners.
 * 
 * @param {string} html 
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (!html) return "";

  // 1. Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove potentially dangerous tags like iframe, object, embed, style, link, meta, frameset, frame
  sanitized = sanitized.replace(/<\/?(iframe|object|embed|style|link|meta|frameset|frame|applet|html|body|head)\b[^>]*>/gi, "");

  // 3. Remove all inline event handlers (onmouseover, onload, onerror, onclick, etc.)
  // Handles quotes gracefully
  sanitized = sanitized.replace(/\son\w+\s*=\s*(['"])(.*?)\1/gi, "");
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // 4. Prevent javascript: and vbscript: URLs in href/src attributes
  sanitized = sanitized.replace(/href\s*=\s*(['"])\s*(javascript|vbscript):.*?\1/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*(['"])\s*(javascript|vbscript):.*?\1/gi, 'src=""');

  return sanitized;
}
