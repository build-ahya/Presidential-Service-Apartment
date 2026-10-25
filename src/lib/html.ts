import 'server-only';
import sanitizeHtml from 'sanitize-html';

/** Admin-authored HTML (descriptions, legal pages, posts) is sanitised before it is rendered. */
export function safeHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img', 'h1', 'h2', 'figure', 'figcaption', 'u',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}

export const paragraphs = (text?: string) =>
  (text ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
