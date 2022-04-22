import React from 'react'
import { chakra, Box, Image, Flex, Icon, useColorModeValue, Avatar } from '@chakra-ui/react'

import { MdHeadset, MdEmail, MdLocationOn } from 'react-icons/md'
import { BsFillBriefcaseFill } from 'react-icons/bs'

const Thomas = () => {
  return (
    <Box
    // w="sm"
    >
      <Avatar
        size="2xl"
        //   fit="cover"
        //  objectPosition="center"
        src="https://avatars.githubusercontent.com/u/21983833?v=4"
        alt="avatar"
      />

      <Box py={4} px={6}>
        <chakra.h1
          fontSize="xl"
          fontWeight="bold"
          color={useColorModeValue('dark.secondary', 'white')}
        >
          Thomas F. K. Jorna
        </chakra.h1>

        <chakra.p py={2} color={useColorModeValue('gray.700', 'gray.400')}>
          Good boi
        </chakra.p>

        <Flex alignItems="center" mt={4} color={useColorModeValue('gray.700', 'gray.200')}>
          <Icon as={BsFillBriefcaseFill} h={6} w={6} mr={2} />
          <chakra.h1 px={2} fontSize="sm">
            Choc UI
          </chakra.h1>
        </Flex>

        <Flex alignItems="center" mt={4} color={useColorModeValue('gray.700', 'gray.200')}>
          <Icon as={MdLocationOn} h={6} w={6} mr={2} />
          <chakra.h1 px={2} fontSize="sm">
            California
          </chakra.h1>
        </Flex>
        <Flex alignItems="center" mt={4} color={useColorModeValue('gray.700', 'gray.200')}>
          <Icon as={MdEmail} h={6} w={6} mr={2} />

          <chakra.h1 px={2} fontSize="sm">
            hello@tefkah.com
          </chakra.h1>
        </Flex>
      </Box>
    </Box>
  )
}

export default Thomas
