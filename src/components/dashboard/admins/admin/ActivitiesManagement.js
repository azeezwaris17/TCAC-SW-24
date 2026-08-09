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
  Textarea,
  Select,
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Spin, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const initialActivity = {
  name: "",
  day: "",
  startTime: "",
  endTime: "",
  facilitator: "",
  description: "",
};

const greenSpinner = (
  <LoadingOutlined style={{ fontSize: 32, color: "#38A169" }} spin />
);

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n) + "..." : str);

const ActivitiesManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(initialActivity);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [days, setDays] = useState([]);
  const toast = useToast();

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      if (data.success) setActivities(data.data);
      else setActivities([]);
    } catch {
      setActivities([]);
      toast({ title: "Failed to fetch activities", status: "error" });
    }
    setLoading(false);
  }, [toast]);

  const fetchDays = useCallback(async () => {
    try {
      const res = await fetch("/api/days");
      const data = await res.json();
      if (data.success) setDays(data.data);
      else setDays([]);
    } catch {
      setDays([]);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    fetchDays();
  }, [fetchActivities, fetchDays]);

  const handleChange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.name || !activity.day || !activity.startTime || !activity.endTime || !activity.facilitator) {
      toast({ title: "Please fill all required fields", status: "warning" });
      return;
    }
    try {
      let res;
      if (isEditing) {
        res = await fetch("/api/activities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...activity }),
        });
      } else {
        res = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activity),
        });
      }
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: isEditing ? "Activity updated" : "Activity added", status: "success" });
        fetchActivities();
        onClose();
        setActivity(initialActivity);
        setIsEditing(false);
        setEditId(null);
      } else {
        toast({ title: data.message || "Error saving activity", status: "error" });
      }
    } catch {
      toast({ title: "Error saving activity", status: "error" });
    }
  };

  const handleEdit = (item) => {
    setActivity({
      name: item.name,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      facilitator: item.facilitator,
      description: item.description,
    });
    setIsEditing(true);
    setEditId(item._id);
    onOpen();
  };

  const handleDeleteClick = (item) => {
    setSelectedActivity(item);
    setDeleteModal(true);
  };

  const handleDeleteActivity = async () => {
    if (!selectedActivity) return;
    try {
      const res = await fetch("/api/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedActivity._id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Activity deleted", status: "success" });
        fetchActivities();
      } else {
        toast({ title: data.message || "Error deleting activity", status: "error" });
      }
    } catch {
      toast({ title: "Error deleting activity", status: "error" });
    }
    setDeleteModal(false);
    setSelectedActivity(null);
  };

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setSelectedActivity(null);
  };

  const handleModalClose = () => {
    onClose();
    setActivity(initialActivity);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Box p={4}>
      <Flex align="center" mb={4}>
        <Heading size="md">Activities Management</Heading>
        <Spacer />
        <Button colorScheme="teal" onClick={onOpen}>
          Add Activity
        </Button>
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" mb={8} minWidth="800px" width="100%">
          <Thead>
            <Tr>
              <Th>Activities</Th>
              <Th>Day</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Facilitator</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={7}>
                  <Center>
                    <Spin indicator={greenSpinner} />
                  </Center>
                </Td>
              </Tr>
            ) : activities.length === 0 ? (
              <Tr>
                <Td colSpan={7}>
                  <Center>
                    <Empty description="No data" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              activities.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.day}</Td>
                  <Td>{item.startTime}</Td>
                  <Td>{item.endTime}</Td>
                  <Td>{item.facilitator}</Td>
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
          <ModalHeader>{isEditing ? "Edit Activity" : "Add Activity"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Activities</FormLabel>
                  <Input
                    name="name"
                    value={activity.name}
                    onChange={handleChange}
                    placeholder="Activity Name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Day</FormLabel>
                  <Select
                    name="day"
                    value={activity.day}
                    onChange={handleChange}
                    placeholder="Select Day"
                  >
                    {days.map((d) => (
                      <option key={d._id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    value={activity.startTime}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    value={activity.endTime}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Facilitator</FormLabel>
                  <Input
                    name="facilitator"
                    value={activity.facilitator}
                    onChange={handleChange}
                    placeholder="Facilitator Name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={activity.description}
                    onChange={handleChange}
                    placeholder="Description"
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
          <ModalHeader>Delete Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this activity{" "}
            <b>{selectedActivity?.name}</b>?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteModalClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="red" bg="red.500" onClick={handleDeleteActivity}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ActivitiesManagement;