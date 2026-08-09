import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  sendResetCode,
  verifyResetCodeAndChangePassword,
  selectAuthLoading,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

const UserResetPasswordForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const loading = useSelector(selectAuthLoading);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    try {
      const result = await dispatch(sendResetCode({ email }));
      if (sendResetCode.fulfilled.match(result)) {
        toast({
          title: "Code Sent",
          description: "A reset code has been sent to your email.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setStep(2);
      } else {
        toast({
          title: "Error",
          description: result.payload?.message || "Failed to send code.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCodeAndPasswordSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!code) errs.code = "Code is required";
    if (!password) errs.password = "Password is required";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords must match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      const result = await dispatch(
        verifyResetCodeAndChangePassword({ email, code, password })
      );
      if (verifyResetCodeAndChangePassword.fulfilled.match(result)) {
        toast({
          title: "Success",
          description: "Password reset successful. Redirecting to login...",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/login/user");
      } else {
        toast({
          title: "Error",
          description: result.payload?.message || "Failed to reset password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={step === 1 ? handleEmailSubmit : handleCodeAndPasswordSubmit}>
      {step === 1 && (
        <FormControl mb={4} isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            color="white"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
      )}
      {step === 2 && (
        <>
          <FormControl mb={4} isInvalid={!!errors.code}>
            <FormLabel>Reset Code</FormLabel>
            <Input
              name="code"
              value={code}
              onChange={e => setCode(e.target.value)}
              color="white"
            />
            <FormErrorMessage>{errors.code}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.password}>
            <FormLabel>New Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              color="white"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              color="white"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
        </>
      )}
      <Button
        type="submit"
        w="full"
        isLoading={loading}
        colorScheme="green"
        bg="#D9FAD4"
        color="black"
      >
        {step === 1 ? "Send Reset Code" : "Reset Password"}
      </Button>
    </form>
  );
};

export default UserResetPasswordForm;