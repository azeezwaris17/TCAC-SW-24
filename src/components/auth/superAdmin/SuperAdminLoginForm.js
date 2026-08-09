import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginSuperAdmin,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SuperAdminLoginForm = ({ role }) => {
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

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const errors = {};
    const { emailOrID, password } = formValues;

    if (!emailOrID) {
      errors.emailOrID = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID) &&
      emailOrID.length < 6
    ) {
      errors.emailOrID = "Invalid Email or ID"; // Customize if necessary
    }

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
      const resultAction = await dispatch(loginSuperAdmin(formValues));

      if (loginSuperAdmin.fulfilled.match(resultAction)) {
        const superAdminData = resultAction.payload;
        
        localStorage.setItem('superAdminToken', superAdminData.token);
        sessionStorage.setItem('superAdminData', JSON.stringify(superAdminData.superAdmin));
        
        toast({
          title: "Success!",
          description: "Login successful. Redirecting to your dashboard...",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        
        router.push('/super-admin/dashboard');
        setFormValues({ emailOrID: "", password: "" });
      } else if (resultAction.meta.requestStatus === "rejected") {
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
              description:
                "Super Admin not found. Please check your credentials.",
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
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isInvalid={formErrors.emailOrID && touched.emailOrID}>
        <FormLabel color={"black"}>Email or ID</FormLabel>
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

      <FormControl mb={4} isInvalid={formErrors.password && touched.password}>
        <FormLabel color={"black"}>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={handleChange}
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
              variant="link"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}  
              color={"white"}  
              _hover={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
              _focus={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
        isLoading={loading}
        loadingText="Processing..."
        colorScheme="green"
        bg="#D9FAD4" 
        color={"black"}  
      >
        Login
      </Button>
    </form>
  );
};

export default SuperAdminLoginForm;
