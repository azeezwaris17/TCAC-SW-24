import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuList,
  Text,
  Center,
  Image,
  IconButton,
  VStack,
  HStack,
  Badge,
  Divider,
  Grid,
  GridItem,
  useDisclosure as useImageDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaDownload, FaSync, FaEye, FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Empty } from "antd";
import "antd/dist/reset.css";
import {
  fetchAdmins,
  approveAdmin,
  rejectAdmin,
  selectAdmins,
  selectLoading,
  selectError,
  selectAdminById,
} from "../../../store/slices/adminActionsSlice";
import * as XLSX from "xlsx";

const RegisteredAdmins = () => {
  const dispatch = useDispatch();
  const admins = useSelector(selectAdmins) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newAdminFunction, setNewAdminFunction] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const { 
    isOpen: isImageOpen, 
    onOpen: onImageOpen, 
    onClose: onImageClose 
  } = useImageDisclosure();

  const toast = useToast();

  const adminsPerPage = 10; // Number of admins to show per page
  const pageCount = Math.ceil(admins.length / adminsPerPage); // Calculate total pages

  useEffect(() => {
    console.log("Fetching admins...");
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleViewMore = (admin) => {
    setSelectedAdmin(admin);
    onOpen();
  };

  const handleApprove = async (id) => {
    try {
      console.log("Approving admin with ID:", id);
      await dispatch(approveAdmin(id)).unwrap();
      toast({
        title: "Success",
        description: "Admin approved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Approval error:", error);
    }
    onClose();
  };

  const handleReject = async (id) => {
    try {
      console.log("Rejecting admin with ID:", id);
      await dispatch(rejectAdmin(id)).unwrap();
      toast({
        title: "Success",
        description: "Admin rejected successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Rejection error:", error);
    }
    onClose();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleExportToExcel = () => {
    // console.log("Exporting to Excel...");

    // Define keys to exclude
    const excludedKeys = ["_id", "password", "__v", "updatedAt"];

    // Filter and map admin data
    const filteredAdmins = admins.map((admin) => {
      return Object.entries(admin)
        .filter(([key, value]) => !excludedKeys.includes(key) && value) // Exclude specified keys and ensure values are not empty
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    });

    // Create a worksheet from the filtered user data
    const worksheet = XLSX.utils.json_to_sheet(filteredAdmins);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");

    // Export the file
    XLSX.writeFile(workbook, "admins_data.xlsx");
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < pageCount - 1) return prev + 1;
      if (direction === "prev" && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleUpdateTable = () => {
    console.log("Updating table...");
    dispatch(fetchAdmins());
  };

  const handleUpdateAdminFunction = (newFunction) => {
    setNewAdminFunction(newFunction);
    setIsUpdateModalOpen(true);
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageZoom(1);
    onImageOpen();
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
  };

  const confirmUpdateAdminFunction = async () => {
    if (selectedAdmin && newAdminFunction) {
      try {
        console.log("Updating admin function...");
        const response = await fetch(
          `/api/admin-actions/${selectedAdmin._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "updateFunction",
              adminFunction: newAdminFunction,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Success",
            description: "Admin function updated successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          dispatch(fetchAdmins()); // Refresh the list
          onClose(); // Close the modal
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsUpdateModalOpen(false);
  };

  // Filtered admins based on search term
  const filteredAdmins = admins.filter(
    (admin) => {
      if (!admin) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const firstName = admin.firstName ? admin.firstName.toLowerCase() : '';
      const lastName = admin.lastName ? admin.lastName.toLowerCase() : '';
      const fullName = `${firstName} ${lastName}`.trim();
      const fullNameReversed = `${lastName} ${firstName}`.trim();
      
      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        fullName.includes(searchLower) ||
        fullNameReversed.includes(searchLower) ||
        (admin.email && admin.email.toLowerCase().includes(searchLower)) ||
        (admin.adminFunction && admin.adminFunction.toLowerCase().includes(searchLower)) ||
        (admin.adminID && admin.adminID.toLowerCase().includes(searchLower))
      );
    }
  );

  // Admins to display on the current page
  const currentAdmins = filteredAdmins.slice(
    currentPage * adminsPerPage,
    (currentPage + 1) * adminsPerPage
  );

  return (
    <Box>
      {/* search, update and download component */}
      <Flex mb={8} justify="space-between" align="center">
        {/* search input */}
        <Flex align="center">
          <Input
            placeholder="Search admins..."
            value={searchTerm}
            onChange={handleSearch}
            size="sm"
            width="200px"
          />
        </Flex>

        {/* update and download buttons */}
        <Flex align="center" gap={4}>
          <Button
            size="sm"
            leftIcon={<FaSync />}
            ml={2}
            onClick={handleUpdateTable}
          >
            Update Table
          </Button>

          <Button
            size="sm"
            leftIcon={<FaDownload />}
            onClick={handleExportToExcel}
          >
            Download
          </Button>
        </Flex>
      </Flex>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Function</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={6}>
                  <Center>
                    <Text>Loading...</Text>
                  </Center>
                </Td>
              </Tr>
            ) : currentAdmins.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Center>
                    <Empty 
                      description={
                        <span style={{ color: "#A0AEC0", fontWeight: 600 }}>
                          {searchTerm ? `No admins found for "${searchTerm}"` : "No data"}
                        </span>
                      }
                    />
                  </Center>
                </Td>
              </Tr>
            ) : (
              currentAdmins.map((admin, index) => (
                <Tr key={admin._id}>
                  <Td>{index + 1 + currentPage * adminsPerPage}</Td>
                  <Td>{admin.firstName}</Td>
                  <Td>{admin.lastName}</Td>
                  <Td>{admin.email}</Td>
                  <Td>{admin.adminFunction}</Td>
                  <Td>
                    <Button size="sm" onClick={() => handleViewMore(admin)}>
                      View More
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Flex mt={8} justify="center" align="center">
        <Button
          onClick={() => handlePageChange("prev")}
          isDisabled={currentPage === 0}
          leftIcon={<IoIosArrowBack />}
        >
          Previous
        </Button>
        <Box mx={4}>
          Page {currentPage + 1} of {pageCount}
        </Box>
        <Button
          onClick={() => handlePageChange("next")}
          isDisabled={currentPage === pageCount - 1}
          rightIcon={<IoIosArrowForward />}
        >
          Next
        </Button>
      </Flex>

      {/* View More Modal */}
      {selectedAdmin && (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent 
            maxW="90vw" 
            maxH="90vh" 
            bg="white" 
            borderRadius="xl"
            boxShadow="2xl"
            overflow="hidden"
          >
            <ModalHeader 
              bg="gray.50" 
              borderBottom="1px solid" 
              borderColor="gray.200"
              py={6}
            >
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Admin Details
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {selectedAdmin.firstName} {selectedAdmin.lastName}
                  </Text>
                </VStack>
                <Badge 
                  colorScheme={
                    selectedAdmin.registrationStatus === "approved" ? "green" : 
                    selectedAdmin.registrationStatus === "rejected" ? "red" : "yellow"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {selectedAdmin.registrationStatus?.toUpperCase()}
                </Badge>
              </Flex>
            </ModalHeader>
            <ModalCloseButton 
              size="lg" 
              top={4} 
              right={4}
              bg="white"
              borderRadius="full"
              boxShadow="md"
            />
            
            <ModalBody p={0} maxH="70vh" overflowY="auto">
              <Grid templateColumns="repeat(2, 1fr)" gap={8} p={8}>
                {/* Left Column - Admin Information */}
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                        Personal Information
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">First Name:</Text>
                          <Text>{selectedAdmin.firstName}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Last Name:</Text>
                          <Text>{selectedAdmin.lastName}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Email:</Text>
                          <Text color="blue.600">{selectedAdmin.email}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Phone:</Text>
                          <Text>{selectedAdmin.phoneNumber}</Text>
                        </Flex>
                        {selectedAdmin.gender && (
                          <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="semibold" color="gray.700">Gender:</Text>
                            <Text textTransform="capitalize">{selectedAdmin.gender}</Text>
                          </Flex>
                        )}
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                        Admin Information
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Admin Function:</Text>
                          <Badge colorScheme="blue" px={2} py={1}>
                            {selectedAdmin.adminFunction?.replace(/_/g, ' ')}
                          </Badge>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Admin ID:</Text>
                          <Text fontFamily="mono" fontSize="sm">{selectedAdmin.adminID}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Created:</Text>
                          <Text>{new Date(selectedAdmin.createdAt).toLocaleDateString()}</Text>
                        </Flex>
                      </VStack>
                    </Box>
                  </VStack>
                </GridItem>

                {/* Right Column - Images and Documents */}
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    {/* Profile Picture */}
                    {selectedAdmin.profilePicture && (
                      <Box>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                          Profile Picture
                        </Text>
                        <Box 
                          position="relative" 
                          borderRadius="lg" 
                          overflow="hidden"
                          boxShadow="md"
                          cursor="pointer"
                          onClick={() => handleViewImage(selectedAdmin.profilePicture)}
                          _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                        >
                          <Image
                            src={selectedAdmin.profilePicture}
                            alt="Profile Picture"
                            w="100%"
                            h="200px"
                            objectFit="cover"
                          />
                          <Box
                            position="absolute"
                            top={2}
                            right={2}
                            bg="blackAlpha.700"
                            color="white"
                            p={2}
                            borderRadius="full"
                          >
                            <FaEye size={16} />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Receipt */}
                    {selectedAdmin.receiptUrl && (
                      <Box>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                          Receipt Document
                        </Text>
                        <Box 
                          position="relative" 
                          borderRadius="lg" 
                          overflow="hidden"
                          boxShadow="md"
                          cursor="pointer"
                          onClick={() => handleViewImage(selectedAdmin.receiptUrl)}
                          _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                        >
                          <Image
                            src={selectedAdmin.receiptUrl}
                            alt="Receipt"
                            w="100%"
                            h="200px"
                            objectFit="cover"
                          />
                          <Box
                            position="absolute"
                            top={2}
                            right={2}
                            bg="blackAlpha.700"
                            color="white"
                            p={2}
                            borderRadius="full"
                          >
                            <FaEye size={16} />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Additional Fields */}
                    {Object.entries(selectedAdmin)
                      .filter(([key, value]) => 
                        !["_id", "password", "updatedAt", "__v", "firstName", "lastName", 
                          "email", "phoneNumber", "gender", "adminFunction", "adminID", 
                          "createdAt", "profilePicture", "receiptUrl"].includes(key) && value
                      )
                      .map(([key, value]) => (
                        <Box key={key}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                          </Text>
                          <Box p={3} bg="gray.50" borderRadius="md">
                            <Text>{value}</Text>
                          </Box>
                        </Box>
                      ))}
                  </VStack>
                </GridItem>
              </Grid>
            </ModalBody>
            
            <ModalFooter 
              bg="gray.50" 
              borderTop="1px solid" 
              borderColor="gray.200"
              py={6}
            >
              <Flex align="center" justify="space-between" w="100%">
                <Menu>
                  <MenuButton as={Button} colorScheme="blue" size="lg">
                    Update Function
                  </MenuButton>
                  <MenuList>
                    {["admin", "reg_team_lead", "health_team_lead"].map((func) => (
                        <MenuItem
                          key={func}
                          onClick={() => handleUpdateAdminFunction(func)}
                        >
                        {func.replace(/_/g, ' ')}
                        </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                <HStack spacing={4}>
                  <Button
                    colorScheme="green"
                    size="lg"
                    onClick={() => handleApprove(selectedAdmin._id)}
                    isDisabled={selectedAdmin.registrationStatus === "approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={() => handleReject(selectedAdmin._id)}
                    isDisabled={selectedAdmin.registrationStatus === "rejected"}
                  >
                    Reject
                  </Button>
                </HStack>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Image Viewer Modal */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size="6xl">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
        <ModalContent 
          maxW="95vw" 
          maxH="95vh" 
          bg="transparent" 
          boxShadow="none"
          overflow="hidden"
        >
          <ModalCloseButton 
            size="lg" 
            top={4} 
            right={4}
            bg="white"
            color="gray.800"
            borderRadius="full"
            boxShadow="lg"
            zIndex={10}
          />
          
          <ModalBody p={0} position="relative">
            <Box
              position="relative"
              w="100%"
              h="90vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="blackAlpha.900"
            >
              <Image
                src={selectedImage}
                alt="Full size image"
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                transform={`scale(${imageZoom})`}
                transition="transform 0.3s ease"
              />
              
              {/* Zoom Controls */}
              <HStack
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                bg="blackAlpha.700"
                color="white"
                p={3}
                borderRadius="full"
                spacing={2}
                backdropFilter="blur(10px)"
              >
                <IconButton
                  icon={<FaCompress />}
                  onClick={handleZoomOut}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  aria-label="Zoom out"
                />
                <Text fontSize="sm" fontWeight="bold" minW="60px" textAlign="center">
                  {Math.round(imageZoom * 100)}%
                </Text>
                <IconButton
                  icon={<FaExpand />}
                  onClick={handleZoomIn}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  aria-label="Zoom in"
                />
                <IconButton
                  icon={<FaTimes />}
                  onClick={handleResetZoom}
                  size="sm"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  aria-label="Reset zoom"
                />
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Update Admin Function Confirmation Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Admin Function Update</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Are you sure you want to update the admin function to &quot;
              {newAdminFunction}&quot;?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={confirmUpdateAdminFunction}
            >
              Yes
            </Button>
            <Button
              colorScheme="red"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisteredAdmins;
