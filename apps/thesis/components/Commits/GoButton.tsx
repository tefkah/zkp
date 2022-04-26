import { CloseIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'

import Link from 'next/link'

export const GoButton = ({
  compair,
  oid,
  setCompair,
}: {
  compair: string[]
  oid: string
  setCompair: (compair: string[]) => void
}) =>
  compair?.[0] === oid ? (
    <IconButton
      icon={<CloseIcon />}
      aria-label="Stop comparing"
      size="xs"
      variant="ghost"
      onClick={() => setCompair([])}
    />
  ) : (
    <Link prefetch={false} passHref href={`/compare/${compair[0]}/${oid}`}>
      <IconButton icon={<ArrowRightIcon />} aria-label="Compare" size="xs">
        <ArrowRightIcon h={6} p={1} />
      </IconButton>
    </Link>
  )
