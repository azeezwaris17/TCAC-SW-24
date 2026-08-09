import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  HStack,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Divider,
  Spinner,
  Center,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaCog, FaSave } from "react-icons/fa";

const Settings = ({ accountData }) => {
  const [settings, setSettings] = useState({
    portalRegistrationOpen: true,
    registrationMessage: "Portal Has Been Closed For Registration",
    paymentDeadline: null,
    paymentPortalOpen: true,
    paymentClosedMessage: "Payment portal has been closed. Please contact administrator for assistance.",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } else {
        // If no settings exist, create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portalRegistrationOpen: true,
          registrationMessage: "Portal Has Been Closed For Registration",
          paymentDeadline: null,
          paymentPortalOpen: true,
          paymentClosedMessage: "Payment portal has been closed. Please contact administrator for assistance.",
          updatedBy: accountData?.superAdminID || "System",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error creating default settings:", error);
    }
  };

  const handleToggleRegistration = async () => {
    try {
      setSaving(true);
      const newSettings = {
        ...settings,
        portalRegistrationOpen: !settings.portalRegistrationOpen,
        updatedBy: accountData?.superAdminID || "System",
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        toast({
          title: "Success",
          description: `Portal registration ${newSettings.portalRegistrationOpen ? "opened" : "closed"} successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePayment = async () => {
    try {
      setSaving(true);
      const newSettings = {
        ...settings,
        paymentPortalOpen: !settings.paymentPortalOpen,
        updatedBy: accountData?.superAdminID || "System",
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        toast({
          title: "Success",
          description: `Payment portal ${newSettings.paymentPortalOpen ? "opened" : "closed"} successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePaymentSettings = async () => {
    try {
      setSaving(true);
      const newSettings = {
        ...settings,
        updatedBy: accountData?.superAdminID || "System",
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        toast({
          title: "Success",
          description: "Payment settings updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box p={8}>
        <Center>
          <Spinner size="lg" color="green.500" />
        </Center>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={4} mb={2}>
            <FaCog size={24} />
            <Heading size="lg">Portal Settings</Heading>
          </HStack>
          <Text color="gray.600">
            Manage portal configuration and registration settings
          </Text>
        </Box>

        {/* Registration Settings Card */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={2}>
                  Registration Settings
                </Heading>
                <Text color="gray.600">
                  Control whether users can register for the portal
                </Text>
              </Box>

              <Divider />

              <FormControl>
                <HStack justify="space-between" align="center">
                  <Box>
                    <FormLabel fontSize="lg" fontWeight="semibold">
                      Portal Registration
                    </FormLabel>
                    <FormHelperText>
                      {settings.portalRegistrationOpen
                        ? "Users can currently register for the portal"
                        : "Registration is currently closed"}
                    </FormHelperText>
                  </Box>
                  <Switch
                    isChecked={settings.portalRegistrationOpen}
                    onChange={handleToggleRegistration}
                    isDisabled={saving}
                    size="lg"
                    colorScheme="green"
                  />
                </HStack>
              </FormControl>

              {/* Status Alert */}
              <Alert
                status={settings.portalRegistrationOpen ? "success" : "warning"}
                variant="subtle"
                borderRadius="md"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {settings.portalRegistrationOpen
                      ? "Registration Open"
                      : "Registration Closed"}
                  </AlertTitle>
                  <AlertDescription>
                    {settings.portalRegistrationOpen
                      ? "Users can register for the portal. Admins and Super Admins can still register regardless of this setting."
                      : settings.registrationMessage}
                  </AlertDescription>
                </Box>
              </Alert>

              {/* Additional Info */}
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  <strong>Note:</strong> When registration is closed, only regular users
                  will be blocked from registering. Admins and Super Admins can still
                  register regardless of this setting.
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Payment Settings Card */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" mb={2}>
                  Payment Settings
                </Heading>
                <Text color="gray.600">
                  Control payment portal access and deadline management
                </Text>
              </Box>

              <Divider />

              <FormControl>
                <HStack justify="space-between" align="center">
                  <Box>
                    <FormLabel fontSize="lg" fontWeight="semibold">
                      Payment Portal
                    </FormLabel>
                    <FormHelperText>
                      {settings.paymentPortalOpen
                        ? "Users can currently make payments"
                        : "Payment portal is currently closed"}
                    </FormHelperText>
                  </Box>
                  <Switch
                    isChecked={settings.paymentPortalOpen}
                    onChange={handleTogglePayment}
                    isDisabled={saving}
                    size="lg"
                    colorScheme="green"
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Payment Deadline</FormLabel>
                <Input
                  type="datetime-local"
                  value={settings.paymentDeadline ? new Date(settings.paymentDeadline).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentDeadline: e.target.value ? new Date(e.target.value).toISOString() : null
                  }))}
                  isDisabled={saving}
                />
                <FormHelperText>
                  Set a deadline for payments. After this time, users with outstanding balance will be locked out.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Payment Closed Message</FormLabel>
                <Textarea
                  value={settings.paymentClosedMessage}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    paymentClosedMessage: e.target.value
                  }))}
                  placeholder="Message shown to users when payment portal is closed"
                  rows={3}
                  isDisabled={saving}
                />
                <FormHelperText>
                  This message will be shown to users when they try to access payment features after the deadline.
                </FormHelperText>
              </FormControl>

              <Button
                leftIcon={<FaSave />}
                colorScheme="blue"
                onClick={handleUpdatePaymentSettings}
                isLoading={saving}
                loadingText="Saving..."
              >
                Save Payment Settings
              </Button>

              {/* Status Alert */}
              <Alert
                status={settings.paymentPortalOpen ? "success" : "warning"}
                variant="subtle"
                borderRadius="md"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {settings.paymentPortalOpen
                      ? "Payment Portal Open"
                      : "Payment Portal Closed"}
                  </AlertTitle>
                  <AlertDescription>
                    {settings.paymentPortalOpen
                      ? "Users can make payments. After the deadline, users with outstanding balance will be locked out."
                      : settings.paymentClosedMessage}
                  </AlertDescription>
                </Box>
              </Alert>

              {settings.paymentDeadline && (
                <Box p={4} bg="orange.50" borderRadius="md">
                  <Text fontSize="sm" color="orange.700">
                    <strong>Payment Deadline:</strong> {new Date(settings.paymentDeadline).toLocaleString()}
                  </Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Last Updated Info */}
        <Box p={4} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.700">
            <strong>Last Updated:</strong> {new Date(settings.updatedAt).toLocaleString()}
            <br />
            <strong>Updated By:</strong> {settings.updatedBy}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Settings; 