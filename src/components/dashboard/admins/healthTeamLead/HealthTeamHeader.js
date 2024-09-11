import React, { useState } from 'react';
import { Box, IconButton, Flex, Text, VStack, Collapse, Link } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaUserMd, FaRegFileAlt } from 'react-icons/fa';

const HealthTeamHeader = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box bg="blue.300" p={4} display={{ base: 'block', md: 'none' }} color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">Health Team</Text>
        <IconButton
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
        />
      </Flex>
      <Collapse in={isOpen}>
        <VStack mt={4} align="start" spacing={4}>
          <Link onClick={() => onMenuClick('dashboard')}>
            <Flex align="center">
              <FaHome />
              <Text ml={2}>Dashboard</Text>
            </Flex>
          </Link>
          <Link onClick={() => onMenuClick('medical-records')}>
            <Flex align="center">
              <FaUserMd />
              <Text ml={2}>Medical Records</Text>
            </Flex>
          </Link>
          <Link onClick={() => onMenuClick('reports')}>
            <Flex align="center">
              <FaRegFileAlt />
              <Text ml={2}>Reports</Text>
            </Flex>
          </Link>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default HealthTeamHeader;
