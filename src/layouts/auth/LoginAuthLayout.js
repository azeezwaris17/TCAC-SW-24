// components/LoginLayout.js
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Stack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const LoginAuthLayout = ({ formHeading, loginForm, role }) => {
  const router = useRouter();
  const [registrationStatus, setRegistrationStatus] = useState({
    portalRegistrationOpen: true,
    registrationMessage: "",
    loading: true,
  });

  // Check registration status on component mount
  useEffect(() => {
    if (role === "user") {
      checkRegistrationStatus();
    } else {
      setRegistrationStatus(prev => ({ ...prev, loading: false }));
    }
  }, [role]);

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch("/api/settings/check-registration");
      if (response.ok) {
        const data = await response.json();
        setRegistrationStatus({
          portalRegistrationOpen: data.portalRegistrationOpen,
          registrationMessage: data.registrationMessage,
          loading: false,
        });
      } else {
        // Default to open if API fails
        setRegistrationStatus({
          portalRegistrationOpen: true,
          registrationMessage: "",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
      // Default to open if API fails
      setRegistrationStatus({
        portalRegistrationOpen: true,
        registrationMessage: "",
        loading: false,
      });
    }
  };

  return (
    <Box>
      {/* header */}
      <Flex
        justify="space-between"
        alignItems={"center"}
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.100"
        zIndex="10"
        py={8}
        px={12}
      >
        <Link href="/" passHref>
          <Image
            src="/images/timsan-logo.png"
            alt="Logo"
            className="h-12 mb-6"
          />
        </Link>

        <HStack spacing={4}>
          {role === "user" && !registrationStatus.loading && !registrationStatus.portalRegistrationOpen && (
            <Alert status="warning" variant="subtle" borderRadius="md" maxW="300px">
              <AlertIcon />
              <Text fontSize="sm" color="orange.800">
                Registration Closed
              </Text>
            </Alert>
          )}
          <Text display={{ base: "none", md: "block" }} fontWeight="medium">
            Don&apos;t have an account yet?
          </Text>
          <Button
            variant="outline"
            colorScheme="green"
            bg={"green.500"}
            color={"black"}
            p={4}
            borderRadius="xl"
            border="1px solid black"
            boxShadow={"2px 2px 0px 0px #000000"}
            _hover={{
              color: "white",
              bg: "green.500",
              borderColor: "green.500",
            }}
            onClick={() => router.push(`/register/${role}`)}
            isDisabled={role === "user" && !registrationStatus.portalRegistrationOpen}
          >
            Register
          </Button>
        </HStack>
      </Flex>

      {/* form */}
      <Flex
        minH="100vh"
        flexDirection={"column"}
        justify="center"
        align="center"
        bg="green.50"
       
      >
        <Heading
          as="h1"
          size="lg"
          fontWeight="bold"
          color="green"
          textAlign="center"
          mb={4}
        >
          {formHeading}
        </Heading>

        <Box
          w={{ base: "90%", md: "400px" }}
          p={8}
          borderRadius="lg"
          bg=" #38A926"
          color="black"
          border="1px solid black"
          boxShadow={"4px 4px 0px 0px #000000"}
        >
          {/* Login form component */}
          {loginForm}

          <Stack spacing={4} mt={6}>
            <Text fontSize="sm" color="black">
              Don&apos;t have an account yet?{" "}
              <Link href={`/register/${role}`} passHref>
                <Button
                  variant="link"
                  colorScheme="green"
                  color="white"
                  _hover={{
                    color: "black",
                    bg: "#D9FAD4",
                    borderColor: "green.500",
                    px: "2",
                    py: "1",
                  }}
                  isDisabled={role === "user" && !registrationStatus.portalRegistrationOpen}
                >
                  Register
                </Button>
              </Link>
            </Text>
            <Text fontSize="sm" color="black">
              Forgot password?{" "}
              <Link href={`/reset-password/${role}`} passHref>
                <Button
                  variant="link"
                  colorScheme="white"
                  color="white"
                  _hover={{
                    color: "black",
                    bg: "#D9FAD4",
                    borderColor: "green.500",
                    px: "2",
                    py: "1",
                  }}
                >
                  Reset
                </Button>
              </Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default LoginAuthLayout;
