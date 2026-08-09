import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const PaymentRequestModal = ({ isOpen, onClose, balance, userId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please provide a message explaining your situation",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Request Submitted",
          description: "Your payment request has been submitted. An administrator will review it and contact you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setMessage("");
        onClose();
      } else {
        throw new Error(data.error || "Failed to submit request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Access Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                You have an outstanding balance of <strong>₦{balance?.toLocaleString()}</strong>. 
                Please explain your situation below to request payment access.
              </Text>
            </Alert>

            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Explain your situation</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide details about why you need payment access, any financial difficulties, or special circumstances..."
                  rows={6}
                  resize="vertical"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="100%"
                mt={4}
                isLoading={loading}
                loadingText="Submitting..."
              >
                Submit Request
              </Button>
            </form>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              An administrator will review your request and contact you with a decision.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentRequestModal; 