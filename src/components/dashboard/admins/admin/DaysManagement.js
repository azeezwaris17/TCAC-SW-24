import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  VStack,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Center,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Spin, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const initialDay = {
  name: "",
  description: "",
};

const greenSpinner = (
  <LoadingOutlined style={{ fontSize: 32, color: "#38A169" }} spin />
);

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n) + "..." : str);

const DaysManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [days, setDays] = useState([]);
  const [day, setDay] = useState(initialDay);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const toast = useToast();

  const fetchDays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/days");
      const data = await res.json();
      if (data.success) setDays(data.data);
      else setDays([]);
    } catch {
      setDays([]);
      toast({ title: "Failed to fetch days", status: "error" });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  const handleChange = (e) => {
    setDay({ ...day, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!day.name) {
      toast({ title: "Please enter day name", status: "warning" });
      return;
    }
    try {
      let res;
      if (isEditing) {
        res = await fetch("/api/days", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...day }),
        });
      } else {
        res = await fetch("/api/days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(day),
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: isEditing ? "Day updated" : "Day added", status: "success" });
        fetchDays();
        onClose();
        setDay(initialDay);
        setIsEditing(false);
        setEditId(null);
      } else {
        toast({ title: data.message || "Error saving day", status: "error" });
      }
    } catch {
      toast({ title: "Error saving day", status: "error" });
    }
  };

  const handleEdit = (item) => {
    setDay({ name: item.name, description: item.description || "" });
    setIsEditing(true);
    setEditId(item._id);
    onOpen();
  };

  const handleDeleteClick = (item) => {
    setSelectedDay(item);
    setDeleteModal(true);
  };

  const handleDeleteDay = async () => {
    if (!selectedDay) return;
    try {
      const res = await fetch("/api/days", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedDay._id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Day deleted", status: "success" });
        fetchDays();
      } else {
        toast({ title: data.message || "Error deleting day", status: "error" });
      }
    } catch {
      toast({ title: "Error deleting day", status: "error" });
    }
    setDeleteModal(false);
    setSelectedDay(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setSelectedDay(null);
  };

  const handleModalClose = () => {
    onClose();
    setDay(initialDay);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Box p={4}>
      <Flex align="center" mb={4}>
        <Heading size="md">Days Management</Heading>
        <Spacer />
        <Button colorScheme="teal" onClick={onOpen}>
          Add Day
        </Button>
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" mb={8} minWidth="600px" width="100%">
          <Thead>
            <Tr>
              <Th>Day Name</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={3}>
                  <Center>
                    <Spin indicator={greenSpinner} />
                  </Center>
                </Td>
              </Tr>
            ) : days.length === 0 ? (
              <Tr>
                <Td colSpan={3}>
                  <Center>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={<span style={{ color: "#A0AEC0", fontWeight: 600 }}>No data</span>}
                    />
                  </Center>
                </Td>
              </Tr>
            ) : (
              days.map((item) => (
                <Tr key={item._id}>
                  <Td>{truncate(item.name, 30)}</Td>
                  <Td>{truncate(item.description, 14)}</Td>
                  <Td>
                    <Flex gap={2} align="center" direction="row">
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit"
                        variant="ghost"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(item)}
                        aria-label="Delete"
                        variant="ghost"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Day" : "Add Day"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Day Name</FormLabel>
                  <Input
                    name="name"
                    value={day.name}
                    onChange={handleChange}
                    placeholder="Enter day name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={day.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" type="submit">
                {isEditing ? "Update" : "Save"}
              </Button>
              <Button onClick={handleModalClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal isOpen={deleteModal} onClose={handleDeleteModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Day</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this day{" "}
            <b>{selectedDay?.name}</b>?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteModalClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="red" bg="red.500" onClick={handleDeleteDay}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DaysManagement;