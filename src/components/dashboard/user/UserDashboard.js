import React, { useState, useEffect } from "react";
import { Box, Heading, Text, SimpleGrid, Select, Flex, Button } from "@chakra-ui/react";
import { Empty } from "antd";
import "antd/dist/reset.css";
import styles from "@/styles/userDashboard.module.css";
import PaymentFormPopout from "./PaymentFormPopout";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { useDisclosure } from "@chakra-ui/react";
import PaymentSlip from "./PaymentSlip";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useRef } from "react";

const mealTypes = [
  { label: "Breakfast", value: "breakfast", color: "#b6eabf" },
  { label: "Lunch", value: "afternoon", color: "#f6ffb3" },
  { label: "Dinner", value: "evening", color: "#e6efe3" },
];
const ITEMS_PER_PAGE = 5;

const UserDashboard = ({ accountData: initialData }) => {
  const [accountData, setAccountData] = useState(initialData);
  const [days, setDays] = useState([]);
  const [selectedMealDay, setSelectedMealDay] = useState("");
  const [selectedScheduleDay, setSelectedScheduleDay] = useState("");
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showSlip, setShowSlip] = useState(false);
  const [slipCode, setSlipCode] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const slipRef = useRef();
  const printSlip = async () => {
    const res = await fetch("/api/slip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: accountData._id }),
    });
    const data = await res.json();
    setSlipCode(data.slipCode);
    setShowSlip(true);
  };

  const handlePrint = async () => {
    if (slipRef.current && typeof window !== 'undefined') {
      setIsGeneratingPDF(true);
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const userName = `${accountData?.firstName || ''} ${accountData?.lastName || ''}`.trim();
        const filename = userName ? `${userName}-TCAC-2025.pdf` : 'TCAC-2025-PaymentSlip.pdf';

        const images = slipRef.current.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
          return new Promise((resolve, reject) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = reject;
            }
          });
        });

        await Promise.all(imagePromises);

        html2pdf().set({
          margin: 10,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        }).from(slipRef.current).save();
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  const refreshUserData = async () => {
    if (!initialData?._id) return;
    const res = await fetch(`/api/user/${initialData._id}`);
    if (!res.ok) return;
    const data = await res.json();
    setAccountData(data);
    fetchPaymentHistory(data._id);
  };

  const fetchPaymentHistory = async (userId) => {
    if (!userId) return;
    const res = await fetch(`/api/paymenthistory?userId=${userId}`);
    if (!res.ok) {
      setPaymentHistory([]);
      return;
    }
    const data = await res.json();
    setPaymentHistory(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetch("/api/days")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setDays(data.data);
          if (data.data.length > 0) {
            setSelectedMealDay(data.data[0].name);
            setSelectedScheduleDay(data.data[0].name);
          }
        } else {
          setDays([]);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/meal")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMeals(data) : setMeals([]));
  }, []);

  useEffect(() => {
    fetch("/api/activities")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setActivities(data.data);
        } else {
          setActivities([]);
        }
      });
  }, []);

  useEffect(() => {
    if (initialData?._id) {
      refreshUserData();
    }
  }, [initialData?._id, refreshUserData]);

  const getMealName = type => {
    const meal = meals.find(m => m.day === selectedMealDay && m.type === type);
    return meal && meal.name ? meal.name : "-";
  };

  const filteredActivities = activities
    .filter(a => a.day === selectedScheduleDay)
    .sort((a, b) => (a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0));

  const totalPages = Math.ceil(paymentHistory.length / ITEMS_PER_PAGE);
  const paginatedPayments = paymentHistory.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box className={styles.container}>
      <Box className={styles.welcomeSection}>
        <Heading className={styles.welcomeHeadingOneLine}>
          Welcome back to TCAC &apos;25,{' '}
          <Box as="span" className={styles.welcomeName}>
            {accountData?.firstName || accountData?.userID}!
          </Box>
        </Heading>
      </Box>

      <Box 
        bg="#25D366" 
        color="white" 
        py={4} 
        px={6} 
        borderRadius="lg" 
        mb={6}
        textAlign="center"
        boxShadow="md"
        border="2px solid #128C7E"
      >
        <Text fontSize="lg" fontWeight="bold">
          <a href="https://chat.whatsapp.com/CT3a2TJ3c3R7IjfbYoQqw7" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
            Join the TCAC WhatsApp group 
          </a>
        </Text>
      </Box>

      {accountData?.balance > 0 && accountData?.campType !== "Camp Only" && (
        <Flex className={styles.balancePaymentSection}>
          <Text className={styles.balanceText}>
            You are{" "}
            <Box as="span" className={styles.balanceAmount}>
              {accountData?.balance?.toLocaleString()} NGN
            </Box>
            away from completing your TCAC payment
          </Text>
          <Box
            as="button"
            className={styles.balanceButton}
            onClick={onOpen}
          >
            Balance payment
          </Box>
        </Flex>
      )}

      {paymentHistory.length > 0 && (
        <Box className={styles.paymentHistorySection}>
          <Box className={styles.paymentHistoryTable}>
            <PaymentHistoryTable paymentHistory={paginatedPayments} balance={accountData?.balance} onPrintSlip={printSlip} />
          </Box>
          {paymentHistory.length > ITEMS_PER_PAGE && (
            <Flex className={styles.paginationSection}>
              <Button
                className={styles.paginationButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                {"<"}
              </Button>
              <Text fontSize="md">
                {page} / {totalPages}
              </Text>
              <Button
                className={styles.paginationButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                {">"}
              </Button>
            </Flex>
          )}
        </Box>
      )}

      <Box mb={{ base: 4, md: 10 }} />

      <Text fontSize="xl" mb={8}>
        We are not just a camp, we are family.
      </Text>

      <Flex
        align="center"
        bg="#eaffad"
        borderRadius="lg"
        px={8}
        py={5}
        mb={8}
        maxW="600px"
        boxShadow="lg"
        border="1px solid #eaffad"
        justify="space-between"
        gap={4}
      >
        <Box>
          <Text fontWeight="bold" fontSize="2xl" color="#222">
            Meal Schedule
          </Text>
          <Text fontSize="md" color="gray.600" mt={1}>
            Select a day to view the schedule
          </Text>
        </Box>
        <Select
          value={selectedMealDay}
          onChange={e => setSelectedMealDay(e.target.value)}
          width="auto"
          fontSize="lg"
          bg="#eaffe0"
          borderColor="#b6eabf"
          borderRadius="md"
          minW="150px"
        >
          {days.map(day => (
            <option key={day._id} value={day.name}>
              {day.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Box
        bg="#eaffe0"
        border="1px solid #000"
        p={8}
        borderRadius="md"
        maxW="900px"
        mb={8}
      >
        <SimpleGrid columns={3} spacing={10}>
          {mealTypes.map(mt => (
            <Box textAlign="center" key={mt.value} className={styles.mealBoxWrapper}>
              <Box
                bg={mt.color}
                color="#222"
                fontWeight="bold"
                fontSize="xl"
                px={8}
                py={2}
                borderRadius="md"
                mb={6}
                display="inline-block"
                border="1px solid #000"
                className={styles.mealBox}
              >
                {mt.label}
              </Box>
              <Text fontSize="2xl" mt={4} className={styles.mealValue}>
                {getMealName(mt.value)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <Box height={8} />
      <Flex
        align="center"
        bg="#32b432"
        borderRadius="lg"
        px={8}
        py={5}
        mb={8}
        maxW="600px"
        boxShadow="lg"
        border="1px solid #eaffad"
        justify="space-between"
        gap={4}
      >
        <Box>
          <Text fontWeight="bold" fontSize="2xl" color="#222">
            Daily Schedule
          </Text>
          <Text fontSize="md" color="gray.600" mt={1}>
            Select a day to view the schedule
          </Text>
        </Box>
        <Select
          value={selectedScheduleDay}
          onChange={e => setSelectedScheduleDay(e.target.value)}
          width="auto"
          fontSize="lg"
          bg="#eaffe0"
          borderColor="#b6eabf"
          borderRadius="md"
          minW="150px"
        >
          {days.map(day => (
            <option key={day._id} value={day.name}>
              {day.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Box
        bg="#f1ffb3"
        border="1px solid #000"
        p={8}
        borderRadius="md"
        maxW="1100px"
        mx="auto"
        mb={8}
        mt={4}
      >
        <SimpleGrid columns={3} spacing={10}>
          <Box textAlign="center" className={styles.activitiesBoxWrapper}>
            <Box
              bg="#e6efe3"
              color="#222"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
              className={styles.activitiesBox}
            >
              Activities
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} />
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id} className={styles.activitiesValue}>
                  {item.name}
                </Text>
              ))
            )}
          </Box>
          <Box textAlign="center" className={styles.durationBoxWrapper}>
            <Box
              bg="#eaffe0"
              color="#222"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
              className={styles.durationBox}
            >
              Duration
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} display="flex" alignItems="center" justifyContent="center" height="100%" />
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id} className={styles.durationValue}>
                  {item.startTime} - {item.endTime}
                </Text>
              ))
            )}
          </Box>
          <Box textAlign="center" className={styles.facilitatorBoxWrapper}>
            <Box
              bg="#3cb43c"
              color="#fff"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
              className={styles.facilitatorBox}
            >
              Facilitator
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} />
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id} className={styles.facilitatorValue}>
                  {item.facilitator}
                </Text>
              ))
            )}
          </Box>
        </SimpleGrid>
      </Box>
      <PaymentFormPopout
        isOpen={isOpen}
        onClose={onClose}
        userId={accountData?._id}
        balance={accountData?.balance}
        userCampType={accountData?.campType}
        userCategory={accountData?.userCategory}
        refreshUserData={refreshUserData}
      />
    <Modal isOpen={showSlip} onClose={() => setShowSlip(false)} size="xl">
  <ModalOverlay />
  <ModalContent>
    <ModalBody>
      <div ref={slipRef}>
        <PaymentSlip user={accountData} payments={paymentHistory} slipCode={slipCode} />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button 
        colorScheme="green" 
        mr={3} 
        onClick={handlePrint}
        isLoading={isGeneratingPDF}
        loadingText="Generating PDF..."
      >
        Print
      </Button>
      <Button variant="ghost" onClick={() => setShowSlip(false)}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>
  );
};

export default UserDashboard;