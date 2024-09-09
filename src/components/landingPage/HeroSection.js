// components/HeroSection.js
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
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";

const HeroSection = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [copiedText, setCopiedText] = useState("");

  const bankDetails = {
    accountName: "TIMSAN Camp Account",
    accountNumber: "1234567890",
    bankName: "Green Bank",
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
        bg="green.50"
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
          TIMSAN Camp and Conference 2024 (TCAC &apos;24)
        </Heading>
        <Text fontSize="lg" mb={8} maxW="2xl" mx="auto">
          Participate in an extraordinary experience while delving into the
          heart of leadership excellence, creativity, innovation, brotherhood,
          and exponential growth.
        </Text>
        <Box display="flex" justifyContent="center" gap={4}>
          <Button
            className="shadow-md"
            colorScheme="white"
            size="md"
            px={8}
            py={4}
            borderRadius="xl"
            border="1px solid black"
            boxShadow={"2px 2px 0px 0px #000000"}
            color="black"
            onClick={() => router.push("/register/user")}
          >
            Register
          </Button>

          <Button
            className="shadow-md shadow-green-800"
            colorScheme="green"
            size="md"
            borderRadius="xl"
            border="1px solid black"
            boxShadow={"2px 2px 0px 0px #000000"}
            px={8}
            py={4}
            onClick={onOpen} // Open the modal when Donate is clicked
          >
            Donate
          </Button>
        </Box>
      </Box>

      {/* Modal for displaying bank details */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bank Account Details</ModalHeader>
          <ModalBody>
            <Box mb={4}>
              <Text>Account Name: {bankDetails.accountName}</Text>
              <Flex alignItems="center">
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
