import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Text,
  IconButton,
  Textarea,
  useToast,
  Select,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PaymentForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  const [formValues, setFormValues] = useState({
    paymentType: "Full Payment",
    campType: "Camp Only",
    amount: "7000",
    receipt: "",
    paymentNarration: "",
  });
  const [minimumAmountRequired, setMinimumAmountRequired] = useState(7000);
  const [formErrors, setFormErrors] = useState({});
  const [blobDetails, setBlobDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef(null);
  const toast = useToast();

  const bankAccountDetails = {
    accountName: "Timsan southwest",
    accountNumber: "2283452778",
    bank: "UBA",
  };

  // Calculate amount based on camp type and user category
  const calculateAmount = (campType, userCategory, paymentType) => {
    if (userCategory === "Child") {
      // Children only get Camp Only option with 50% discount
      return "4000";
    }
    
    switch (campType) {
      case "Camp Only":
        return "7000"; // Fixed amount
      case "Conference Only":
        if (paymentType === "Installmental") {
          return ""; // User will select from dropdown
        }
        return "35000"; // Full payment
      case "Camp + Conference":
        if (paymentType === "Installmental") {
          return ""; // User will select from dropdown
        }
        return "42000"; // Full payment for Camp + Conference (₦7,000 + ₦35,000)
      default:
        return "7000";
    }
  };

  // Calculate minimum amount based on camp type and user category
  const calculateMinimumAmount = (campType, userCategory, paymentType) => {
    if (userCategory === "Child") {
      return 4000;
    }
    
    switch (campType) {
      case "Camp Only":
        return 7000; // Fixed amount
      case "Conference Only":
        if (paymentType === "Installmental") {
          return 5000; // Minimum installmental
        }
        return 35000; // Full payment
      case "Camp + Conference":
        if (paymentType === "Installmental") {
          return 5000; // Minimum installmental
        }
        return 42000; // Full payment for Camp + Conference (₦7,000 + ₦35,000)
      default:
        return 7000;
    }
  };

  // Get available camp types based on user category
  const getAvailableCampTypes = (userCategory) => {
    if (userCategory === "Child") {
      return [
        { value: "Camp Only", label: "Camp Only - ₦4,000" }
      ];
    }
    
    return [
      { value: "Camp Only", label: "Camp Only - ₦7,000" },
      { value: "Conference Only", label: "Conference Only - ₦35,000" },
      { value: "Camp + Conference", label: "Camp + Conference - ₦42,000" }
    ];
  };

  useEffect(() => {
    const newAmount = calculateAmount(formValues.campType, prevFormValues?.userCategory, formValues.paymentType);
    const newMinimum = calculateMinimumAmount(formValues.campType, prevFormValues?.userCategory, formValues.paymentType);
    
    setFormValues(prev => ({
      ...prev,
      amount: newAmount
    }));
    setMinimumAmountRequired(newMinimum);
  }, [formValues.campType, formValues.paymentType, prevFormValues?.userCategory]);

  const handleCampTypeChange = (e) => {
    const newCampType = e.target.value;
    const newAmount = calculateAmount(newCampType, prevFormValues?.userCategory, formValues.paymentType);
    const newMinimum = calculateMinimumAmount(newCampType, prevFormValues?.userCategory, formValues.paymentType);
    
    setFormValues(prev => ({
      ...prev,
      campType: newCampType,
      amount: newAmount
    }));
    setMinimumAmountRequired(newMinimum);
  };

  const handlePaymentTypeChange = (e) => {
    const newPaymentType = e.target.value;
    const newAmount = calculateAmount(formValues.campType, prevFormValues?.userCategory, newPaymentType);
    const newMinimum = calculateMinimumAmount(formValues.campType, prevFormValues?.userCategory, newPaymentType);
    
    setFormValues(prev => ({
      ...prev,
      paymentType: newPaymentType,
      amount: newAmount
    }));
    setMinimumAmountRequired(newMinimum);
  };

  const handleAmountChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      amount: e.target.value
    }));
  };

  const handleCopyToClipboard = (text, label) => {
    toast({
      title: `${label} copied to clipboard!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formValues.paymentType)
      validationErrors.paymentType = "Payment type is required";
    if (!formValues.campType)
      validationErrors.campType = "Camp type is required";
    if (
      !formValues.amount ||
      parseInt(formValues.amount) < minimumAmountRequired
    )
      validationErrors.amount = `Minimum amount is ₦${minimumAmountRequired}`;
    if (!formValues.receipt)
      validationErrors.receipt = "Receipt upload is required";

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const file = inputFileRef.current.files[0];
      if (!file) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("File upload failed");
      }

      const result = await response.json();
      const { url } = result;

      setBlobDetails({ url });

      const mergedValues = {
        role,
        ...values,
        ...prevFormValues,
        ...formValues,
        receiptUrl: url,
      };

      onValuesChange(mergedValues);
      onNext(mergedValues);
      toast({
        title: "Success",
        description: "Payment data updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFileClick = () => {
    inputFileRef.current.click();
  };

  const availableCampTypes = getAvailableCampTypes(prevFormValues?.userCategory);

  return (
    <form onSubmit={handleFormSubmit}>
      <Box display={"flex"} flexDirection={"column"} gap={6}>
        <Flex
          flexDirection={"column"}
          gap={4}
          bg="gray.100"
          p={4}
          borderRadius="md"
        >
          <Text fontWeight="bold" mb={2}>
            Bank Account Details
          </Text>

          <Stack spacing={6}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Name:</strong> {bankAccountDetails.accountName}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountName}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountName,
                    "Account Name"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Name"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Number:</strong>{" "}
                {bankAccountDetails.accountNumber}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountNumber}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountNumber,
                    "Account Number"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Number"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Bank:</strong> {bankAccountDetails.bank}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.bank}
                onCopy={() =>
                  handleCopyToClipboard(bankAccountDetails.bank, "Bank")
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Bank"
                />
              </CopyToClipboard>
            </Box>
          </Stack>
        </Flex>

        <FormControl id="paymentType" isInvalid={!!formErrors.paymentType}>
          <FormLabel>Mode of Payment</FormLabel>
          <Select
            value={formValues.paymentType}
            onChange={handlePaymentTypeChange}
            placeholder="Select payment type"
          >
            <option value="Full Payment">Full Payment</option>
            {(formValues.campType === "Conference Only" || formValues.campType === "Camp + Conference") && (
              <option value="Installmental">Installmental</option>
            )}
          </Select>
          {formErrors.paymentType && (
            <Text color="red.500" fontSize="sm">
              {formErrors.paymentType}
            </Text>
          )}
        </FormControl>

        <FormControl id="campType" isInvalid={!!formErrors.campType}>
          <FormLabel>What part of the Camp/Conference?</FormLabel>
          <Select
            value={formValues.campType}
            onChange={handleCampTypeChange}
            placeholder="Select camp type"
          >
            {availableCampTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          {formErrors.campType && (
            <Text color="red.500" fontSize="sm">
              {formErrors.campType}
            </Text>
          )}
        </FormControl>

        <FormControl id="amount" isInvalid={!!formErrors.amount}>
          <FormLabel>Amount</FormLabel>
          {formValues.paymentType === "Installmental" && (formValues.campType === "Conference Only" || formValues.campType === "Camp + Conference") ? (
            <Select
              value={formValues.amount}
              onChange={handleAmountChange}
              placeholder="Select amount"
            >
              <option value="5000">₦5,000</option>
              <option value="10000">₦10,000</option>
              <option value="20000">₦20,000</option>
            </Select>
          ) : (
            <Input 
              value={formValues.amount} 
              onChange={handleAmountChange}
              placeholder="Enter amount"
              readOnly={true}
              bg="gray.100"
            />
          )}
          {formErrors.amount && (
            <Text color="red.500" fontSize="sm">
              {formErrors.amount}
            </Text>
          )}
        </FormControl>

        <FormControl id="receipt" isInvalid={!!formErrors.receipt}>
          <FormLabel>Upload Payment Receipt</FormLabel>
          <InputGroup>
            <Input
              type="text"
              value={formValues.receipt ? formValues.receipt.name : ""}
              placeholder="No file chosen"
              readOnly
              bg="white"
              cursor="pointer"
            />
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  receipt: e.target.files[0],
                }))
              }
            />
            <InputRightElement width="auto" pr={2}>
              <Button
                leftIcon={<MdAttachFile />}
                colorScheme="green"
                size="sm"
                onClick={handleChooseFileClick}
                borderRadius="md"
              >
                Choose File
              </Button>
            </InputRightElement>
          </InputGroup>
          {formErrors.receipt && (
            <Text color="red.500" fontSize="sm">
              {formErrors.receipt}
            </Text>
          )}
        </FormControl>

        <FormControl id="paymentNarration">
          <FormLabel>Payment Narration (Optional)</FormLabel>
          <Textarea
            value={formValues.paymentNarration}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                paymentNarration: e.target.value,
              }))
            }
            placeholder="Enter any additional details for this payment"
          />
        </FormControl>

        <Stack direction="row" spacing={4} mt={4}>
          <Button type="button" colorScheme="gray" onClick={onPrevious}>
            Back
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Processing..."
            colorScheme="green"
          >
            Next
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default PaymentForm;