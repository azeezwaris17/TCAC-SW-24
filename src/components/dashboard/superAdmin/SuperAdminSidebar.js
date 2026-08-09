import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Link,
  IconButton,
  Collapse,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { FaUser, FaUserCog, FaEnvelope, FaSignOutAlt, FaMoneyCheckAlt, FaCog, FaClock, FaNewspaper } from "react-icons/fa";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import { MdDashboard, MdRestaurantMenu, MdToday } from "react-icons/md";

const SuperAdminSidebar = ({ onMenuClick, accountData }) => {
  // console.log("super admin account data:", accountData);

  // State to track the open submenu (for desktop view)
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // State to track if the sidebar is collapsed or expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State to track if the drawer is open for mobile view
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Toggle function for submenus in desktop view
  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  // Toggle function to collapse/expand sidebar in desktop view
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle function for the mobile drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Determines if the sidebar should be in "drawer" or "sidebar" mode based on screen size
  const sidebarVariant = useBreakpointValue({ base: "drawer", md: "sidebar" });

  // Sidebar content shared between mobile (drawer) and desktop (sidebar)
  const SidebarContent = (
    <VStack
      as="nav"
      align="start"
      w={isSidebarCollapsed ? "60px" : "250px"}
      p="4"
      color="gray.800"
      spacing={8}
      transition="width 0.3s"
    >
      <Text mb={8} fontSize="md" fontWeight={"bold"}>
        {!isSidebarCollapsed && (
          <>
            Welcome back, <br /> {accountData?.superAdminID}
          </>
        )}
      </Text>

      {/* registered users */}
      <Box
        onClick={() => {
          onMenuClick("registered-users");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaUser />
          {!isSidebarCollapsed && <Text>Registered Users</Text>}
        </Link>
      </Box>

      {/* registered admins */}
      <Box
        onClick={() => {
          onMenuClick("registered-admins");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaUserCog />
          {!isSidebarCollapsed && <Text>Registered Admins</Text>}
        </Link>
      </Box>

      {/* Activities Management */}
      <Box
        onClick={() => {
          onMenuClick("activities-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <MdDashboard />
          {!isSidebarCollapsed && <Text>Activities Management</Text>}
        </Link>
      </Box>

      {/* Meal Management */}
      <Box
        onClick={() => {
          onMenuClick("meal-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <MdRestaurantMenu />
          {!isSidebarCollapsed && <Text>Meal Management</Text>}
        </Link>
      </Box>

      {/* Days Management */}
      <Box
        onClick={() => {
          onMenuClick("days-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <MdToday />
          {!isSidebarCollapsed && <Text>Days Management</Text>}
        </Link>
      </Box>

      {/* Post Management */}
      <Box
        onClick={() => {
          onMenuClick("post-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaNewspaper />
          {!isSidebarCollapsed && <Text>Information Management</Text>}
        </Link>
      </Box>

      {/* Payment Management */}
      <Box
        onClick={() => {
          onMenuClick("payment-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaMoneyCheckAlt />
          {!isSidebarCollapsed && <Text>Payment Management</Text>}
        </Link>
      </Box>

      {/* Settings */}
      <Box
        onClick={() => {
          onMenuClick("settings");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaCog />
          {!isSidebarCollapsed && <Text>Settings</Text>}
        </Link>
      </Box>

      {/* Payment Request Management */}
      <Box
        onClick={() => {
          onMenuClick("payment-requests");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaClock />
          {!isSidebarCollapsed && <Text>Payment Requests</Text>}
        </Link>
      </Box>

      {/* Slip Management */}
      <Box
        onClick={() => {
          onMenuClick("slip-management");
          if (sidebarVariant === "drawer") toggleDrawer();
        }}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap="6"
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaUserCog />
          {!isSidebarCollapsed && <Text>Slip Management</Text>}
        </Link>
      </Box>

      {/* logout */}
      <Box
        onClick={() => onMenuClick("logout")}
        _focus={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "4",
        }}
        _hover={{
          size: "md",
          border: "1px solid black",
          boxShadow: "2px 2px 0px 0px #000000",
          p: "2",
          textDecoration: "none",
          scale: "1",
        }}
      >
        <Link
          display="flex"
          alignItems="center"
          gap={6}
          _hover={{
            textDecoration: "none",
          }}
          _focus={{
            textDecoration: "none",
          }}
        >
          <FaSignOutAlt />
          {!isSidebarCollapsed && <Text>Logout</Text>}
        </Link>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Drawer for mobile devices */}
      {sidebarVariant === "drawer" ? (
        <>
          {/* Hamburger icon for opening the mobile drawer */}
          <IconButton
            icon={<HamburgerIcon />}
            onClick={toggleDrawer}
            variant="ghost"
            aria-label="Open Menu"
            display={{ md: "none" }} // Only display on small screens
          />
          {/* Drawer component for mobile screens */}
          <Drawer isOpen={isDrawerOpen} placement="left" onClose={toggleDrawer}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody bg="green.200">{SidebarContent}</DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        /* Sidebar for larger screens */
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection={"row-reverse"}
          className="bg-[#D9FAD4]"
        >
          {/* Sidebar toggle button for desktop view */}
          <IconButton
            icon={isSidebarCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            size={"lg"}
            onClick={toggleSidebar}
            variant="ghost"
            aria-label="Toggle Sidebar"
            // zIndex="overlay"
            transition="left 0.3s"
          />
          {/* Sidebar content */}
          <Box
            w={isSidebarCollapsed ? "60px" : "250px"}
            className="bg-[#D9FAD4]"
          >
            {SidebarContent}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SuperAdminSidebar;
