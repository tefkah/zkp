import { Box } from '@chakra-ui/react'
import { ParsedOrg } from '../services/thesis/parseOrg'
import { FilesData } from '../utils/IDIndex/getFilesData'
import { noteStyle } from './NoteStyle'

interface Props {
  text: string
  data?: FilesData
  currentId: string
}

export const ProcessedOrg = (props: Props) => {
  // try {
  const { text, data, currentId } = props

  return (
    <Box
      className="org-box"
      sx={{
        ...noteStyle,
      }}
    >
      <ParsedOrg {...{ currentId, text, data }} />
    </Box>
  )
}
