import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Text,
  Stack,
  IconButton,
  Tag,
  Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Spin, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const getStatusTag = (meal) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const start = new Date(`${today}T${meal.startTime}`);
  const end = new Date(`${today}T${meal.endTime}`);

  if (now < start) {
    return <Tag colorScheme="yellow">Not yet observed</Tag>;
  } else if (now >= start && now <= end) {
    return <Tag colorScheme="green">Ongoing</Tag>;
  } else {
    return <Tag colorScheme="orange">Completed</Tag>;
  }
};

const greenSpinner = (
  <LoadingOutlined style={{ fontSize: 32, color: "#38A169" }} spin />
);

const MealManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealDay, setMealDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meals, setMeals] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchMeals();
    fetchDays();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meal");
      const data = await res.json();
      setMeals(Array.isArray(data) ? data : []);
    } catch {
      setMeals([]);
    }
    setLoading(false);
  };

  const fetchDays = async () => {
    try {
      const res = await fetch("/api/days");
      const data = await res.json();
      if (data.success) setDays(data.data);
      else setDays([]);
    } catch {
      setDays([]);
    }
  };

  const handleCreateMeal = () => {
    setMealName("");
    setMealType("");
    setMealDay("");
    setStartTime("");
    setEndTime("");
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mealName,
          type: mealType,
          day: mealDay,
          startTime,
          endTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
        setMealName("");
        setMealType("");
        setMealDay("");
        setStartTime("");
        setEndTime("");
        fetchMeals();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create meal.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (meal) => {
    setEditMealId(meal._id);
    setMealName(meal.name);
    setMealType(meal.type);
    setMealDay(meal.day);
    setStartTime(meal.startTime);
    setEndTime(meal.endTime);
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/meal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editMealId,
          name: mealName,
          type: mealType,
          day: mealDay,
          startTime,
          endTime,
        }),
      });
      if (res.ok) {
        toast({
          title: "Success",
          description: "Meal updated successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setEditModal(false);
        setEditMealId(null);
        setMealName("");
        setMealType("");
        setMealDay("");
        setStartTime("");
        setEndTime("");
        fetchMeals();
      } else {
        toast({
          title: "Error",
          description: "Failed to update meal.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (meal) => {
    setSelectedMeal(meal);
    setDeleteModal(true);
  };

  const handleDeleteMeal = async () => {
    if (!selectedMeal) return;
    try {
      const res = await fetch("/api/meal", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedMeal._id }),
      });
      if (res.ok) {
        toast({
          title: "Deleted",
          description: `${selectedMeal.name} deleted successfully`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setDeleteModal(false);
        setSelectedMeal(null);
        fetchMeals();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete meal.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box fontFamily="sans-serif">
      <Box display="flex" alignItems="center" mb="1.5rem" justifyContent="space-between">
        <Heading fontSize="1.5rem" fontWeight="bold" m={0}>
          Meal Management
        </Heading>
        <Button
          aria-label="Create a New Meal"
          title="Create a New Meal"
          onClick={handleCreateMeal}
          colorScheme="green"
          borderRadius="full"
          boxSize="48px"
          fontSize="2rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <AddIcon />
        </Button>
      </Box>

      <Box>
        {loading ? (
          <Center py={10}>
            <Spin indicator={greenSpinner} />
          </Center>
        ) : meals.length === 0 ? (
          <Empty description="No data" />
        ) : (
          <Stack spacing={3}>
            {meals.map((meal) => (
              <Box key={meal._id} p={3} borderWidth={1} borderRadius="md" position="relative">
                <Box position="absolute" top={2} right={2} display="flex" gap="0.5rem">
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    colorScheme="green"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditClick(meal)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={
                      <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
                        <path d="M360 820a40 40 0 0 0 40 40h224a40 40 0 0 0 40-40V372H360v448zm468-572h-104l-34-56a40 40 0 0 0-34-20H368a40 40 0 0 0-34 20l-34 56H196a24 24 0 0 0 0 48h632a24 24 0 0 0 0-48z" />
                      </svg>
                    }
                    onClick={() => handleDeleteClick(meal)}
                    size="sm"
                    variant="ghost"
                    color="red.500"
                  />
                </Box>
                <Text fontWeight="bold">{meal.name}</Text>
                <Text>Type: {meal.type}</Text>
                <Text>Day: {meal.day}</Text>
                <Text>
                  Time: {meal.startTime} - {meal.endTime}
                </Text>
                {getStatusTag(meal)}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new meal</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl mb={3} isRequired>
                <FormLabel>Name of meal</FormLabel>
                <Input
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Enter meal name"
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Select type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </Select>
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Day</FormLabel>
                <Select
                  placeholder="Select day"
                  value={mealDay}
                  onChange={(e) => setMealDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} type="submit">
                Create
              </Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {mealName}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditSubmit}>
            <ModalBody>
              <FormControl mb={3} isRequired>
                <FormLabel>Name of meal</FormLabel>
                <Input
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Enter meal name"
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Select type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </Select>
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Day</FormLabel>
                <Select
                  placeholder="Select day"
                  value={mealDay}
                  onChange={(e) => setMealDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={() => setEditModal(false)} variant="ghost">
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Meal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this meal{" "}
            <b>{selectedMeal?.name}</b>?
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setDeleteModal(false)} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteMeal}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MealManagement;