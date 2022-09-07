import { Link as ChakraLink, Box, useColorMode, VStack, HStack } from '@chakra-ui/react'
import { ReactElement, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
// import { ChaoticOrbit } from '@uiball/loaders'
import { CommitPerDateLog, DateCommit } from '@zkp/types'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { DATA_DIR } from '@zkp/paths'
import { CommitList } from '../../components/Commits/CommitList'
// import { HistoryGraph } from '../../components/HistoryGraph'
import { ActivityLayout } from '../../components/Layouts/ActivityLayout'
import { HistoryGraphProps } from '../../components/HistoryGraph/HistoryGraph'

const HistoryGraph = dynamic<HistoryGraphProps>(
  () => import('../../components/HistoryGraph/HistoryGraph').then((mod) => mod.HistoryGraph),
  {
    ssr: false,
    // suspense: true,
  },
)

// export interface SlimCommit {
//   oid: string
//   message: string
//   date: number
//   additions: number
//   deletions: number
//   files: any[]
// }

interface ActivityPageProps {
  log: CommitPerDateLog
}

const findCommitXDaysAgo = (log: DateCommit[], days: number): string => {
  const today = new Date()
  const unixTime = days * 3600 * 24 * 1000
  const commit = log.find(
    (combinedCommit) =>
      today.getTime() -
        new Date(combinedCommit?.lastDate ? combinedCommit.lastDate * 1000 : today).getTime() >
      unixTime,
  )

  return commit?.lastOid || ''
}

export const ActivityPage = (props: ActivityPageProps) => {
  const { log } = props
  const [diffs, setDiffs] = useState<{ commit1: string; commit2: string }>()

  const theme = useColorMode()
  const dark = theme.colorMode === 'dark'

  const reverseLogValues = Object.values(log).reverse()

  return (
    <>
      <Head>
        <title>Activity | Thomas&apos; Thesis</title>
      </Head>
      <VStack justifyContent="center" spacing={6} mt={20}>
        <Box w="80%" height={100} backgroundColor={dark ? 'dark.secondary' : 'gray.50'}>
          {/* <Suspense fallback={<ChaoticOrbit />}> */}
          <HistoryGraph data={log} dark={dark} diffs={diffs} setDiffs={setDiffs} />
          {/* </Suspense> */}
        </Box>
        <HStack spacing={5}>
          <Link
            prefetch={false}
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 7)}/${
              reverseLogValues[0].lastOid
            }`}
          >
            <ChakraLink transition="color 0.2s" _hover={{ color: 'primary' }}>
              Last week
            </ChakraLink>
          </Link>
          <Link
            href={`/compare/${findCommitXDaysAgo(reverseLogValues, 30)}/${
              reverseLogValues[0].lastOid
            }`}
            prefetch={false}
          >
            <ChakraLink transition="color 0.2s" _hover={{ color: 'primary' }}>
              Last month
            </ChakraLink>
          </Link>
        </HStack>
      </VStack>
      <Box mx={{ base: '5%', md: '15%' }} my={{ base: 5, md: 20 }}>
        <CommitList commitLog={log} />
      </Box>
    </>
  )
}

export default ActivityPage

export const getStaticPaths = async () => ({ paths: ['/activity'], fallback: 'blocking' })

export const getStaticProps = async () => {
  console.log(DATA_DIR)
  const dataPerDate = JSON.parse(await readFile(join(DATA_DIR, 'gitPerDate.json'), 'utf8'))

  console.log(dataPerDate)
  return { props: { log: dataPerDate }, revalidate: 3600 }
}

ActivityPage.getLayout = (page: ReactElement) => <ActivityLayout>{page}</ActivityLayout>
