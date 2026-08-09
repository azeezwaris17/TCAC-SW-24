import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Switch,
  VStack,
  Text,
  Image,
  IconButton,
  useToast,
  SimpleGrid,
  HStack,
  Button,
  InputGroup,
  InputRightElement,
  Textarea,
  Badge,
  Flex,
  Center,
  useColorModeValue,
  border,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, DragHandleIcon } from '@chakra-ui/icons';

const GalleryPost = ({ formData, setFormData }) => {
  const [images, setImages] = useState(formData.content?.images || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  // Keep local state in sync with formData
  useEffect(() => {
    setImages(formData.content?.images || []);
  }, [formData.content?.images]);

  const handleImageUpload = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(), // Generate unique ID
          url: e.target.result,
          caption: '',
          name: file.name,
          size: file.size,
          type: file.type
        };
        
        const currentImages = formData.content?.images || [];
        const updatedImages = [...currentImages, newImage];
        
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            images: updatedImages
          }
        }));
        
        // Update local state immediately
        setImages(updatedImages);
      };
      reader.readAsDataURL(file);
    });
  }, [formData.content?.images, setFormData, toast]);

  const handleFileInput = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      handleImageUpload(files);
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        images: updatedImages
      }
    }));
  };

  const updateImageCaption = (imageId, caption) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, caption } : img
    );
    setImages(updatedImages);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        images: updatedImages
      }
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Gallery Title</FormLabel>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter gallery title"
          size="lg"
        />
      </FormControl>

      {/* Drag and Drop Zone */}
      <FormControl>
        <FormLabel>Upload Images</FormLabel>
        <Box
          border="2px dashed"
          borderColor={isDragOver ? "blue.400" : borderColor}
          borderRadius="lg"
          p={8}
          textAlign="center"
          bg={isDragOver ? "blue.50" : bgColor}
          transition="all 0.2s"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          cursor="pointer"
          _hover={{
            borderColor: "blue.300",
            bg: "blue.50"
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <VStack spacing={3}>
            <Box
              w={8}
              h={8}
              borderRadius="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <AddIcon color="gray.500" />
            </Box>
            <Text fontSize="lg" fontWeight="medium">
              {isDragOver ? "Drop images here" : "Click to upload or drag images here"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Supports JPG, PNG, GIF. Maximum 5MB per image.
            </Text>
            <Button size="sm" colorScheme="blue" variant="outline">
              Choose Files
            </Button>
          </VStack>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            display="none"
          />
        </Box>
      </FormControl>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Gallery Images ({images.length})
            </Text>
            <Badge colorScheme="blue" variant="subtle">
              {images.length} image{images.length !== 1 ? 's' : ''}
            </Badge>
          </HStack>
          
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {images.map((image, index) => (
              <Box
                key={image.id}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                shadow="sm"
                transition="all 0.2s"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-2px)"
                }}
              >
                {/* Image Preview */}
                <Box position="relative">
                  <Image
                    src={image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                  
                  {/* Image Info Overlay */}
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="blackAlpha.700"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    {formatFileSize(image.size)}
                  </Box>
                  
                  {/* Delete Button */}
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => removeImage(image.id)}
                    position="absolute"
                    top={2}
                    left={2}
                    size="sm"
                    colorScheme="red"
                    aria-label="Remove image"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                  />
                </Box>
                
                {/* Caption Input */}
                <Box p={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" mb={2}>Caption</FormLabel>
                    <Textarea
                      value={image.caption}
                      onChange={(e) => updateImageCaption(image.id, e.target.value)}
                      placeholder="Enter image caption..."
                      size="sm"
                      rows={2}
                      resize="vertical"
                    />
                  </FormControl>
                  
                  {/* File Info */}
                  <HStack mt={3} justify="space-between" fontSize="xs" color="gray.500">
                    <Text noOfLines={1} maxW="150px">
                      {image.name}
                    </Text>
                    <Text>
                      #{index + 1}
                    </Text>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Gallery Settings */}
      <Box border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
        <Text fontSize="md" fontWeight="bold" mb={3}>Gallery Settings</Text>
        
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <FormControl>
            <FormLabel>Layout</FormLabel>
            <Input
              as="select"
              value={formData.content?.layout || 'grid'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  layout: e.target.value
                }
              }))}
            >
              <option value="grid">Grid</option>
              <option value="masonry">Masonry</option>
              <option value="carousel">Carousel</option>
            </Input>
          </FormControl>

          <FormControl>
            <FormLabel>Columns (Grid Layout)</FormLabel>
            <Input
              type="number"
              min="1"
              max="6"
              value={formData.content?.columns || 3}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  columns: parseInt(e.target.value) || 3
                }
              }))}
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Publish Gallery
        </FormLabel>
        <Switch
          isChecked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
        />
      </FormControl>
    </VStack>
  );
};

export default GalleryPost; 