// ported from the great https://github.com/giscus/giscus

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
  useDisclosure,
} from '@chakra-ui/react'
import { PlusIcon } from '@primer/octicons-react'
import React, { useState } from 'react'
import { CategoryData } from '../../queries/getDiscussion'
import { createDiscussion } from '../../services/github/createDiscussion'

interface Props {
  discussionCategories: CategoryData
  token: string
}

export const NewDiscussion = (props: Props) => {
  const { discussionCategories, token } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [category, setCategory] = useState<{ id: string; emoji: any; name: string }>({
    id: '',
    emoji: '',
    name: '',
  })
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const handleSubmit = () => {
    if (!title || !category) return
    createDiscussion(token, {
      input: { repositoryId: 'R_kgDOGiFakw', categoryId: category.id, title, body },
    })
    onClose()
  }

  const nodes = discussionCategories?.data?.repository?.discussionCategories?.nodes || []
  return (
    <Popover {...{ isOpen, onOpen, onClose }} closeOnBlur={false}>
      <PopoverTrigger>
        <Button colorScheme="teal" leftIcon={<PlusIcon />} fontWeight="bold">
          New Discussion
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>New discussion</PopoverHeader>
        <PopoverBody>
          <VStack spacing={2} alignItems="flex-start">
            <Heading size="sm">Title*</Heading>
            <Input value={title} onChange={(v) => setTitle(v.target.value)} />
            <Heading size="sm">Description</Heading>
            <Textarea value={body} onChange={(v) => setBody(v.target.value)} />
            <Heading size="sm">Category*</Heading>
            <Menu>
              <MenuButton rightIcon={<ChevronDownIcon />} as={Button}>
                {category.id ? (
                  <HStack>
                    <Box dangerouslySetInnerHTML={{ __html: category.emoji }} />
                    {category.name}
                  </HStack>
                ) : (
                  'Category'
                )}
              </MenuButton>
              <MenuList>
                {nodes.map((node) => {
                  const { emojiHTML, id, name, description } = node
                  return (
                    <Tooltip key="name" label={description}>
                      <MenuItem
                        onClick={() => setCategory({ id, name, emoji: emojiHTML })}
                        icon={<Box dangerouslySetInnerHTML={{ __html: emojiHTML }} />}
                        key={id}
                      >
                        {name}
                      </MenuItem>
                    </Tooltip>
                  )
                })}
              </MenuList>
            </Menu>
          </VStack>
        </PopoverBody>

        <PopoverFooter>
          <HStack w="full" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} colorScheme="green">
              Create
            </Button>
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
