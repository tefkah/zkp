import Head from 'next/head'
import { NearestMilestoneData } from '@zkp/types'
import { getAppAccessToken } from '@zkp/discus'
import { IssueList } from '../../components/Doing/IssueList'
import { ActivityLayout } from '../../components/Layouts/ActivityLayout'
import { nearestMilestoneWithIssues } from '../../queries/milestones'
import { makeGenericGraphQlRequest } from '../../queries/makeGenericGraphQLRequest'

interface Props {
  milestoneContent: NearestMilestoneData
}

export const Doing = ({ milestoneContent }: Props) => (
  <>
    <Head>
      <title>Current Goal | Thomas&apos; Thesis</title>
      <meta
        name="description"
        content={`${milestoneContent?.data?.repository?.milestones?.edges?.[0]?.node?.title}, due on ${milestoneContent?.data?.repository?.milestones?.edges?.[0]?.node?.dueOn}`}
      />
    </Head>
    <IssueList {...{ milestoneContent }} />
  </>
)

Doing.getLayout = (page: React.ReactElement) => <ActivityLayout>{page}</ActivityLayout>
export default Doing

export const getServerSideProps = async () => {
  const token = await getAppAccessToken('thomasfkjorna/thesis-writing')

  const milestoneContent: NearestMilestoneData = await makeGenericGraphQlRequest({
    request: nearestMilestoneWithIssues({ first: 100 }),
    token,
    post: true,
  })

  return { props: { milestoneContent } }
}
