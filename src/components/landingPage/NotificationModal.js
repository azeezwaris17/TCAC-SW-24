import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'blue';
      case 'warning': return 'orange';
      case 'success': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center py={8}>
              <Spinner size="lg" color="green.500" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>Notifications</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" maxH="400px" overflowY="auto">
            {notifications.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text>No notifications available.</Text>
              </Alert>
            ) : (
              notifications
                .filter(notification => notification.isActive)
                .map((notification) => (
                  <Box
                    key={notification._id}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    <HStack justify="space-between" align="start" mb={2}>
                      <Text fontWeight="bold" fontSize="lg">
                        {notification.title}
                      </Text>
                      <Badge colorScheme={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </HStack>
                    
                    <Text color="gray.700" mb={3}>
                      {notification.message}
                    </Text>
                    
                    <Text fontSize="sm" color="gray.500">
                      {formatDate(notification.createdAt)}
                    </Text>
                  </Box>
                ))
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal; 