import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Select,
  Image,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaCamera, FaUpload } from "react-icons/fa";

const PersonalInformationForm = ({ role, values, onValuesChange, onNext }) => {
  // State for form input values
  const [inputValues, setInputValues] = useState({
    firstName: values?.firstName || "",
    lastName: values?.lastName || "",
    email: values?.email || "",
    phoneNumber: values?.phoneNumber || "",
    gender: values?.gender || "",
    profilePicture: values?.profilePicture || "",
  });
  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  // State for image preview
  const [imagePreview, setImagePreview] = useState(values?.profilePicture || "");
  const [isUploading, setIsUploading] = useState(false);
  // Toast hook for showing messages
  const toast = useToast();

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setImagePreview(result.url);
      setInputValues({ ...inputValues, profilePicture: result.url });
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to validate form input
  const validateForm = () => {
    const validationErrors = {};
    const { firstName, lastName, email, phoneNumber, gender, profilePicture } = inputValues;

    if (!firstName) validationErrors.firstName = "First name is required";
    if (!lastName) validationErrors.lastName = "Last name is required";
    if (!email) validationErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      validationErrors.email = "Invalid email address";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]+$/.test(phoneNumber))
      validationErrors.phoneNumber = "Phone number must be digits only";
    else if (phoneNumber.length < 10)
      validationErrors.phoneNumber = "Phone number must be at least 10 digits";
    else if (phoneNumber.length > 15)
      validationErrors.phoneNumber = "Phone number must be at most 15 digits";
    if (!gender) validationErrors.gender = "Gender is required";
    if (!profilePicture) validationErrors.profilePicture = "Profile picture is required";

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Show errors using toast
      Object.values(formErrors).forEach((error) => {
        toast({
          title: "Validation Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }

    const updatedValues = { ...values, role, ...inputValues };
    onValuesChange(updatedValues);
    onNext(updatedValues);

    // Show success message using toast
    toast({
      title: "Success",
      description: "Personal information updated successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* First Name Field */}
        <FormControl id="firstName" isInvalid={!!formErrors.firstName}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            value={inputValues.firstName}
            onChange={(e) =>
              setInputValues({ ...inputValues, firstName: e.target.value })
            }
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Last Name Field */}
        <FormControl id="lastName" isInvalid={!!formErrors.lastName}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            value={inputValues.lastName}
            onChange={(e) =>
              setInputValues({ ...inputValues, lastName: e.target.value })
            }
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Email Field */}
        <FormControl id="email" isInvalid={!!formErrors.email}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={inputValues.email}
            onChange={(e) =>
              setInputValues({ ...inputValues, email: e.target.value })
            }
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Phone Number Field */}
        <FormControl id="phoneNumber" isInvalid={!!formErrors.phoneNumber}>
          <FormLabel>
            Phone Number{" "}
            <Box as="span" fontSize="sm" color="gray.500">
              (WhatsApp enabled)
            </Box>
          </FormLabel>
          <Input
            type="tel"
            value={inputValues.phoneNumber}
            onChange={(e) =>
              setInputValues({ ...inputValues, phoneNumber: e.target.value })
            }
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Gender Field */}
        <FormControl id="gender" isInvalid={!!formErrors.gender}>
          <FormLabel>Gender</FormLabel>
          <Select
            value={inputValues.gender}
            onChange={(e) =>
              setInputValues({ ...inputValues, gender: e.target.value })
            }
            placeholder="Select gender"
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </FormControl>

        {/* Profile Picture Field */}
        <FormControl id="profilePicture" isInvalid={!!formErrors.profilePicture}>
          <FormLabel>Profile Picture</FormLabel>
          <VStack spacing={3} align="flex-start">
            {imagePreview ? (
              <Box position="relative">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  boxSize="120px"
                  borderRadius="md"
                  objectFit="cover"
                  border="2px solid"
                  borderColor="gray.200"
                />
                <Button
                  size="sm"
                  colorScheme="blue"
                  position="absolute"
                  bottom="2"
                  right="2"
                  onClick={() => document.getElementById('profilePictureInput').click()}
                  disabled={isUploading}
                >
                  <Icon as={FaCamera} />
                </Button>
              </Box>
            ) : (
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={6}
                textAlign="center"
                cursor="pointer"
                onClick={() => document.getElementById('profilePictureInput').click()}
                _hover={{ borderColor: "green.400" }}
              >
                <Icon as={FaUpload} boxSize={8} color="gray.400" mb={2} />
                <Text fontSize="sm" color="gray.500">
                  {isUploading ? "Uploading..." : "Click to upload profile picture"}
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  JPG, PNG (Max 5MB)
                </Text>
              </Box>
            )}
            <input
              id="profilePictureInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
          </VStack>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" colorScheme="green" size="lg" w="full" mt={4}>
          Next
        </Button>
      </Stack>
    </form>
  );
};

export default PersonalInformationForm;
