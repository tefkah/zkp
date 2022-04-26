import { GoButton } from './GoButton'
import { InitialButton } from './InitialButton'

export interface CompareButtonProps {
  compair: string[]
  setCompair: (compair: string[]) => void
  oid: string
}
export const CompareButton = (props: CompareButtonProps) => {
  const { compair, setCompair, oid } = props

  return compair.length === 1 ? (
    <GoButton {...{ compair, setCompair, oid }} />
  ) : (
    <InitialButton {...{ oid, setCompair }} />
  )
}
