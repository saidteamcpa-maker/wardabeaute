export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let out = html;
  out = out.replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "");
  out = out.replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>/gi, "");
  out = out.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/(href)\s*=\s*"javascript:[^"]*"/gi, '$1="#"');
  const allowed = /^(p|br|strong|b|em|i|u|ul|ol|li|h2|h3|h4|div|span|a|blockquote|section)$/i;
  out = out.replace(/<\s*\/?\s*([a-z0-9]+)\b([^>]*)>/gi, (m, tag: string, attrs: string) => {
    if (!allowed.test(tag)) return "";
    if (tag.toLowerCase() === "a") {
      const href = (attrs.match(/href\s*=\s*"([^"]*)"/i) || [])[1] || "";
      if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(href)) return "<a>";
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    }
    return m;
  });
  return out;
}
