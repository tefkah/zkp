import { IconButton } from '@chakra-ui/react'
import { IoIosGitCompare } from 'react-icons/io'

export const InitialButton = ({
  oid,
  setCompair,
}: {
  oid: string
  setCompair: (compair: string[]) => void
}) => (
  <IconButton
    size="xs"
    variant="ghost"
    icon={<IoIosGitCompare />}
    aria-label="Compare commit with another commit"
    onClick={() => setCompair([oid])}
  />
)
