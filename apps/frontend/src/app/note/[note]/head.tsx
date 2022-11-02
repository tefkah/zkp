const Head = async ({
  params,
}: {
  params: {
    note: string | string[]
  }
}) => {
  const currentNote =
    typeof params.note === 'string' ? params.note : params.note?.join('/') ?? 'index'
  return (
    <>
      <title>{currentNote}</title>
      <meta property="og:title" content={currentNote} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={`${
          process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_BASE_URL
        }/api/og?title=${encodeURIComponent(currentNote)}`}
      />
    </>
  )
}
export default Head
