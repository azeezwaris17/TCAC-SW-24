import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as Yup from "yup";
import {
  loginUser,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";

const UserLoginForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Clear status on component mount
  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: "Success!",
        description: "Login successful. Redirecting to your dashboard...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/dashboard/${role}`);
    } else if (status === "failed") {
      toast({
        title: "Error!",
        description: error?.message || "Login failed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validateForm = () => {
    const validationErrors = {};
    const { email, password } = formValues;

    if (!email) validationErrors.email = "Required";
    else if (!Yup.string().email().isValidSync(email)) validationErrors.email = "Invalid email address";

    if (!password) validationErrors.password = "Required";
    else if (password.length < 8) validationErrors.password = "Password must be at least 8 characters";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(loginUser({ ...formValues, role }));
      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        if (userData.registrationStatus === "pending") {
          toast({
            title: "Pending Approval",
            description: "Your account is pending approval. Please check back later.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else if (userData.registrationStatus === "rejected") {
          toast({
            title: "Registration Rejected",
            description: "Your account has been rejected. Please contact support or re-register.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          // Successful login
          router.push(`/dashboard/${role}`);
        }
      } else {
        console.log("Error: ", resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isInvalid={!!errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          placeholder="Enter your email"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.password}>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          placeholder="Enter your password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
      </FormControl>

      <Button
        type="submit"
        w="full"
        colorScheme="green"
        isLoading={loading}
      >
        Login
      </Button>
    </form>
  );
};

export default UserLoginForm;
