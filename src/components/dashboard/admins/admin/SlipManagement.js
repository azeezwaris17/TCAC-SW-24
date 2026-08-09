import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Input,
  Button,
  Text,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  useDisclosure as useImageDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaEye, FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import PaymentSlip from "../../user/PaymentSlip";

const Empty = ({ description }) => (
  <Flex align="center" justify="center" py={10} color="gray.400" fontSize="lg">
    {description}
  </Flex>
);

const SlipManagement = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [userPayments, setUserPayments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Added for print slip
  const [showSlip, setShowSlip] = useState(false);
  const [slipCode, setSlipCode] = useState("");
  const slipRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const { 
    isOpen: isImageOpen, 
    onOpen: onImageOpen, 
    onClose: onImageClose 
  } = useImageDisclosure();

  useEffect(() => {
    const fetchSlips = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/slips");
      const data = await res.json();
      setSlips(data.slips || []);
      setLoading(false);
    };
    fetchSlips();
  }, []);

  const handleSearch = () => {
    if (!search) setFiltered(slips);
    else {
      setFiltered(
        slips.filter((s) => s.slipCode.includes(search))
      );
    }
  };

  useEffect(() => {
    setFiltered(slips);
  }, [slips]);

  const handleViewSlip = async (slip) => {
    setSelectedSlip(slip);
    if (slip.user && slip.user._id) {
      const res = await fetch(`/api/payment/history?userId=${slip.user._id}`);
      const data = await res.json();
      setUserPayments(data.payments || []);
    } else {
      setUserPayments([]);
    }
    setShowSlipModal(true);
  };

  const handleViewReceipt = async (slip) => {
    setSelectedSlip(slip);
    setShowReceiptModal(true);
    if (slip.user && slip.user._id) {
      const res = await fetch(`/api/payment/history?userId=${slip.user._id}`);
      const data = await res.json();
      setUserPayments(data.payments || []);
    } else {
      setUserPayments([]);
    }
  };

  const getUserName = (user) => {
    if (!user) return "N/A";
    const name = `${user.firstName} ${user.lastName}`;
    return name.length > 18 ? name.slice(0, 15) + "..." : name;
  };

  // Print slip logic
  const printSlip = async () => {
    if (!selectedSlip || !selectedSlip.user || !selectedSlip.user._id) return;
    const res = await fetch("/api/slip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedSlip.user._id }),
    });
    const data = await res.json();
    setSlipCode(data.slipCode);
    setShowSlip(true);
  };

  const handlePrint = () => {
    if (!slipRef.current) return;
    const printContents = slipRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`<html><head><title>Print Slip</title></head><body>${printContents}</body></html>`);
    Array.from(document.querySelectorAll('style,link[rel="stylesheet"]'))
      .forEach(node => win.document.head.appendChild(node.cloneNode(true)));
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
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

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>
        Slip Management
      </Heading>
      <Flex mb={4} maxW="300px">
        <Input
          placeholder="Search by slip code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
        />
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          ml={2}
          onClick={handleSearch}
        />
      </Flex>
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Empty description="No data" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Slip Code</Th>
              <Th>User</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((slip) => (
              <Tr key={slip._id}>
                <Td>
                  <Text fontFamily="mono">{slip.slipCode}</Text>
                </Td>
                <Td>
                  {getUserName(slip.user)}
                </Td>
                <Td>
                  {slip.date ? new Date(slip.date).toLocaleString() : ""}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleViewSlip(slip)}
                  >
                    View Slip
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => handleViewReceipt(slip)}
                  >
                    View Receipt
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Slip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSlip && (
              <Box>
                <Box ref={slipRef}>
                  <PaymentSlip
                    user={selectedSlip.user}
                    payments={userPayments}
                    slipCode={selectedSlip.slipCode}
                  />
                </Box>
                <Flex mt={4} justify="center" gap={2}>
                  <Button
                    colorScheme="blue"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} size="6xl">
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
                  Payment Receipts
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {selectedSlip?.user?.firstName} {selectedSlip?.user?.lastName}
                </Text>
              </VStack>
              <Badge 
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {userPayments.length} Payments
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
            {userPayments.length === 0 ? (
              <Box p={8} textAlign="center">
                <Text fontSize="lg" color="gray.500">No payments found for this user.</Text>
              </Box>
            ) : (
              <VStack spacing={4} p={8}>
                {userPayments.map((payment) => (
                  <Box 
                    key={payment._id} 
                    w="100%" 
                    p={6} 
                    bg="gray.50" 
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      {/* Payment Details */}
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" p={3} bg="white" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Date:</Text>
                          <Text>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="white" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Amount:</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            ₦{payment.amount ? Number(payment.amount).toLocaleString() : "-"}
                          </Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="white" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Type:</Text>
                          <Badge colorScheme="blue" px={2} py={1}>
                            {payment.paymentType}
                          </Badge>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="white" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Camp Type:</Text>
                          <Text>{payment.campType || "-"}</Text>
                        </Flex>
                        <Flex justify="space-between" p={3} bg="white" borderRadius="md">
                          <Text fontWeight="semibold" color="gray.700">Status:</Text>
                          <Badge 
                            colorScheme={
                              payment.status === "completed" ? "green" : 
                              payment.status === "pending" ? "yellow" : "red"
                            }
                            px={2}
                            py={1}
                          >
                            {payment.status}
                          </Badge>
                        </Flex>
                      </VStack>

                      {/* Receipt Image */}
                      {payment.receiptUrl && (
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
                            onClick={() => handleViewImage(payment.receiptUrl)}
                            _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                          >
                            <Image
                              src={payment.receiptUrl}
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
                    </Grid>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

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
    </Box>
  );
};

export default SlipManagement;