// ported from the great https://github.com/giscus/giscus

export const renderMarkdown = (text: string, token?: string, context?: string) =>
  fetch(process.env.GITHUB_MARKDOWN_API_URL!, {
    method: 'POST',
    headers: token ? { Authorization: `token ${token}` } : {},
    body: JSON.stringify({ mode: 'gfm', text, ...(context ? { context } : {}) }),
  }).then((r) => r.text())
