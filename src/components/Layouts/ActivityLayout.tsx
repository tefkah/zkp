import BasicLayout from './BasicLayout'
import { Box, HStack } from '@chakra-ui/react'
import { HeaderLink } from '../Header/HeaderLink'

export interface BasicLayoutProps {
  children: React.ReactElement
}
export default function ActivityLayout(props: BasicLayoutProps) {
  const { children } = props

  return (
    <BasicLayout>
      <Box w="full" px={{ base: 0, md: 20 }} my={{ base: 4, md: 16 }}>
        <Box borderWidth={{ base: 0, md: 1 }} borderRadius={{ base: 0, md: 'md' }}>
          <HStack
            spacing={4}
            px={4}
            fontWeight="semibold"
            mb={{ base: 4, md: 16 }}
            borderBottomWidth={1}
          >
            <HeaderLink href={'/activity'}>History</HeaderLink>
            <HeaderLink href={'/activity/doing'}>Progress</HeaderLink>
          </HStack>
          {children}
        </Box>
      </Box>
    </BasicLayout>
  )
}
