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
} from "@chakra-ui/react";
import { FaSearch, FaDownload, FaSync } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
  const [selectedUser, setSelectedUser] = useState(null);

  const toast = useToast();

  const usersPerPage = 10; // Number of users to show per page
  const pageCount = Math.ceil(users.length / usersPerPage); // Calculate total pages

  useEffect(() => {
    console.log("Fetching users...");
    dispatch(fetchUsers());
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

  const handleViewMore = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleApprove = async (id) => {
    try {
      console.log("Approving user with ID:", id);
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
      console.log("Rejecting user with ID:", id);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleExportToExcel = () => {
    // console.log("Exporting to Excel...");

    // Define keys to exclude
    const excludedKeys = ["_id", "password", "__v", "updatedAt"];

    // Filter and map user data
    const filteredUsers = users.map((user) => {
      return Object.entries(user)
        .filter(([key, value]) => !excludedKeys.includes(key) && value) // Exclude specified keys and ensure values are not empty
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    });

    // Create a worksheet from the filtered user data
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Export the file
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
    console.log("Updating table...");
    dispatch(fetchUsers());
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Users to display on the current page
  const currentUsers = filteredUsers.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <Box>
      {/* search, update and download component */}
      <Flex mb={8} justify="space-between" align="center">
        {/* search input */}
        <Flex align="center">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            size="sm"
            width="200px"
          />
          <Button size="sm" ml={2} onClick={handleSearch} icon={<FaSearch />}>
            <FaSearch />
          </Button>
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
            {currentUsers.map((user, index) => (
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
            ))}
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

      {/* Modal */}
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {(() => {
                const excludedKeys = ["_id", "password", "updatedAt", "__v"]; // Define excluded keys here

                return (
                  <Flex direction="column" gap={4}>
                    {Object.entries(selectedUser)
                      .filter(
                        ([key, value]) => !excludedKeys.includes(key) && value
                      ) // Filter out excluded keys and empty/null values
                      .map(([key, value]) => (
                        <Flex key={key} align="center">
                          <Text fontWeight="bold" mr={2}>
                            {key

                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            :
                          </Text>
                          {key === "receiptUrl" ? (
                            <Link
                              as={NextLink}
                              href={value}
                              isExternal
                              color="blue.500"
                              textDecoration="underline"
                            >
                              View Receipt
                            </Link>
                          ) : (
                            <Text>{value}</Text>
                          )}
                        </Flex>
                      ))}
                  </Flex>
                );
              })()}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={() => handleApprove(selectedUser._id)}
                isDisabled={selectedUser.registrationStatus === "approved"}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleReject(selectedUser._id)}
                isDisabled={selectedUser.registrationStatus === "rejected"}
              >
                Reject
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default RegisteredUsers;
