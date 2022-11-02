const getMarkdown = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/tefkah/thesis-writing/main/A%20Space%20Is%20Just%20a%20Set%20with%20some%20Structure.md',
  )
  const text = await res.text()
  return text
}

const Page = async () => {
  const text = await getMarkdown()
  return <p className="prose prose-slate">{text}</p>
}

export default Page
