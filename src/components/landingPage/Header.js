import {
  Box,
  Flex,
  Button,
  Image,
  IconButton,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import BankDetailsModal from "./BankDetailsModal";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  
  const {
    isOpen: isBankModalOpen,
    onOpen: onOpenBankModal,
    onClose: onCloseBankModal,
  } = useDisclosure();
  const {
    isOpen: isNotificationModalOpen,
    onOpen: onOpenNotificationModal,
    onClose: onCloseNotificationModal,
  } = useDisclosure();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
        
        // Check if there are new notifications since last view
        const lastViewedTime = localStorage.getItem('lastNotificationView');
        const hasNewNotifications = data.data.some(notification => {
          if (!lastViewedTime) return true; // First time viewing
          return new Date(notification.createdAt) > new Date(lastViewedTime);
        });
        
        setHasViewedNotifications(!hasNewNotifications);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle notification modal open
  const handleOpenNotificationModal = () => {
    onOpenNotificationModal();
    // Mark as viewed
    setHasViewedNotifications(true);
    localStorage.setItem('lastNotificationView', new Date().toISOString());
  };

  // Check if there are any active notifications and user hasn't viewed them
  const hasActiveNotifications = notifications.filter(n => n.isActive).length > 0;
  const shouldShowDot = hasActiveNotifications && !hasViewedNotifications;

  return (
    <Box as="header" bg="green.50" p={4}>
      <Flex justify="space-between" align="center">
        <Image src="/timsan-logo.png" alt="Logo" boxSize="60px" />

        <Flex align="center" gap={4}>
          {/* notification/news */}
          <Flex align="center" position="relative">
            <IconButton
              aria-label="Notifications"
              icon={<FaBell />}
              size="md"
              isRound
              colorScheme="gray"
              onClick={handleOpenNotificationModal}
            />
            {!loading && shouldShowDot && (
              <Box
                position="absolute"
                top={-1}
                right={-1}
                w="8px"
                h="8px"
                bg="red.500"
                borderRadius="full"
              />
            )}
          </Flex>

          <Button
            colorScheme="blue"
            variant="solid"
            px={6}
            borderRadius="xl"
            border={"1px solid #000000"}
            boxShadow={"2px 2px 0px 0px #000000"}
            onClick={onOpenBankModal}
          >
            Donate
          </Button>

          <Button
            colorScheme="green.500"
            variant="solid"
            px={6}
            borderRadius="xl"
            border={"1px solid #000000"}
            boxShadow={"2px 2px 0px 0px #000000"}
            onClick={() => router.push("/login/user")}
          >
            Login
          </Button>
        </Flex>
      </Flex>

      {/* Modals */}
      <BankDetailsModal isOpen={isBankModalOpen} onClose={onCloseBankModal} />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={onCloseNotificationModal}
      />
    </Box>
  );
};

export default Header;
