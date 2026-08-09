import React, { forwardRef } from "react";
import { Box, Heading, Text, Divider, Flex, Image, VStack, HStack } from "@chakra-ui/react";

const PaymentSlip = forwardRef(({ user, payments, slipCode }, ref) => {
  const totalApprovedPaid = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <Box
      ref={ref}
      className="timsan-slip-bg"
      bg="white"
      color="black"
      p={8}
      maxW="700px"
      m="auto"
      position="relative"
      overflow="hidden"
    >
      <Box position="relative" zIndex={1}>
        <Flex align="center" justify="center" mb={2}>
          <Image
            src="/images/timsan-logo.png"
            alt="TIMSAN Logo"
            boxSize="48px"
            mr={3}
          />
          <Heading size="lg" textAlign="center">
            TIMSAN Camp and Conference 2025 (TCAC &apos;25)
          </Heading>
        </Flex>
        <Text textAlign="center" fontWeight="bold" mb={4}>
          PAYMENT SLIP
        </Text>
        <Divider mb={4} />
        
        {/* Personal Information with Profile Picture */}
        <HStack spacing={6} align="flex-start" mb={4}>
          {/* Profile Picture */}
          <Box flexShrink={0}>
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile Picture"
                boxSize="120px"
                borderRadius="md"
                objectFit="cover"
                border="2px solid"
                borderColor="gray.300"
                bg="gray.100"
                crossOrigin="anonymous"
                loading="eager"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box
                boxSize="120px"
                borderRadius="md"
                border="2px solid"
                borderColor="gray.300"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="lg" color="gray.500" fontWeight="bold">
                  {user?.firstName?.charAt(0) || "U"}
                  {user?.lastName?.charAt(0) || ""}
                </Text>
              </Box>
            )}
          </Box>
          
          {/* Personal Details */}
          <VStack spacing={2} align="flex-start" flex={1}>
            <Text><b>Name:</b> {user?.firstName} {user?.lastName}</Text>
            <Text><b>Reg No.:</b> {user?.userID}</Text>
            <Text><b>Category:</b> {user?.userCategory}</Text>
            <Text><b>Gender:</b> {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "-"}</Text>
            <Text><b>Institution (Local Zawiyyah):</b> {user?.institution || user?.otherInstitution || "-"}</Text>
            <Text><b>State Affiliated:</b> {user?.state || user?.otherState || "-"}</Text>
            <Text><b>Camp Type:</b> {user?.campType}</Text>
            <Text><b>Phone Number:</b> {user?.phoneNumber}</Text>
            <Text><b>Email:</b> {user?.email}</Text>
          </VStack>
        </HStack>
        
        <Divider my={4} />
        <Text fontWeight="bold" mb={2}>Payment Details</Text>
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            marginBottom: "16px"
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>Date</th>
              <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>Amount</th>
              <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>Type</th>
              <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>Camp Type</th>
              <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</td>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{p.amount?.toLocaleString() || "-"}</td>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{p.paymentType || "-"}</td>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{p.campType || "-"}</td>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{p.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Text>
          <b>Total Paid:</b> {totalApprovedPaid.toLocaleString()} NGN
        </Text>
        <Text>
          <b>Balance:</b> {user?.balance?.toLocaleString() || "0"} NGN
        </Text>
        <Box mt={10} mb={2} textAlign="center">
          <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing={2}>
            {slipCode}
          </Text>
        </Box>
        <Divider my={4} />
        <Text fontSize="sm" textAlign="center" mt={8}>
          &copy; 2025, TIMSAN Southwest. All rights reserved.
        </Text>
        <Text fontSize="sm" textAlign="center" mt={4} fontWeight="bold" color="red.600">
          A copy of this slip should be submitted at the Camp registration Desk For Physical Confirmation
        </Text>
      </Box>
    </Box>
  );
});

PaymentSlip.displayName = 'PaymentSlip';

export default PaymentSlip;