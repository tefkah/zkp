import { useEffect, useState } from 'react'
import getFileStateChanges from '../utils/getFileStateChanges'
import parseGitRepo from '../utils/parseGitRepo'

const Page = () => {
  const [result, setResult] = useState<any>()
  useEffect(() => {
    ;(async () => {
      const repo = await parseGitRepo('https://github.com/ThomasFKJorna/thesis-writing')
      console.log(repo)
      setResult(repo)
    })()
  })
  return <div></div>
}

export default Page
