import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginUser,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorMessage,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PaymentRequestModal from "../../dashboard/user/PaymentRequestModal";

const UserLoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({ emailOrID: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Payment deadline states
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [showPaymentBlockedModal, setShowPaymentBlockedModal] = useState(false);
  const [blockedUser, setBlockedUser] = useState(null);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setPaymentSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    }
  };

  const checkPaymentDeadline = (user) => {
    // Check deadline regardless of portal status
    if (!paymentSettings || !paymentSettings.paymentDeadline) {
      return false; // No deadline set, allow access
    }

    const now = new Date();
    const deadline = new Date(paymentSettings.paymentDeadline);

    // Check if deadline has passed and user has outstanding balance
    // Allow access if user has approved payment request, otherwise block
    if (now >= deadline && user.balance > 0 && 
        !user.paymentAccessGranted && 
        user.paymentRequestStatus !== "approved") {
      return true; // User should be blocked (no approved request)
    }

    return false; // User can access
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const errors = {};
    const { emailOrID, password } = formValues;

    // Validate emailOrID
    if (!emailOrID) {
      errors.emailOrID = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID) &&
      emailOrID.length < 6
    ) {
      errors.emailOrID = "Invalid Email or ID";
    }

    // Validate password
    if (!password) {
      errors.password = "Required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(loginUser(formValues));

      console.log("login result action:", resultAction);

      if (loginUser.fulfilled.match(resultAction)) {
        // Successful login
        const { token, user } = resultAction.payload;

        console.log("Authenticated user data:", { user, token });

        const role = user.role.toLowerCase();

        if (user.registrationStatus === "pending") {
          toast({
            title: "Pending Approval",
            description: "Your account is pending approval. Please check back later.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else if (user.registrationStatus === "rejected") {
          toast({
            title: "Registration Rejected",
            description: "Your account has been rejected. Please contact support or re-register.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          // Check payment deadline
          if (checkPaymentDeadline(user)) {
            setBlockedUser(user);
            setShowPaymentBlockedModal(true);
            return;
          }

          toast({
            title: "Success!",
            description: "Login successful. Redirecting to your dashboard...",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          router.push(`/${role}/dashboard`);

          setFormValues({ emailOrID: "", password: "" });
        }
      } else if (resultAction.meta.requestStatus === "rejected") {
        // Handle different status codes based on the meta.response object
        const { statusCode, message } = resultAction.payload || {};

        switch (statusCode) {
          case 400:
            toast({
              title: "Bad Request",
              description: "Email or ID and password are required.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            break;
          case 401:
            toast({
              title: "Unauthorized",
              description: "Invalid credentials. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            break;
          case 404:
            toast({
              title: "Not Found",
              description: "User not found. Please check your credentials.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            break;
          case 500:
            toast({
              title: "Server Error",
              description:
                "An unexpected error occurred. Please try again later.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            break;
          default:
            toast({
              title: "Error",
              description: message || "An error occurred. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isInvalid={formErrors.emailOrID && touched.emailOrID}>
          <FormLabel>Email or ID</FormLabel>
          <Input
            name="emailOrID"
            type="text"
            value={formValues.emailOrID}
            onChange={handleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, emailOrID: true }))}
            color={"white"}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "#D9FAD4",
              transition: "border-color 0.3s ease",
            }}
          />
          <FormErrorMessage>{formErrors.emailOrID}</FormErrorMessage>
        </FormControl>

        <FormControl mb={6} isInvalid={formErrors.password && touched.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              color={"white"}
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "#D9FAD4",
                transition: "border-color 0.3s ease",
              }}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                color="white"
                _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{formErrors.password}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="green"
          width="100%"
          isLoading={loading}
          loadingText="Logging in..."
          color="black"
          _hover={{
            bg: "#D9FAD4",
            color: "black",
          }}
        >
          Login
        </Button>
      </form>

      {/* Payment Blocked Modal */}
      <Modal isOpen={showPaymentBlockedModal} onClose={() => setShowPaymentBlockedModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Required</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  You have an outstanding balance of <strong>₦{blockedUser?.balance?.toLocaleString()}</strong>. 
                  The payment deadline has passed.
                  {blockedUser?.paymentRequestStatus === "pending" && (
                    <Text mt={2}>
                      Your payment access request is pending review. Please wait for an administrator to review your request.
                    </Text>
                  )}
                  {blockedUser?.paymentRequestStatus === "rejected" && (
                    <Text mt={2}>
                      Your payment access request was rejected. Please contact an administrator for assistance.
                    </Text>
                  )}
                  {(!blockedUser?.paymentRequestStatus || blockedUser?.paymentRequestStatus === "revoked") && (
                    <Text mt={2}>
                      Please contact an administrator to request payment access.
                    </Text>
                  )}
                </Text>
              </Alert>

              <Text fontSize="sm" color="gray.600">
                {paymentSettings?.paymentClosedMessage || "Payment portal has been closed. Please contact administrator for assistance."}
              </Text>

              <Button
                colorScheme="blue"
                onClick={() => {
                  setShowPaymentBlockedModal(false);
                  setBlockedUser(null);
                }}
              >
                Close
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Payment Request Modal */}
      <PaymentRequestModal
        isOpen={showPaymentBlockedModal}
        onClose={() => {
          setShowPaymentBlockedModal(false);
          setBlockedUser(null);
        }}
        balance={blockedUser?.balance}
        userId={blockedUser?._id}
      />
    </>
  );
};

export default UserLoginForm;
