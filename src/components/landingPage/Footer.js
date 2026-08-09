// components/Footer.js
import { Box, Flex, Text, Link, Icon, Image } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="gray.900"
      color="gray.50"
      py={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Image
        src="/images/timsan-logo.png"
        alt="TIMSAN Logo"
        mb={4}
        boxSize="80px"
        objectFit="contain"
      />

      <Text fontWeight="bold" fontSize="lg" color="gray.50" mb={2}>
        TIMSAN CAMP AND CONFERENCE, SOUTHWEST ZONE
      </Text>

      <Flex
        flexDirection={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        mb={4}
      >
        <Link href="mailto:timsan.swcampandconference@gmail.com" isExternal>
          timsan.swcampandconference@gmail.com
        </Link>
        <Text mx={2} color="gray.50" display={{ base: "none", md: "block" }}>
          |
        </Text>
        <Link href="tel:+2348168089260" isExternal>
          +2348168089260
        </Link>
      </Flex>

      <Text fontWeight="bold" fontSize="md" color="gray.50" mt={4} mb={2}>
        Follow Us
      </Text>

      <Flex justify="center" mb={4} gap={4}>
        <Link
          href="https://facebook.com/timsansouthwest/"
          isExternal
          bg="green.500"
          rounded={"full"}
          p={"1"}
          color="gray.50"
        >
          <Icon as={FaFacebook} boxSize={6} />
        </Link>
        <Link
          href="https://www.instagram.com/timsansouthwest/"
          isExternal
          bg="green.500"
          rounded={"full"}
          p={"1"}
          color="gray.50"
        >
          <Icon as={FaInstagram} boxSize={6} />
        </Link>
        <Link
          href="https://x.com/timsan_sw_zone"
          isExternal
          bg="green.500"
          rounded={"full"}
          p={"1"}
          color="gray.50"
        >
          <Icon as={FaTwitter} boxSize={6} />
        </Link>
      </Flex>

      <Text fontSize="sm" color="gray.50" mt={4}>
        © 2025. Powered by TIMSAN Southwest. <br /> All Rights Reserved.
      </Text>
    </Box>
  );
};

export default Footer;
