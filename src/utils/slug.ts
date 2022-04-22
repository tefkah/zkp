export const slugify = (title: string) => title.replace(/-/g, '_').replace(/ /g, '-')
export const deslugify = (slug: string) =>
  decodeURIComponent(slug).replace(/-/g, ' ').replace(/_/g, '-')
