import { callAllHandlers } from '@chakra-ui/utils'
import * as React from 'react'
import { useControllableProp, useId, useCallbackRef } from '@chakra-ui/react'
import useLocalStorageState from 'use-local-storage-state'

export interface UseDisclosureProps {
  isOpen?: boolean
  defaultIsOpen?: boolean
  onClose?(): void
  onOpen?(): void
  id?: string
}

export const usePersistantDisclosure = (storageKey: string, props: UseDisclosureProps = {}) => {
  const { onClose: onCloseProp, onOpen: onOpenProp, isOpen: isOpenProp, id: idProp } = props

  const onOpenPropCallbackRef = useCallbackRef(onOpenProp)
  const onClosePropCallbackRef = useCallbackRef(onCloseProp)
  const [isOpenState, setIsOpen] = useLocalStorageState(storageKey, {
    defaultValue: props.defaultIsOpen || false,
    ssr: true,
  })
  const [isControlled, isOpen] = useControllableProp(isOpenProp, isOpenState)

  const id = useId(idProp, 'disclosure')

  const onClose = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(false)
    }
    onClosePropCallbackRef?.()
  }, [isControlled, onClosePropCallbackRef])

  const onOpen = React.useCallback(() => {
    if (!isControlled) {
      setIsOpen(true)
    }
    onOpenPropCallbackRef?.()
  }, [isControlled, onOpenPropCallbackRef])

  const onToggle = React.useCallback(() => {
    const action = isOpen ? onClose : onOpen
    action()
  }, [isOpen, onOpen, onClose])

  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
    isControlled,
    getButtonProps: (props: any = {}) => ({
      ...props,
      'aria-expanded': 'true',
      'aria-controls': id,
      onClick: callAllHandlers(props.onClick, onToggle),
    }),
    getDisclosureProps: (props: any = {}) => ({
      ...props,
      hidden: !isOpen,
      id,
    }),
  }
}

export type UseDisclosureReturn = ReturnType<typeof usePersistantDisclosure>
