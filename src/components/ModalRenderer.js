import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Image,
  Box,
  VStack,
  useToast
} from '@chakra-ui/react';

const ModalRenderer = ({ post, onClose }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const toast = useToast();

  // Get modal settings from post content
  const {
    showDelay = 0,
    behavior = 'once_per_session',
    size = 'medium',
    showCloseButton = true,
    allowClickOutside = true,
    autoCloseDelay = 0,
    body = '',
    image = null,
    video = null
  } = post.content || {};

  // Check if modal should be shown based on behavior
  const shouldShowModal = () => {
    switch (behavior) {
      case 'always':
        return true;
      case 'once_per_session':
        return !sessionStorage.getItem(`modal_${post._id}`);
      case 'once_per_day':
        const lastShown = localStorage.getItem(`modal_${post._id}_day`);
        const today = new Date().toDateString();
        return lastShown !== today;
      case 'once_per_week':
        const lastShownWeek = localStorage.getItem(`modal_${post._id}_week`);
        const thisWeek = new Date().toDateString();
        return lastShownWeek !== thisWeek;
      default:
        return true;
    }
  };

  // Handle modal display logic
  useEffect(() => {
    if (!shouldShowModal()) return;

    const showModal = () => {
      setShouldShow(true);

      // Mark as shown based on behavior
      switch (behavior) {
        case 'once_per_session':
          sessionStorage.setItem(`modal_${post._id}`, 'true');
          break;
        case 'once_per_day':
          localStorage.setItem(`modal_${post._id}_day`, new Date().toDateString());
          break;
        case 'once_per_week':
          localStorage.setItem(`modal_${post._id}_week`, new Date().toDateString());
          break;
      }
    };

    // Apply delay if set
    if (showDelay > 0) {
      const timer = setTimeout(showModal, showDelay * 1000);
      return () => clearTimeout(timer);
    } else {
      showModal();
    }
  }, [post._id, showDelay, behavior]);

  // Auto-close timer
  useEffect(() => {
    if (shouldShow && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        setShouldShow(false);
        if (onClose) onClose();
      }, autoCloseDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, autoCloseDelay, onClose]);

  // Get modal size
  const getModalSize = () => {
    switch (size) {
      case 'small':
        return 'sm';
      case 'large':
        return 'lg';
      case 'fullscreen':
        return 'full';
      default:
        return 'md';
    }
  }; 

  // Don't render if modal shouldn't show
  if (!shouldShow) return null;

  const handleClose = () => {
    setShouldShow(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      isOpen={shouldShow}
      onClose={allowClickOutside ? handleClose : undefined}
      size={getModalSize()}
      isCentered
      closeOnOverlayClick={allowClickOutside}
      closeOnEsc={showCloseButton}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.7)" />
      <ModalContent
        bg="white"
        borderRadius="lg"
        shadow="2xl"
        maxH="90vh"
        maxW="90vw"
        w="fit-content"
        overflow="hidden"
      >
        {showCloseButton && (
          <ModalCloseButton
            position="absolute"
            right={3}
            top={3}
            zIndex={10}
            bg="white"
            borderRadius="full"
            size="lg"
            _hover={{ bg: 'gray.100' }}
          />
        )}
        
        <ModalHeader
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={4}
        >
          <Text fontSize="xl" fontWeight="bold">
            {post.name}
          </Text>
        </ModalHeader>

        <ModalBody py={6} px={6} display="flex" justifyContent="center" alignItems="center">
          <VStack spacing={4} align="stretch">
            {/* Media content */}
            {image && (
              <Box textAlign="center">
                <Image
                  src={image}
                  alt={post.name}
                  maxH="80vh"
                  maxW="80vw"
                  objectFit="contain"
                  borderRadius="md"
                />
              </Box>
            )}
            
            {video && (
              <Box textAlign="center">
                <video
                  src={video}
                  controls
                  style={{
                    maxHeight: '80vh',
                    maxWidth: '80vw',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}

            {/* Text content */}
            {body && (
              <Text
                fontSize="md"
                lineHeight="1.6"
                whiteSpace="pre-line"
                textAlign="center"
              >
                {body}
              </Text>
            )}
          </VStack>
        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default ModalRenderer; 