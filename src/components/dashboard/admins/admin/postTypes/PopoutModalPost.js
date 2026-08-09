import React, { useState } from 'react';
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
  Select,
  HStack,
  Textarea,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const PopoutModalPost = ({ formData, setFormData }) => {
  const [imagePreview, setImagePreview] = useState(formData.content?.image || null);
  const [videoPreview, setVideoPreview] = useState(formData.content?.video || null);
  const [mediaType, setMediaType] = useState(formData.content?.image ? 'image' : formData.content?.video ? 'video' : 'image');
  const toast = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setVideoPreview(null);
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            image: e.target.result,
            video: null
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
        setImagePreview(null);
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            video: e.target.result,
            image: null
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setMediaType('image');
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        image: null
      }
    }));
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setMediaType('video');
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        video: null
      }
    }));
  };

  const handleMediaTypeChange = (value) => {
    setMediaType(value);
    if (value === 'image') {
      setVideoPreview(null);
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          video: null
        }
      }));
    } else if (value === 'video') {
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          image: null
        }
      }));
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Modal Title</FormLabel>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter modal title"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Modal Content</FormLabel>
        <Textarea
          value={formData.content?.body || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              body: e.target.value
            }
          }))}
          placeholder="Enter modal content..."
          rows={6}
          resize="vertical"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Modal Media *</FormLabel>
        <RadioGroup value={mediaType} onChange={handleMediaTypeChange}>
          <VStack align="start" spacing={2}>
            <Radio value="image">Image</Radio>
            <Radio value="video">Video</Radio>
          </VStack>
        </RadioGroup>
      </FormControl>

      {mediaType === 'image' && (
        <FormControl isRequired>
          <FormLabel>Choose Image File *</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            p={1}
            isInvalid={!imagePreview}
          />
          {!imagePreview && (
            <Text fontSize="sm" color="red.500">
              Please select an image file
            </Text>
          )}
          {imagePreview && (
            <Box mt={2} position="relative" display="inline-block">
              <Image
                src={imagePreview}
                alt="Modal Preview"
                maxH="200px"
                borderRadius="md"
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={removeImage}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                aria-label="Remove modal image"
              />
            </Box>
          )}
        </FormControl>
      )}

      {mediaType === 'video' && (
        <FormControl isRequired>
          <FormLabel>Choose Video File *</FormLabel>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            p={1}
            isInvalid={!videoPreview}
          />
          {!videoPreview && (
            <Text fontSize="sm" color="red.500">
              Please select a video file
            </Text>
          )}
          {videoPreview && (
            <Box mt={2} position="relative" display="inline-block">
              <video
                src={videoPreview}
                controls
                style={{ maxHeight: '200px', borderRadius: '8px' }}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={removeVideo}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                aria-label="Remove modal video"
              />
            </Box>
          )}
        </FormControl>
      )}

      <FormControl>
        <FormLabel>Time Delay Before Modal Shows (seconds)</FormLabel>
        <Input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={formData.content?.showDelay || 0}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              showDelay: parseFloat(e.target.value) || 0
            }
          }))}
          placeholder="0 = immediately"
        />
        <Text fontSize="sm" color="gray.600">
          0 = immediately, 0-10 seconds delay
        </Text>
      </FormControl>

      <FormControl>
        <FormLabel>Modal Behavior</FormLabel>
        <Select
          value={formData.content?.behavior || 'once_per_session'}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              behavior: e.target.value
            }
          }))}
        >
          <option value="once_per_session">Show once per session</option>
          <option value="always">Show every time</option>
          <option value="once_per_day">Show once per day</option>
          <option value="once_per_week">Show once per week</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Modal Size</FormLabel>
        <Select
          value={formData.content?.size || 'medium'}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              size: e.target.value
            }
          }))}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="fullscreen">Fullscreen</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Show Close Button</FormLabel>
        <Switch
          isChecked={formData.content?.showCloseButton !== false}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              showCloseButton: e.target.checked
            }
          }))}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Allow Click Outside to Close</FormLabel>
        <Switch
          isChecked={formData.content?.allowClickOutside !== false}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              allowClickOutside: e.target.checked
            }
          }))}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Auto-close after (seconds)</FormLabel>
        <Input
          type="number"
          min="0"
          max="300"
          value={formData.content?.autoCloseDelay || 0}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              autoCloseDelay: parseInt(e.target.value) || 0
            }
          }))}
          placeholder="0 = no auto-close"
        />
        <Text fontSize="sm" color="gray.600">
          Set to 0 to disable auto-close
        </Text>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Publish Modal
        </FormLabel>
        <Switch
          isChecked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
        />
      </FormControl>
    </VStack>
  );
};

export default PopoutModalPost; 