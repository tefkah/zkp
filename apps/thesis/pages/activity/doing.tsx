import Head from 'next/head'
import { IssueList } from '../../components/Doing/IssueList'
import { ActivityLayout } from '../../components/Layouts/ActivityLayout'
import { nearestMilestoneWithIssues } from '../../queries/milestones'
import makeGenericGraphQlRequest from '../../queries/makeGenericGraphQLRequest'
import { getAppAccessToken } from '../../queries/getAccessToken'
import { NearestMilestoneData } from '../../types'

interface Props {
  milestoneContent: NearestMilestoneData
}

export const Doing = ({ milestoneContent }: Props) => (
  <>
    <Head>
      <title>Current Goal | Thomas' Thesis</title>
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
