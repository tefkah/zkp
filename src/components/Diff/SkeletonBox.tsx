import React from 'react'

interface Props {}

export const SkeletonBox = (props: Props) => {
  return (
    <Box
      w="full"
      borderWidth={1}
      backgroundColor={bodyColor}
      overflow="auto"
      borderRadius="xl"
      boxShadow="sm"
    >
      <Flex
        w="full"
        //borderTopRadius="md"
        px={4}
        //borderWidth={1}
        py={2}
        alignItems="bottom"
        justifyContent="space-between"
        backgroundColor={headerColor}
        //mb={4}
      >
        <HStack maxW="85%">
          <IconButton
            size="sm"
            variant="ghost"
            icon={isOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
            aria-label="Hide/Show diff"
            onClick={onToggle}
          />
          <Heading fontWeight="600" isTruncated size="sm">
            {<Link href={`/${filepath}`}>{filepath}</Link>}
          </Heading>
        </HStack>
        <HStack spacing={4}>
          <ButtonGroup
            isAttached
            size="sm"
            variant="outline"
            colorScheme={useColorModeValue('gray', 'black')}
          >
            <Button onClick={() => setRaw(false)} isActive={!raw}>
              Rich
            </Button>
            <Button onClick={() => setRaw(true)} isActive={raw}>
              Raw
            </Button>
          </ButtonGroup>
          <HStack>
            <Text mx={3} color="red.500">{`-${deletions}`}</Text>
            <Text color="green.500">{`+${additions}`}</Text>
          </HStack>
        </HStack>
      </Flex>
      {!isOpen && (
        <Container my={4} sx={{ ...noteStyle }}>
          {children}
        </Container>
      )}
    </Box>
  )
}
