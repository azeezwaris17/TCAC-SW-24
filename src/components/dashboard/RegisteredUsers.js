import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import {
  Text,
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
  Center,
  Image,
  IconButton,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  useDisclosure as useImageDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaDownload, FaSync, FaEye, FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Empty } from "antd";
import "antd/dist/reset.css";
import {
  fetchUsers,
  approveUser,
  rejectUser,
  selectUsers,
  selectLoading,
  selectError,
} from "../../store/slices/userActionsSlice";
import * as XLSX from "xlsx";

const RegisteredUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const { 
    isOpen: isImageOpen, 
    onOpen: onImageOpen, 
    onClose: onImageClose 
  } = useImageDisclosure();

  const toast = useToast();

  const usersPerPage = 10; // Number of users to show per page
  const pageCount = Math.ceil(users.length / usersPerPage); // Calculate total pages

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleViewMore = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(approveUser(id)).unwrap();
      toast({
        title: "Success",
        description: "User approved successfully!",
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
      await dispatch(rejectUser(id)).unwrap();
      toast({
        title: "Success",
        description: "User rejected successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Rejection error:", error);
    }
    onClose();
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/user-actions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        dispatch(fetchUsers()); // Refresh the user list
        setDeleteModal(false); // Close the delete modal
        onClose(); // Close the user details modal
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleExportToExcel = () => {
    const excludedKeys = ["_id", "password", "__v", "updatedAt"];
    const filteredUsers = users.map((user) => {
      return Object.entries(user)
        .filter(([key, value]) => !excludedKeys.includes(key) && value)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < pageCount - 1) return prev + 1;
      if (direction === "prev" && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleUpdateTable = () => {
    dispatch(fetchUsers());
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

  const filteredUsers = users.filter(
    (user) => {
      if (!user) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const firstName = user.firstName ? user.firstName.toLowerCase() : '';
      const lastName = user.lastName ? user.lastName.toLowerCase() : '';
      const fullName = `${firstName} ${lastName}`.trim();
      const fullNameReversed = `${lastName} ${firstName}`.trim();
      
      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        fullName.includes(searchLower) ||
        fullNameReversed.includes(searchLower) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.userCategory && user.userCategory.toLowerCase().includes(searchLower)) ||
        (user.userID && user.userID.toLowerCase().includes(searchLower))
      );
    }
  );

  const currentUsers = filteredUsers.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <Box>
      <Flex mb={8} justify="space-between" align="center">
        <Flex align="center">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            size="sm"
            width="200px"
          />
        </Flex>

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
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Category</Th>
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
            ) : currentUsers.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Center>
                    <Empty 
                      description={
                        <span style={{ color: "#A0AEC0", fontWeight: 600 }}>
                          {searchTerm ? `No users found for "${searchTerm}"` : "No data"}
                        </span>
                      }
                    />
                  </Center>
                </Td>
              </Tr>
            ) : (
              currentUsers.map((user, index) => (
                <Tr key={user._id}>
                  <Td>{index + 1 + currentPage * usersPerPage}</Td>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.userCategory}</Td>
                  <Td>
                    <Button size="sm" onClick={() => handleViewMore(user)}>
                      View More
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

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

      {selectedUser && (
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
                    User Details
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                </VStack>
                <Badge 
                  colorScheme={
                    selectedUser.registrationStatus === "approved" ? "green" : 
                    selectedUser.registrationStatus === "rejected" ? "red" : "yellow"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {selectedUser.registrationStatus?.toUpperCase()}
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
                {/* Left Column - User Information */}
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                        Personal Information
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">First Name:</Text>
                          <Text>{selectedUser.firstName}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Last Name:</Text>
                          <Text>{selectedUser.lastName}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Email:</Text>
                          <Text color="blue.600">{selectedUser.email}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Phone:</Text>
                          <Text>{selectedUser.phoneNumber}</Text>
                        </Flex>
                        {selectedUser.gender && (
                          <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="semibold" color="gray.700">Gender:</Text>
                            <Text textTransform="capitalize">{selectedUser.gender}</Text>
                          </Flex>
                        )}
                        {selectedUser.userCategory && (
                          <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="semibold" color="gray.700">Category:</Text>
                            <Badge colorScheme="purple" px={2} py={1}>
                              {selectedUser.userCategory}
                            </Badge>
                          </Flex>
                        )}
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                        Registration Information
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">User ID:</Text>
                          <Text fontFamily="mono" fontSize="sm">{selectedUser.userID}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Created:</Text>
                          <Text>{new Date(selectedUser.createdAt).toLocaleDateString()}</Text>
                        </Flex>
                        {selectedUser.campType && (
                          <Flex justify="space-between" p={3} bg="gray.50" borderRadius="md">
                            <Text fontWeight="semibold" color="gray.700">Camp Type:</Text>
                            <Text>{selectedUser.campType}</Text>
                          </Flex>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </GridItem>

                {/* Right Column - Images and Documents */}
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    {/* Profile Picture */}
                    {selectedUser.profilePicture && (
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
                          onClick={() => handleViewImage(selectedUser.profilePicture)}
                          _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                        >
                          <Image
                            src={selectedUser.profilePicture}
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
                    {selectedUser.receiptUrl && (
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
                          onClick={() => handleViewImage(selectedUser.receiptUrl)}
                          _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                        >
                          <Image
                            src={selectedUser.receiptUrl}
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
                    {Object.entries(selectedUser)
                      .filter(([key, value]) => 
                        !["_id", "password", "updatedAt", "__v", "firstName", "lastName", 
                          "email", "phoneNumber", "gender", "userCategory", "userID", 
                          "createdAt", "campType", "profilePicture", "receiptUrl"].includes(key) && value
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
              <HStack spacing={4} justify="flex-end" w="100%">
              <Button
                colorScheme="green"
                  size="lg"
                onClick={() => handleApprove(selectedUser._id)}
                isDisabled={selectedUser.registrationStatus === "approved"}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                  size="lg"
                onClick={() => handleReject(selectedUser._id)}
                isDisabled={selectedUser.registrationStatus === "rejected"}
              >
                Reject
              </Button>
              <Button
                colorScheme="red"
                  size="lg"
                onClick={() => setDeleteModal(true)}
              >
                Delete
              </Button>
              </HStack>
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

      {deleteModal && (
        <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this user{" "}
              <b>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </b>
              ?
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setDeleteModal(false)} mr={3}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                bg="red.500"
                onClick={() => handleDelete(selectedUser._id)}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default RegisteredUsers;