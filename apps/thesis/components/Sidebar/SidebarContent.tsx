import React from 'react'

import { Box, Flex, Spacer, Tag, useColorModeValue, FlexProps, VStack } from '@chakra-ui/react'

// import { useRoutes } from 'categories/parse-categories'
import Link from 'next/link'
import { Link as SLink } from 'react-scroll'

interface RouteLinkProps {
  children?: any
  isSection?: boolean
  href?: string
  active?: string
}
const RouteLink = (props: RouteLinkProps) => {
  const { children, isSection, href, active } = props
  return isSection || active ? children : <Link href={href || ''}>{children}</Link>
}

type MenuLinkProps = {
  children: any
  active?: boolean
  isSection?: boolean
  isComp?: boolean
  activeSection?: any
  section?: any
  subSection?: any
  href?: string
}
export const MenuLink = (props: MenuLinkProps & FlexProps) => {
  const { children, active, isSection, isComp, activeSection, section, subSection, href, ...rest } =
    props

  const activeColor = 'brand.500' // useColorModeValue('brand.800', 'brand.200')

  const hasAlert = !isSection && !isComp && section.alert
  return (
    <Flex
      p={2}
      pl={8}
      mx={2}
      my={1}
      {...rest}
      alignItems="center"
      sx={{
        '.active .comp': {
          color: activeColor,
          transition: 'all 0.3s ease-in-out',
        },
        '.active .compb': {
          borderLeftColor: useColorModeValue('brand.300', 'brand.200'),
          boxShadow: `0 0 50px #fff`,
        },
      }}
    >
      <CLink {...props} activeSection={activeSection}>
        {children}
      </CLink>
      {(subSection || hasAlert) && <Spacer />}
      {hasAlert && (
        <Tag rounded="md" variant="subtle" colorScheme={section.alert.variant}>
          <span>{section.alert.message} </span>
        </Tag>
      )}
      {subSection}
    </Flex>
  )
}
const CLink = (props: any) => {
  const { children, active, isSection, activeSection, href } = props

  const tColor = 'brand.500' // useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const activeColor = 'brand.500' // useColorModeValue('brand.800', 'brand.200')

  const activeStyle = {
    color: activeColor,
    fontWeight: 'semibold',
  }

  const sectionStyle: any = {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 'xs',
    color: tColor,
  }

  const baseStyle: any = {
    color: tColor,
    _hover: {
      color: activeColor,
      transition: 'all 0.3s ease-in-out',
    },
    cursor: !active && 'pointer',
    textTransform: 'capitalize',
    fontSize: 'sm',
    fontWeight: 'md',
  }

  const SLinkProps = {
    to: activeSection,
    offset: -90,
    smooth: true,
    isDynamic: true,
    duration: 500,
    spy: true,
    activeClass: 'active',
  }

  const RLinkProps = {
    active,
    href,
    isSection,
  }

  const LinkProps = activeSection ? SLinkProps : RLinkProps
  const LinkComp: any = activeSection ? SLink : RouteLink

  return (
    <LinkComp {...LinkProps}>
      <Box {...(isSection ? sectionStyle : baseStyle)} {...(active && activeStyle)}>
        {children}
      </Box>
    </LinkComp>
  )
}

export const CompLink = (props: any) => {
  const { component, activeSection } = props
  return (
    <MenuLink
      active={component.active}
      href={component.url}
      activeSection={activeSection && component.preview}
      isComp
      ml={3}
      my={0}
      py={0}
    >
      <Flex alignItems="center" role="group">
        <Box
          py={2}
          borderLeftWidth="4px"
          borderColor={useColorModeValue('blackAlpha.400', 'whiteAlpha.400')}
          _groupHover={{
            borderColor: useColorModeValue('brand.300', 'brand.200'),
          }}
          h="full"
          className="compb"
        >
          &nbsp;
        </Box>
        <Box pl={2} py={2} className="comp">
          {component.name}
        </Box>
      </Flex>
    </MenuLink>
  )
}

export interface Routes {}
const SidebarContent = () => 
  // const routes = useRoutes();
   (
    <VStack spacing={0} display="flex" alignItems="flex-start">
      <MenuLink isSection>Chapters</MenuLink>
      <MenuLink isSection>Notes</MenuLink>
      {/* {routes.map((category, cid) => (
        <Box pt={cid !== 0 ? 5 : 0} key={cid}>
          {category.map((section: any, sid: any) => {
            return <SidebarSection section={section} key={`section-${sid}`} />
          })}
        </Box>
      ))} */}
    </VStack>
  )

export default SidebarContent
