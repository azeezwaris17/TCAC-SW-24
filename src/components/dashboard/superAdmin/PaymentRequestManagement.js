import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  HStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const PaymentRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payment-requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payment requests",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/payment-requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action,
          adminComment: adminComment || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchRequests();
        setIsModalOpen(false);
        setAdminComment("");
        setSelectedRequest(null);
      } else {
        throw new Error(data.error || "Failed to update request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setAdminComment("");
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "revoked":
        return "orange";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="green.500" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Payment Access Requests
          </Heading>
          <Text color="gray.600">
            Manage user requests for payment access after deadline
          </Text>
        </Box>

        {requests.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text>No payment access requests found.</Text>
          </Alert>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Balance</Th>
                  <Th>Request Date</Th>
                  <Th>Status</Th>
                  <Th>Message</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {requests.map((request) => (
                  <Tr key={request._id}>
                    <Td>
                      <Text fontWeight="medium">
                        {request.firstName} {request.lastName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {request.email}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ID: {request.userID}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold" color="red.500">
                        ₦{request.balance?.toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {formatDate(request.paymentRequestDate)}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(request.paymentRequestStatus)}>
                        {request.paymentRequestStatus}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" noOfLines={2}>
                        {request.paymentRequestMessage}
                      </Text>
                    </Td>
                    <Td>
                      <VStack spacing={2} align="start">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => openModal(request)}
                        >
                          View Details
                        </Button>
                        
                        {/* Show appropriate action buttons based on current status */}
                        {request.paymentRequestStatus === "pending" && (
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleAction(request._id, "approve")}
                              isLoading={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleAction(request._id, "reject")}
                              isLoading={actionLoading}
                            >
                              Reject
                            </Button>
                          </HStack>
                        )}
                        
                        {request.paymentRequestStatus === "approved" && (
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleAction(request._id, "reject")}
                              isLoading={actionLoading}
                            >
                              Reject
                            </Button>
                          </HStack>
                        )}
                        
                        {request.paymentRequestStatus === "rejected" && (
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleAction(request._id, "approve")}
                              isLoading={actionLoading}
                            >
                              Approve
                            </Button>
                          </HStack>
                        )}
                        
                        {request.paymentRequestStatus === "revoked" && (
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleAction(request._id, "approve")}
                              isLoading={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleAction(request._id, "reject")}
                              isLoading={actionLoading}
                            >
                              Reject
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRequest && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">User Information</Text>
                  <Text>
                    {selectedRequest.firstName} {selectedRequest.lastName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {selectedRequest.email}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ID: {selectedRequest.userID}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Outstanding Balance</Text>
                  <Text fontSize="lg" color="red.500" fontWeight="bold">
                    ₦{selectedRequest.balance?.toLocaleString()}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Request Date</Text>
                  <Text>{formatDate(selectedRequest.paymentRequestDate)}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Status</Text>
                  <Badge colorScheme={getStatusColor(selectedRequest.paymentRequestStatus)}>
                    {selectedRequest.paymentRequestStatus}
                  </Badge>
                </Box>

                <Box>
                  <Text fontWeight="bold">User&apos;s Message</Text>
                  <Text
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                  >
                    {selectedRequest.paymentRequestMessage}
                  </Text>
                </Box>

                {/* Show action buttons for all statuses */}
                <Box>
                  <FormControl>
                    <FormLabel>Admin Comment (Optional)</FormLabel>
                    <Textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Add a comment or reason for your decision..."
                      rows={3}
                    />
                  </FormControl>

                  <HStack spacing={3} mt={4}>
                    {selectedRequest.paymentRequestStatus === "pending" && (
                      <>
                        <Button
                          colorScheme="green"
                          onClick={() => handleAction(selectedRequest._id, "approve")}
                          isLoading={actionLoading}
                          flex={1}
                        >
                          Approve Access
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleAction(selectedRequest._id, "reject")}
                          isLoading={actionLoading}
                          flex={1}
                        >
                          Reject Request
                        </Button>
                      </>
                    )}
                    
                    {selectedRequest.paymentRequestStatus === "approved" && (
                      <Button
                        colorScheme="red"
                        onClick={() => handleAction(selectedRequest._id, "reject")}
                        isLoading={actionLoading}
                        flex={1}
                      >
                        Reject Request
                      </Button>
                    )}
                    
                    {selectedRequest.paymentRequestStatus === "rejected" && (
                      <Button
                        colorScheme="green"
                        onClick={() => handleAction(selectedRequest._id, "approve")}
                        isLoading={actionLoading}
                        flex={1}
                      >
                        Approve Access
                      </Button>
                    )}
                    
                    {selectedRequest.paymentRequestStatus === "revoked" && (
                      <>
                        <Button
                          colorScheme="green"
                          onClick={() => handleAction(selectedRequest._id, "approve")}
                          isLoading={actionLoading}
                          flex={1}
                        >
                          Approve Access
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleAction(selectedRequest._id, "reject")}
                          isLoading={actionLoading}
                          flex={1}
                        >
                          Reject Request
                        </Button>
                      </>
                    )}
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PaymentRequestManagement; 