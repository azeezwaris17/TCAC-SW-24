import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CopyIcon } from "@chakra-ui/icons";

const HeroSection = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copiedText, setCopiedText] = useState("");

  const bankDetails = {
    accountName: "Timsan southwest",
    accountNumber: "2283452778",
    bankName: "UBA",
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
  };

  return (
    <>
      <Box
        as="section"
        className="hero-section"
        p={{ base: 8, md: 12 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Heading as="h1" size="3xl" fontWeight="bold" mb={4} color="black">
          TIMSAN Camp and Conference 2025 (TCAC &apos;25)
        </Heading>
        <Text
          fontSize="md"
          mb={8}
          maxW="2xl"
          mx="auto"
          color="black"
          fontWeight="normal"
        >
          Participate in an extraordinary experience while delving into the heart of
          leadership excellence, creativity, innovation, brotherhood, and exponential
          growth.
        </Text>
        
        
      </Box>

      {/* Modal for displaying bank details */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bank Account Details</ModalHeader>
          <ModalBody>
            <Box mb={4}>
              <Text mb={2}>Account Name: {bankDetails.accountName}</Text>
              <Flex alignItems="center" mb={2}>
                <Text>Account Number: {bankDetails.accountNumber}</Text>
                <Tooltip
                  label={
                    copiedText === bankDetails.accountNumber
                      ? "Copied!"
                      : "Copy"
                  }
                  hasArrow
                  placement="top"
                >
                  <IconButton
                    aria-label="Copy Account Number"
                    icon={<CopyIcon />}
                    size="sm"
                    onClick={() => handleCopy(bankDetails.accountNumber)}
                    ml={2}
                  />
                </Tooltip>
              </Flex>
              <Flex alignItems="center">
                <Text>Bank: {bankDetails.bankName}</Text>
                <Tooltip
                  label={
                    copiedText === bankDetails.bankName ? "Copied!" : "Copy"
                  }
                  hasArrow
                  placement="top"
                >
                  <IconButton
                    aria-label="Copy Bank Name"
                    icon={<CopyIcon />}
                    size="sm"
                    onClick={() => handleCopy(bankDetails.bankName)}
                    ml={2}
                  />
                </Tooltip>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HeroSection;