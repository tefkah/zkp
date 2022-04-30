import { Button } from '@chakra-ui/react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { Sorts } from '../../types'

interface SortButtonProps {
  sort: Sorts
  setSort: (sort: Sorts) => void
  values: [sort: Sorts, reverseSort: Sorts]
  children: React.ReactNode
}
export const SortButton = (props: SortButtonProps) => {
  const { sort, setSort, values, children } = props
  const [sort1, sort2] = values
  return (
    <Button
      fontWeight="medium"
      fontSize="sm"
      variant="ghoster"
      onClick={() => setSort(sort === sort1 ? sort2 : sort1)}
      rightIcon={
        ([sort1, sort2].includes(sort) && (sort === sort1 ? <FaArrowDown /> : <FaArrowUp />)) ||
        undefined
      }
    >
      {children}
    </Button>
  )
}
