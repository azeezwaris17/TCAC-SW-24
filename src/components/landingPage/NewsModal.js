import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

const NewsModal = ({ isOpen, onClose, newsArray = [] }) => {
  // Return early if the array is null or not iterable
  if (!Array.isArray(newsArray)) {
    return null; 
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Latest News</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {newsArray.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No news available at the moment.
            </Text>
          ) : (
            <List spacing={6}>
              {newsArray.map((news) => (
                <ListItem key={news.id} borderBottom={"2px solid #000000"} pb={4}>
                  <Box>
                    <Flex justifyContent={"space-between"} mb={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {news.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {news.date}
                      </Text>
                    </Flex>
                    <Text color="gray.700">{news.description}</Text>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewsModal;