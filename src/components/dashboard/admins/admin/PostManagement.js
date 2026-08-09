import React, { useState, useEffect } from "react";
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
  Select,
  Switch,
  useToast,
  IconButton,
  HStack,
  Badge,
  Link,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";
import { useRef } from "react";
import { Empty } from "antd";
import "antd/dist/reset.css";

// Import all post type components
import {
  HeaderAndParagraphPost,
  VideoEmbedPost,
  PopoutModalPost,
  GalleryPost,
  SliderPost,
} from './postTypes';

// Import notification management component
import NotificationManagement from './NotificationManagement';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    postType: "",
    isPublished: false,
    content: {}
  });
  const [deletePost, setDeletePost] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  
  const toast = useToast();
  const cancelRef = useRef();

  const postTypes = [
    { value: "Header and Paragraph", label: "Header and Paragraph" },
    { value: "Video Embed", label: "Video Embed" },
    { value: "Popout/Modal", label: "Popout/Modal" },
    { value: "Gallery", label: "Gallery" },
    { value: "Slider", label: "Slider" }
  ];

  // Map post types to their components
  const getPostTypeComponent = (postType) => {
    switch (postType) {
      case "Header and Paragraph":
        return HeaderAndParagraphPost;
      case "Video Embed":
        return VideoEmbedPost;
      case "Popout/Modal":
        return PopoutModalPost;
      case "Gallery":
        return GalleryPost;
      case "Slider":
        return SliderPost;
      default:
        return null;
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Basic validation - skip name validation for Header and Paragraph and Slider
    if (formData.postType !== "Header and Paragraph" && formData.postType !== "Slider") {
      if (!formData.name.trim()) {
        errors.name = "Post name is required";
      } else if (formData.name.trim().length < 3) {
        errors.name = "Post name must be at least 3 characters long";
      }
    }

    if (!formData.postType) {
      errors.postType = "Post type is required";
    }

    // Post type specific validation
    if (formData.postType) {
      switch (formData.postType) {
        case "Header and Paragraph":
          if (!formData.content?.title?.trim()) {
            errors.heroTitle = "Header title is required";
          }
          break;

        case "Video Embed":
          const uploadType = formData.content?.uploadType || 'link';
          if (uploadType === 'link') {
            if (!formData.content?.videoUrl?.trim()) {
              errors.videoUrl = "Video URL or file is required";
            }
          } else {
            if (!formData.content?.videoFile) {
              errors.videoUrl = "Video URL or file is required";
            }
          }
          break;

        case "Gallery":
          if (!formData.content?.images || formData.content.images.length === 0) {
            errors.galleryImages = "At least one image is required";
          }
          break;

        case "Slider":
          if (!formData.content?.slides || formData.content.slides.length === 0) {
            errors.sliderSlides = "At least one slide is required";
          }
          break;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();
      
      if (data.success) {
        // Sort posts by sortOrder
        const sortedPosts = data.data.sort((a, b) => a.sortOrder - b.sortOrder);
        setPosts(sortedPosts);
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
        description: "Failed to fetch posts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Drag and Drop Handlers
  const handleDragStart = (e, post) => {
    setDraggedItem(post);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.style.opacity = "0.5";
  };

  const handleDragOver = (e, post) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedItem && draggedItem._id !== post._id) {
      setDragOverItem(post);
    }
  };

  const handleDragEnter = (e, post) => {
    e.preventDefault();
    if (draggedItem && draggedItem._id !== post._id) {
      setDragOverItem(post);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDrop = async (e, targetPost) => {
    e.preventDefault();
    e.target.style.opacity = "1";
    
    if (!draggedItem || draggedItem._id === targetPost._id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    try {
      // Get current positions
      const draggedIndex = posts.findIndex(p => p._id === draggedItem._id);
      const targetIndex = posts.findIndex(p => p._id === targetPost._id);
      
      // Create new array with reordered items
      const newPosts = [...posts];
      const [removed] = newPosts.splice(draggedIndex, 1);
      newPosts.splice(targetIndex, 0, removed);
      
      // Update sortOrder for all affected posts
      const updatedPosts = newPosts.map((post, index) => ({
        ...post,
        sortOrder: index
      }));
      
      setPosts(updatedPosts);
      
      // Update sortOrder in database
      const response = await fetch("/api/posts/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posts: updatedPosts.map(post => ({
            id: post._id,
            sortOrder: post.sortOrder
          }))
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Post order updated successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update post order",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // Revert to original order if update failed
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // Revert to original order if update failed
      fetchPosts();
    } finally {
      setDraggedItem(null);
      setDragOverItem(null);
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        name: post.name,
        postType: post.postType,
        isPublished: post.isPublished,
        content: post.content || {}
      });
    } else {
      setEditingPost(null);
      setFormData({
        name: "",
        postType: "",
        isPublished: false,
        content: {}
      });
    }
    setValidationErrors({});
    onOpen();
  };

  const handleSubmit = async () => {
    setValidationErrors({});

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setSaving(true);
      
      // Prepare the data to send
      let dataToSend = { ...formData };
      
      // For Slider posts, use the slider title as the name if no name is provided
      if (formData.postType === "Slider" && !formData.name) {
        dataToSend.name = formData.content?.sliderTitle || "Slider";
      }
      
      // For Header and Paragraph posts, use the title as the name if no name is provided
      if (formData.postType === "Header and Paragraph" && !formData.name) {
        dataToSend.name = formData.content?.title || "Header and Paragraph";
      }
      
      const url = "/api/posts";
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost 
        ? { id: editingPost._id, ...dataToSend }
        : dataToSend;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        const displayName = dataToSend.name || formData.name;
        toast({
          title: "Success",
          description: editingPost 
            ? `Post "${displayName}" updated successfully` 
            : `Post "${displayName}" created successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        fetchPosts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save post",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deletePost._id }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Post "${deletePost.name}" deleted successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onDeleteClose();
        fetchPosts();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete post",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const generatePreviewToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const getStatusColor = (isPublished) => {
    return isPublished ? "green" : "red";
  };

  // Get the appropriate component for the selected post type
  const PostTypeComponent = getPostTypeComponent(formData.postType);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="green">
        <TabList>
          <Tab>Post Management</Tab>
          <Tab>Notification Management</Tab>
        </TabList>

        <TabPanels>
          {/* Post Management Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Text fontSize="2xl" fontWeight="bold">
                Post Management
              </Text>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="green"
                onClick={() => handleOpenModal()}
              >
                Add New Post
              </Button>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple" bg="white" borderRadius="md" boxShadow="md">
                <Thead>
                  <Tr>
                    <Th width="50px"></Th>
                    <Th>Sort Order</Th>
                    <Th>Post Name</Th>
                    <Th>Post Type</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {posts.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>
                        <Center>
                          <Empty description="No data" />
                        </Center>
                      </Td>
                    </Tr>
                  ) : (
                    posts.map((post, index) => (
                      <Tr 
                        key={post._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, post)}
                        onDragOver={(e) => handleDragOver(e, post)}
                        onDragEnter={(e) => handleDragEnter(e, post)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, post)}
                        onDragEnd={handleDragEnd}
                        bg={dragOverItem?._id === post._id ? "blue.50" : "transparent"}
                        border={dragOverItem?._id === post._id ? "2px dashed blue" : "none"}
                        cursor="move"
                        _hover={{ bg: "gray.50" }}
                        transition="all 0.2s"
                      >
                        <Td>
                          <IconButton
                            icon={<DragHandleIcon />}
                            size="sm"
                            variant="ghost"
                            aria-label="Drag to reorder"
                            cursor="grab"
                            _active={{ cursor: "grabbing" }}
                          />
                        </Td>
                        <Td>{post.sortOrder + 1}</Td>
                        <Td>{post.name}</Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {post.postType}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(post.isPublished)}>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<FaEye />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => {
                                const token = generatePreviewToken();
                                window.open(`/admin/post/preview/${token}?postId=${post._id}`, '_blank');
                              }}
                              title="Preview"
                            />
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="yellow"
                              variant="ghost"
                              onClick={() => handleOpenModal(post)}
                              title="Edit"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => {
                                setDeletePost(post);
                                onDeleteOpen();
                              }}
                              title="Delete"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box mt={6}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Preview Links (Admin Only):
              </Text>
              <HStack spacing={4}>
                <Link
                  href={`/admin/home/preview/${generatePreviewToken()}`}
                  target="_blank"
                  color="blue.500"
                  textDecoration="underline"
                >
                  Homepage Preview
                </Link>
              </HStack>
            </Box>
          </TabPanel>

          {/* Notification Management Tab */}
          <TabPanel>
            <NotificationManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="90vw">
          <ModalHeader>
            {editingPost ? "Edit Post" : "Add New Post"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Show validation errors at the top */}
              {Object.keys(validationErrors).length > 0 && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold" mb={1}>Please fix the following errors:</Text>
                    <VStack align="start" spacing={1}>
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <Text key={field} fontSize="sm">• {error}</Text>
                      ))}
                    </VStack>
                  </Box>
                </Alert>
              )}

              <FormControl isInvalid={!!validationErrors.name}>
                <FormLabel>Post Type</FormLabel>
                <Select
                  value={formData.postType}
                  onChange={(e) => setFormData({ ...formData, postType: e.target.value, content: {} })}
                  placeholder="Select post type"
                >
                  {postTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                {validationErrors.postType && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {validationErrors.postType}
                  </Text>
                )}
              </FormControl>

              {PostTypeComponent && (
                <PostTypeComponent 
                  formData={formData} 
                  setFormData={setFormData}
                  validationErrors={validationErrors}
                />
              )}

              {!PostTypeComponent && formData.postType && (
                <Text color="gray.500" textAlign="center" py={8}>
                  Please select a post type to configure the content
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={saving}
              loadingText="Saving..."
              isDisabled={!formData.postType}
            >
              {editingPost ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete &quot;{deletePost?.name}&quot;? This action cannot be undone.
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
    </Box>
  );
};

export default PostManagement; 