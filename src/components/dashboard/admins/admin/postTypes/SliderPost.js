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
  HStack,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

const SliderPost = ({ formData, setFormData }) => {
  const [slides, setSlides] = useState(formData.content?.slides || []);
  const toast = useToast();

  useEffect(() => {
    setSlides(formData.content?.slides || []);
  }, [formData.content?.slides]);

  const addSlide = () => {
    const newSlide = {
      id: Date.now() + Math.random(),
      image: null,
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      backgroundColor: '#43b02a',
      showBackgroundColor: false,
      titleTextColor: '#ffffff',
      showTitleTextColor: false,
      subtitleTextColor: '#ffffff',
      showSubtitleTextColor: false
    };
    
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        slides: updatedSlides
      }
    }));
  };

  const removeSlide = (slideIndex) => {
    const updatedSlides = slides.filter((_, index) => index !== slideIndex);
    setSlides(updatedSlides);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        slides: updatedSlides
      }
    }));
  };

  const updateSlide = (slideIndex, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      [field]: value
    };
    
    setSlides(updatedSlides);
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        slides: updatedSlides
      }
    }));
  };

  const handleImageFileChange = (e, slideIndex) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlide(slideIndex, 'image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImageFromSlide = (slideIndex) => {
    updateSlide(slideIndex, 'image', null);
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Slider Title (Optional)</FormLabel>
        <Input
          value={formData.content?.sliderTitle || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              sliderTitle: e.target.value
            }
          }))}
          placeholder="Enter slider title..."
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Show Title Background Color
        </FormLabel>
        <Switch
          isChecked={formData.content?.showTitleBackgroundColor || false}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              showTitleBackgroundColor: e.target.checked
            }
          }))}
        />
      </FormControl>

      {formData.content?.showTitleBackgroundColor && (
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
      )}

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Show Background Color
        </FormLabel>
        <Switch
          isChecked={formData.content?.showBackgroundColor || false}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              showBackgroundColor: e.target.checked
            }
          }))}
        />
      </FormControl>

      {formData.content?.showBackgroundColor && (
        <FormControl>
          <FormLabel>Background Color</FormLabel>
          <Input
            type="color"
            value={formData.content?.backgroundColor || '#43b02a'}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: {
                ...prev.content,
                backgroundColor: e.target.value
              }
            }))}
            w="100px"
          />
        </FormControl>
      )}

      <FormControl>
        <FormLabel>Images Per Slide</FormLabel>
        <Input
          type="number"
          min={1}
          max={(formData.content?.slides && formData.content.slides.length) || 1}
          value={formData.content?.imagesPerSlide || 1}
          onChange={(e) => {
            const max = (formData.content?.slides && formData.content.slides.length) || 1;
            let value = Math.max(1, Math.min(max, Number(e.target.value)));
            setFormData(prev => ({
              ...prev,
              content: {
                ...prev.content,
                imagesPerSlide: value
              }
            }));
          }}
          w="80px"
        />
        <Text fontSize="sm" color="gray.500">
          Max: {(formData.content?.slides && formData.content.slides.length) || 1}
        </Text>
      </FormControl>

      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontSize="lg" fontWeight="bold">
            Slides ({slides.length})
          </Text>
          <Button
            leftIcon={<AddIcon />}
            onClick={addSlide}
            colorScheme="blue"
            size="sm"
          >
            Add Slide
          </Button>
        </HStack>

        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            mb={4}
          >
            <HStack justify="space-between" mb={3}>
              <Text fontWeight="bold">Slide {index + 1}</Text>
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => removeSlide(index)}
                size="sm"
                colorScheme="red"
                aria-label="Remove slide"
              />
            </HStack>

            <VStack spacing={3} align="stretch">
              <FormControl>
                <FormLabel>Slide Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, index)}
                  p={1}
                />
                {slide.image && (
                  <Box mt={2} position="relative" display="inline-block">
                    <Image
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Remove image"
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top="2"
                      right="2"
                      onClick={() => removeImageFromSlide(index)}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Slide Title</FormLabel>
                <Input
                  value={slide.title || ''}
                  onChange={(e) => updateSlide(index, 'title', e.target.value)}
                  placeholder="Enter slide title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Slide Subtitle</FormLabel>
                <Input
                  value={slide.subtitle || ''}
                  onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                  placeholder="Enter slide subtitle"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Show Title Text Color
                </FormLabel>
                <Switch
                  isChecked={slide.showTitleTextColor || false}
                  onChange={(e) => updateSlide(index, 'showTitleTextColor', e.target.checked)}
                />
              </FormControl>

              {slide.showTitleTextColor && (
                <FormControl>
                  <FormLabel>Title Text Color</FormLabel>
                  <Input
                    type="color"
                    value={slide.titleTextColor || '#ffffff'}
                    onChange={(e) => updateSlide(index, 'titleTextColor', e.target.value)}
                    w="100px"
                  />
                </FormControl>
              )}

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Show Subtitle Text Color
                </FormLabel>
                <Switch
                  isChecked={slide.showSubtitleTextColor || false}
                  onChange={(e) => updateSlide(index, 'showSubtitleTextColor', e.target.checked)}
                />
              </FormControl>

              {slide.showSubtitleTextColor && (
                <FormControl>
                  <FormLabel>Subtitle Text Color</FormLabel>
                  <Input
                    type="color"
                    value={slide.subtitleTextColor || '#ffffff'}
                    onChange={(e) => updateSlide(index, 'subtitleTextColor', e.target.value)}
                    w="100px"
                  />
                </FormControl>
              )}

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Show Slide Background Color
                </FormLabel>
                <Switch
                  isChecked={slide.showBackgroundColor || false}
                  onChange={(e) => updateSlide(index, 'showBackgroundColor', e.target.checked)}
                />
              </FormControl>

              {slide.showBackgroundColor && (
                <FormControl>
                  <FormLabel>Slide Background Color</FormLabel>
                  <Input
                    type="color"
                    value={slide.backgroundColor || '#43b02a'}
                    onChange={(e) => updateSlide(index, 'backgroundColor', e.target.value)}
                    w="100px"
                  />
                </FormControl>
              )}
            </VStack>
          </Box>
        ))}
      </Box>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">
          Publish Slider
        </FormLabel>
        <Switch
          isChecked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
        />
      </FormControl>
    </VStack>
  );
};

export default SliderPost; 