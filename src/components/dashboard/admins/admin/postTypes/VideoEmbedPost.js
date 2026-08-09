import React, { useState, useEffect } from 'react';
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
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const VideoEmbedPost = ({ formData, setFormData, validationErrors = {} }) => {
  // Initialize videoPreview based on existing data
  const getInitialVideoPreview = () => {
    if (formData.content?.uploadType === 'file' && formData.content?.videoFile) {
      return formData.content.videoFile;
    } else if (formData.content?.uploadType === 'link' && formData.content?.videoUrl) {
      return formData.content.videoUrl;
    } else if (formData.content?.videoFile) {
      // Fallback: if no uploadType specified but videoFile exists
      return formData.content.videoFile;
    } else if (formData.content?.videoUrl) {
      // Fallback: if no uploadType specified but videoUrl exists
      return formData.content.videoUrl;
    }
    return null;
  };

  const [videoPreview, setVideoPreview] = useState(getInitialVideoPreview());
  const [uploadType, setUploadType] = useState(formData.content?.uploadType || 'link');
  const toast = useToast();

  // Update videoPreview when formData changes (for edit mode)
  useEffect(() => {
    const newPreview = getInitialVideoPreview();
    if (newPreview !== videoPreview) {
      setVideoPreview(newPreview);
    }
  }, [formData.content?.videoUrl, formData.content?.videoFile, formData.content?.uploadType]);

  // Update uploadType when formData changes (for edit mode)
  useEffect(() => {
    if (formData.content?.uploadType) {
      setUploadType(formData.content.uploadType);
    }
  }, [formData.content?.uploadType]);

  const handleUploadTypeChange = (value) => {
    setUploadType(value);
    // Clear the other type's data when switching
    if (value === 'link') {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          uploadType: 'link',
          videoFile: null,
          videoFileName: null
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          uploadType: 'file',
          videoUrl: null
        }
      }));
    }
    setVideoPreview(null);
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Video file must be smaller than 50MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            videoFile: e.target.result,
            videoFileName: file.name,
            uploadType: 'file'
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoLink = (event) => {
    const url = event.target.value;
    setVideoPreview(url);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        videoUrl: url,
        uploadType: 'link'
      }
    }));
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        videoUrl: null,
        videoFile: null,
        videoFileName: null
      }
    }));
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!validationErrors.name}>
        <FormLabel>Video Title</FormLabel>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter video title"
        />
        {validationErrors.name && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {validationErrors.name}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Upload Type</FormLabel>
        <RadioGroup value={uploadType} onChange={handleUploadTypeChange}>
          <Stack direction="row">
            <Radio value="link">Video Link (YouTube/Vimeo)</Radio>
            <Radio value="file">Upload Video File</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {uploadType === 'link' ? (
        <FormControl isInvalid={!!validationErrors.videoUrl}>
          <FormLabel>Video Link</FormLabel>
          <Input
            value={formData.content?.videoUrl || ''}
            onChange={handleVideoLink}
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
            type="url"
          />
          {validationErrors.videoUrl && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {validationErrors.videoUrl}
            </Text>
          )}
          <Text fontSize="sm" color="gray.600" mt={1}>
            Supports YouTube and Vimeo links
          </Text>
          {videoPreview && uploadType === 'link' && (
            <Text fontSize="sm" color="blue.600" mt={1}>
              💡 A video link is already set. You can enter a new link to replace it.
            </Text>
          )}
        </FormControl>
      ) : (
        <FormControl isInvalid={!!validationErrors.videoUrl}>
          <FormLabel>Upload Video File</FormLabel>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            p={1}
          />
          {validationErrors.videoUrl && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {validationErrors.videoUrl}
            </Text>
          )}
          <Text fontSize="sm" color="gray.600" mt={1}>
            Upload any video file format (max 50MB)
          </Text>
          {videoPreview && uploadType === 'file' && (
            <Text fontSize="sm" color="blue.600" mt={1}>
              💡 A video is already uploaded. You can upload a new file to replace it.
            </Text>
          )}
        </FormControl>
      )}

      {videoPreview && (
        <Box mt={2}>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Video Preview:</Text>
          {uploadType === 'link' ? (
            <Box
              position="relative"
              paddingBottom="56.25%"
              height="0"
              overflow="hidden"
              borderRadius="md"
            >
              <iframe
                src={getEmbedUrl(videoPreview)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0
                }}
                allowFullScreen
                title="Video preview"
              />
            </Box>
          ) : (
            <Box position="relative" display="inline-block">
              <video
                src={videoPreview}
                controls
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={removeVideo}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme="red"
                aria-label="Remove video"
              />
            </Box>
          )}
        </Box>
      )}

      <FormControl>
        <FormLabel>Video Caption (Optional)</FormLabel>
        <Textarea
          value={formData.content?.caption || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              caption: e.target.value
            }
          }))}
          placeholder="Enter video caption..."
          rows={3}
          resize="vertical"
        />
      </FormControl>

      {/* Styling Options */}
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Customize Title Styling
        </FormLabel>
        <Switch
          isChecked={formData.content?.showCustomStyling || false}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              showCustomStyling: e.target.checked
            }
          }))}
        />
      </FormControl>

      {formData.content?.showCustomStyling && (
        <>
          <FormControl>
            <FormLabel>Title Background Color</FormLabel>
            <Input
              type="color"
              value={formData.content?.titleBackgroundColor || '#e9f5e1'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  titleBackgroundColor: e.target.value
                }
              }))}
              w="100px"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Title Text Color</FormLabel>
            <Input
              type="color"
              value={formData.content?.titleTextColor || '#000000'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                content: {
                  ...prev.content,
                  titleTextColor: e.target.value
                }
              }))}
              w="100px"
            />
          </FormControl>
        </>
      )}

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Publish Video
        </FormLabel>
        <Switch
          isChecked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
        />
      </FormControl>
    </VStack>
  );
};

export default VideoEmbedPost; 