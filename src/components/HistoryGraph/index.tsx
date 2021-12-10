import { Text, Container, useColorMode } from '@chakra-ui/react'
import { Point, ResponsiveLine } from '@nivo/line'
import { format } from 'date-fns-tz'
import { parse } from 'date-fns'
import React, { useMemo } from 'react'
import { DateCommit, CommitDatum } from '../../api'

interface Props {
  data: any
  diffs: any
  setDiffs: any
  dark: boolean
}

export const HistoryGraph = (props: Props) => {
  const { data, diffs, setDiffs, dark } = props

  const onClickHandler = (point: Point, event: any): void => {
    if (!point) {
      return
    }
    console.log(point)
    const data = point?.data as unknown as CommitDatum
    console.log(data)
    compareDiffs(data?.id!)
    // compareDiffs(datum?.originalDatum?.id, datum?.originalSeries.data)
  }

  const compareDiffs = (
    diff: string | undefined,
    commits: DateCommit[] | undefined = Object.values(data),
  ) => {
    if (!commits || !diff) {
      setDiffs({ commit1: '', commit2: '' })
      return
    }

    const commitList = commits.map((commit: DateCommit) => commit.lastOid).reverse() // the gitlab api needs the commits to be in chronological order
    // in order to compare the commits
    if (diffs?.commit1) {
      const compareObj =
        commitList.indexOf(diff) > commitList.indexOf(diffs.commit1)
          ? { commit1: diff, commit2: diffs.commit1 }
          : { commit1: diffs.commit1, commit2: diff }
      setDiffs(compareObj)
      return
    }
    setDiffs({ commit1: diff, commit2: '' })
    return
  }

  const commitChartData = useMemo(() => {
    const [adds, dels] = ['additions', 'deletions'].map((a) =>
      //@ts-ignore
      Object.entries(data).map((entry: Array<string | DateCommit>): CommitDatum => {
        const date = entry[0] as string
        const commit = entry[1] as DateCommit
        return {
          message: commit.lastMessage,
          y: a === 'additions' ? commit.totalAdditions : -commit.totalDeletions,
          x: parse(date, 'yyyy-MM-dd', new Date()), // parseISO(`${date}T12:00:00.000Z`),
          id: commit.lastOid,
        }
      }),
    )

    return [
      {
        id: 'Additions',
        data: adds,
      },
      { id: 'Deletions', data: dels },
    ]
  }, [data])

  return (
    <ResponsiveLine
      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      data={commitChartData}
      isInteractive
      useMesh
      curve="monotoneX"
      enableArea
      //enableGridX={false}
      enableGridY={false}
      yScale={{ min: -500, max: 'auto', type: 'linear' }}
      xScale={{ type: 'time' }}
      axisBottom={{
        format: (value: Date) => value.toISOString(),
        tickValues: 'every 10 days',
      }}
      crosshairType="x"
      onClick={onClickHandler}
      //enableSlices={'x'}
      tooltip={({ point }) => {
        const node = point.data as unknown as CommitDatum
        return (
          <Container p={3} borderRadius="md" boxShadow="md" bg={dark ? 'gray.600' : 'gray.100'}>
            <Text fontWeight="bold">
              {node.message.slice(0, 8) === 'Scripted' ? 'Auto-commit' : node.message}
            </Text>
            <Text color="gray.400" fontSize={9}>{`${format(
              node.x as Date,
              'MMMM dd, hh:mm',
            )}`}</Text>
            {point.serieId === 'Additions' ? (
              <>
                <Text fontSize={12} color="green.500">{`+ ${node.y}`}</Text>
                <Text fontSize={12} color="red.500">
                  {`- ${Math.abs(commitChartData[1]?.data?.[point?.index]?.y)}`}
                </Text>
              </>
            ) : (
              <>
                <Text fontSize={12} color="green.500">{`+ ${
                  commitChartData[0].data[point.index - commitChartData[0]?.data?.length]?.y
                }`}</Text>
                <Text fontSize={12} color="red.500">{`- ${Math.abs(node.y)}`}</Text>
              </>
            )}
          </Container>
        )
      }}
    />
  )
}
