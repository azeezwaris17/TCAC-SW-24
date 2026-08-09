import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  IconButton,
  Tooltip,
  Text,
  Flex,
  Box,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const BankDetailsModal = ({ isOpen, onClose }) => {
  const [copiedAccountName, setCopiedAccountName] = useState(false);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const [copiedBankName, setCopiedBankName] = useState(false);

  const details = {
    accountName: "Timsan southwest",
    accountNumber: "2283452778",
    bankName: "UBA",
  };

  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bank Account Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <HStack spacing={2} align="center">
                <Text fontWeight="bold">Account Name:</Text>
                <Text>{details.accountName}</Text>
              </HStack>
              <Tooltip
                label={copiedAccountName ? "Copied!" : "Copy"}
                aria-label="Copy account name"
              >
                <IconButton
                  icon={<CopyIcon />}
                  onClick={() => handleCopy(details.accountName, setCopiedAccountName)}
                  aria-label="Copy account name"
                  colorScheme="green"
                  size="sm"
                />
              </Tooltip>
            </HStack>

            <HStack justify="space-between" align="center">
              <HStack spacing={2} align="center">
                <Text fontWeight="bold">Account Number:</Text>
                <Text>{details.accountNumber}</Text>
              </HStack>
              <Tooltip
                label={copiedAccountNumber ? "Copied!" : "Copy"}
                aria-label="Copy account number"
              >
                <IconButton
                  icon={<CopyIcon />}
                  onClick={() => handleCopy(details.accountNumber, setCopiedAccountNumber)}
                  aria-label="Copy account number"
                  colorScheme="green"
                  size="sm"
                />
              </Tooltip>
            </HStack>

            <HStack justify="space-between" align="center">
              <HStack spacing={2} align="center">
                <Text fontWeight="bold">Bank:</Text>
                <Text>{details.bankName}</Text>
              </HStack>
              <Tooltip
                label={copiedBankName ? "Copied!" : "Copy"}
                aria-label="Copy bank name"
              >
                <IconButton
                  icon={<CopyIcon />}
                  onClick={() => handleCopy(details.bankName, setCopiedBankName)}
                  aria-label="Copy bank name"
                  colorScheme="green"
                  size="sm"
                />
              </Tooltip>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BankDetailsModal;