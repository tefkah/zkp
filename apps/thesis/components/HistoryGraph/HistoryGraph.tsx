// import { Point, ResponsiveLine } from '@nivo/line'
import { LineSvgProps, Point } from '@nivo/line'
import { parse } from 'date-fns'
import dynamic from 'next/dynamic'
import React, { useCallback, useMemo } from 'react'
import { DateCommit, CommitDatum, CommitPerDateLog } from '../../types'
import { Tooltip } from './Tooltip'

interface Props {
  data: CommitPerDateLog
  diffs: { commit1: string; commit2: string } | undefined
  setDiffs: (diffs: { commit1: string; commit2: string }) => void
  dark: boolean
}

const ResponsiveLine = dynamic<LineSvgProps>(() =>
  import('@nivo/line').then((module) => module.ResponsiveLine),
)

export const HistoryGraph = (props: Props) => {
  const { data, diffs, setDiffs } = props

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
  }

  const onClickHandler = (point: Point): void => {
    if (!point) {
      return
    }
    const diffData = point?.data as unknown as CommitDatum
    compareDiffs(diffData?.id)
    // compareDiffs(datum?.originalDatum?.id, datum?.originalSeries.data)
  }

  const commitChartData = useMemo(() => {
    const [adds, dels] = ['additions', 'deletions'].map((a) =>
      Object.entries(data).map((entry: Array<string | DateCommit>): CommitDatum => {
        const date = entry[0] as string
        const commit = entry[1] as DateCommit
        return {
          message: commit.lastMessage.split('\n')?.[0],
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

  const TooltipComp = useCallback(
    ({ point }: { point: Point }) => <Tooltip {...{ point, commitChartData }} />,
    [commitChartData],
  )
  return (
    <ResponsiveLine
      margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      data={commitChartData}
      isInteractive
      useMesh
      curve="monotoneX"
      enableArea
      enableGridY={false}
      yScale={{ min: -500, max: 'auto', type: 'linear' }}
      xScale={{ type: 'time' }}
      axisBottom={{
        format: (value: Date) => value.toISOString(),
        tickValues: 'every 10 days',
      }}
      crosshairType="x"
      onClick={onClickHandler}
      tooltip={TooltipComp}
    />
  )
}
