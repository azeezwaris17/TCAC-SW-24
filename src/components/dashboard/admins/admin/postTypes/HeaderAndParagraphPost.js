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
  Textarea,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const HeaderAndParagraphPost = ({ formData, setFormData, validationErrors = {} }) => {
  const [imagePreview, setImagePreview] = useState(formData.content?.backgroundImage || null);
  const toast = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            backgroundImage: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        backgroundImage: null
      }
    }));
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!validationErrors.heroTitle}>
        <FormLabel>Header</FormLabel>
        <Input
          value={formData.content?.title || ''}
          onChange={(e) => {
            const heroTitle = e.target.value;
            setFormData(prev => ({
              ...prev,
              name: heroTitle,
              content: {
                ...prev.content,
                title: heroTitle
              }
            }));
          }}
          placeholder="Enter header title"
          fontSize="3xl"
          fontWeight="bold"
          color="black"
        />
        {validationErrors.heroTitle && (
          <Text color="red.500" fontSize="sm" mt={1}>
            {validationErrors.heroTitle}
          </Text>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Paragraph</FormLabel>
        <Textarea
          value={formData.content?.subtitle || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              subtitle: e.target.value
            }
          }))}
          placeholder="Enter paragraph text..."
          rows={3}
          resize="vertical"
          fontSize="18px"
          color="#333333"
          fontWeight="normal"
          fontFamily="Montserrat, Roboto, sans-serif"
          mb="32px"
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Publish Header and Paragraph
        </FormLabel>
        <Switch
          isChecked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
        />
      </FormControl>
    </VStack>
  );
};

export default HeaderAndParagraphPost; 