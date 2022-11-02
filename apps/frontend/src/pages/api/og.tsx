import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const handler = (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'thesis.tefkah.com'

    return new ImageResponse(
      (
        <div tw="flex text-xl flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#f5f5f5] to-[#e5e5e5] text-black">
          {decodeURIComponent(title)}
        </div>
      ),
      {
        width: 1200,
        height: 600,
        emoji: 'blobmoji',
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
export default handler
