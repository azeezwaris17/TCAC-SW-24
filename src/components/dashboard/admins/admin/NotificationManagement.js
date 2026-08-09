import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
 Th,
  Td,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  useToast,
  IconButton,
  HStack,
  Badge,
  Flex,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Center,
  VStack,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRef } from "react";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isActive: true
  });
  const [deleteNotification, setDeleteNotification] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  
  const toast = useToast();
  const cancelRef = useRef();

  const notificationTypes = [
    { value: "info", label: "Information", color: "blue" },
    { value: "warning", label: "Warning", color: "orange" },
    { value: "success", label: "Success", color: "green" },
    { value: "error", label: "Error", color: "red" }
  ];

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenModal = (notification = null) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isActive: notification.isActive
      });
    } else {
      setEditingNotification(null);
      setFormData({
        title: "",
        message: "",
        type: "info",
        isActive: true
      });
    }
    setValidationErrors({});
    onOpen();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const url = editingNotification 
        ? `/api/notifications/${editingNotification._id}`
        : "/api/notifications";
      
      const method = editingNotification ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: editingNotification 
            ? "Notification updated successfully" 
            : "Notification created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        fetchNotifications();
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteNotification) return;

    try {
      const response = await fetch(`/api/notifications/${deleteNotification._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Notification deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        setDeleteNotification(null);
        fetchNotifications();
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getTypeColor = (type) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : "gray";
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
      <Center py={10}>
        <Spinner size="lg" color="green.500" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={4} mb={2}>
            <Text fontSize="2xl" fontWeight="bold">Notification Management</Text>
          </HStack>
          <Text color="gray.600">
            Create and manage notifications that will appear in the header
          </Text>
        </Box>

        {/* Create Button */}
        <Box>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            onClick={() => handleOpenModal()}
          >
            Create New Notification
          </Button>
        </Box>

        {/* Notifications Table */}
        {notifications.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text>No notifications found. Create your first notification to get started.</Text>
          </Alert>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Message</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {notifications.map((notification) => (
                  <Tr key={notification._id}>
                    <Td>
                      <Text fontWeight="medium">{notification.title}</Text>
                    </Td>
                    <Td>
                      <Text noOfLines={2} maxW="300px">
                        {notification.message}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={notification.isActive ? "green" : "red"}>
                        {notification.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(notification.createdAt)}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit notification"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenModal(notification)}
                        />
                        <IconButton
                          aria-label="Delete notification"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            setDeleteNotification(notification);
                            onDeleteOpen();
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingNotification ? "Edit Notification" : "Create New Notification"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!validationErrors.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                  />
                  {validationErrors.title && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {validationErrors.title}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!validationErrors.message}>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={4}
                    resize="vertical"
                  />
                  {validationErrors.message && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {validationErrors.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {notificationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Active
                  </FormLabel>
                  <Switch
                    isChecked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                isLoading={saving}
                loadingText="Saving..."
              >
                {editingNotification ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Notification
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete &quot;{deleteNotification?.title}&quot;? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};

export default NotificationManagement; 