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
  Button,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { FaUser, FaUserCog, FaEnvelope, FaSignOutAlt, FaMoneyCheckAlt, FaNewspaper } from "react-icons/fa";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import { MdDashboard, MdRestaurantMenu, MdToday } from "react-icons/md";
import { useRouter } from "next/router";

const AdminSidebar = ({ onMenuClick, accountData }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const sidebarVariant = useBreakpointValue({ base: "drawer", md: "sidebar" });

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
            Welcome back, <br /> {accountData?.adminID}
          </>
        )}
      </Text>

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
          gap={6}
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
          gap={6}
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
      {sidebarVariant === "drawer" ? (
        <>
          <IconButton
            icon={<HamburgerIcon />}
            onClick={toggleDrawer}
            variant="ghost"
            aria-label="Open Menu"
            display={{ md: "none" }}
          />
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
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection={"row-reverse"}
          className="bg-[#D9FAD4]"
        >
          <IconButton
            icon={isSidebarCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            size={"lg"}
            onClick={toggleSidebar}
            variant="ghost"
            aria-label="Toggle Sidebar"
            transition="left 0.3s"
          />
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

export default AdminSidebar;