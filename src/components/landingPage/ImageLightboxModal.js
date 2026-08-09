import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, IconButton, Image, Flex } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function ImageLightboxModal({ images, initialIndex, isOpen, onClose }) {
  const [current, setCurrent] = useState(initialIndex || 0)
  useEffect(() => { if (isOpen) setCurrent(initialIndex || 0) }, [isOpen, initialIndex])
  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1))
  if (!images || !images.length) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.85)" />
      <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh" display="flex" alignItems="center" justifyContent="center">
        <ModalCloseButton color="white" zIndex={2} size="lg" />
        <ModalBody p={0} display="flex" alignItems="center" justifyContent="center" position="relative">
          {images.length > 1 && (
            <IconButton icon={<FaChevronLeft />} onClick={prev} position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={2} colorScheme="whiteAlpha" bg="rgba(0,0,0,0.5)" _hover={{ bg: 'rgba(0,0,0,0.7)' }} aria-label="Previous" />
          )}
          <Flex w="100%" h="100%" align="center" justify="center">
            <Image src={images[current].url || images[current]} alt={images[current].caption || ''} maxH="80vh" maxW="80vw" borderRadius="md" objectFit="contain" />
          </Flex>
          {images.length > 1 && (
            <IconButton icon={<FaChevronRight />} onClick={next} position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={2} colorScheme="whiteAlpha" bg="rgba(0,0,0,0.5)" _hover={{ bg: 'rgba(0,0,0,0.7)' }} aria-label="Next" />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 