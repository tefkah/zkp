import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  VStack,
  Heading,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  PopoverFooter,
  HStack,
  Box,
  Tooltip,
} from '@chakra-ui/react'
import { PlusIcon } from '@primer/octicons-react'
import React, { useState } from 'react'
import { CategoryData } from '../../queries/getDiscussion'

interface Props {
  discussionCategories: CategoryData
}

export const NewDiscussion = (props: Props) => {
  const { discussionCategories } = props
  const nodes = discussionCategories.data.repository.discussionCategories.nodes
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  return (
    <Popover>
      <PopoverTrigger>
        <Button leftIcon={<PlusIcon />}>New Discussion</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>New discussion</PopoverHeader>
        <PopoverBody>
          <VStack spacing={2} alignItems="flex-start">
            <Heading size="sm">Title</Heading>
            <Input value={title} onChange={(v) => setTitle(v.target.value)} />
            <Heading size="sm">Description*</Heading>
            <Textarea value={body} onChange={(v) => setBody(v.target.value)} />
            <Heading size="sm">Category</Heading>
            <Menu>
              <MenuButton rightIcon={<ChevronDownIcon />} as={Button}>
                Category
              </MenuButton>
              <MenuList>
                {nodes.map((node) => {
                  const { emojiHTML, id, name, description } = node
                  return (
                    <MenuItem
                      onClick={() => setCategory(id)}
                      icon={<Box dangerouslySetInnerHTML={{ __html: emojiHTML }} />}
                      key={id}
                    >
                      <Tooltip label={description}>{name}</Tooltip>
                    </MenuItem>
                  )
                })}
              </MenuList>
            </Menu>
          </VStack>
        </PopoverBody>

        <PopoverFooter>
          <HStack w="full" spacing={2} justifyContent="flex-end">
            <Button>Cancel</Button>
            <Button colorScheme="green">Create</Button>
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
