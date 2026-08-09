import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import RegisterAuthLayout from "../../layouts/auth/RegisterAuthLayout";
import AdminRegAuthLayout from "../../layouts/auth/AdminRegAuthLayout";

// user-specific form components
import PersonalInformationForm from "../../components/auth/user/register/PersonalInformationForm";
import CACForm from "../../components/auth/user/register/CACForm";
import MedicalConditionForm from "@/components/auth/user/register/MedicalConditionForm";
import PasswordCreationForm from "../../components/auth/user/register/PasswordCreationForm";
import PaymentForm from "../../components/auth/user/register/PaymentForm";

// admin-specific form component
import AdminRegistrationForm from "../../components/auth/admin/AdminRegistrationForm";

// super-admin-specific form component
import SuperAdminRegistrationForm from "../../components/auth/superAdmin/SuperAdminRegistrationForm";

const Register = () => {
  const router = useRouter();
  const { role = "user" } = router.query; // Capture the role from the URL
  const [step, setStep] = useState(0);
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

  // State to hold user registration form values
  const [formValues, setFormValues] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      profilePicture: "",
    },
    CAC: {
      userCategory: "Student",
      institution: "",
      state: "",
      otherInstitution: "",
      graduationYear: "",
      otherState: "",
      guardianName: "",
      guardianPhone: "",
      guardianAddress: "",
      nonTimsaniteInstitution: "",
      nonTimsaniteState: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",
    },
    medicalCondition: {
      medicalCondition: "",
      conditionDetails: "",
    },
    payment: {
      paymentType: "Full Payment",
      campType: "Camp Only",
      amount: 5000,
      receipt: null,
    },
    password: {
      password: "",
      confirmPassword: "",
    },
    role,
  });

  // Function to handle moving to the next step
  const handleNext = (mergedValues) => {
    console.log("Merged Values:", mergedValues);
    setFormValues((prevValues) => ({
      ...prevValues,
      ...mergedValues,
    }));
    setStep((prevStep) => prevStep + 1); // Move to the next step
  };

  // Function to handle going back to the previous step
  const handlePrevious = (previousValues) => {
    console.log("Previous Values:", previousValues); // Debugging
    setFormValues((prevValues) => ({
      ...prevValues,
      ...previousValues,
    }));
    setStep((prevStep) => prevStep - 1); // Move to the previous step
  };

  // Calculate all previous values based on the current step
  const getPreviousValues = () => {
    switch (step) {
      case 0:
        return {}; // No previous values at the first step
      case 1:
        return formValues.personalInfo;
      case 2:
        return {
          ...formValues.personalInfo,
          ...formValues.CAC,
        };
      case 3:
        return {
          ...formValues.personalInfo,
          ...formValues.CAC,
          ...formValues.medicalCondition,
        };
      case 4:
        return {
          ...formValues.personalInfo,
          ...formValues.CAC,
          ...formValues.medicalCondition,
          ...formValues.payment,
        };
      default:
        return {};
    }
  };

  const renderUserRegistrationForm = () => {
    // If registration is closed, show message
    if (!registrationStatus.portalRegistrationOpen) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#856404', marginBottom: '20px' }}>
            Registration Closed
          </h2>
          <p style={{ color: '#856404', fontSize: '16px' }}>
            {registrationStatus.registrationMessage}
          </p>
          <p style={{ color: '#856404', fontSize: '14px', marginTop: '20px' }}>
            Please contact the administrator for more information.
          </p>
        </div>
      );
    }

    return (
      <>
        {step === 0 && (
          <PersonalInformationForm
            role={role}
            values={formValues.personalInfo}
            onValuesChange={(newValues) =>
              setFormValues((prev) => ({ ...prev, personalInfo: newValues }))
            }
            onNext={handleNext}
          />
        )}
        {step === 1 && (
          <CACForm
            role={role}
            values={formValues.CAC}
            onValuesChange={(newValues) =>
              setFormValues((prev) => ({ ...prev, CAC: newValues }))
            }
            onPrevious={() => handlePrevious(formValues.personalInfo)} // Pass previous form values
            onNext={handleNext}
            prevFormValues={formValues.personalInfo} // Pass previous form values
          />
        )}
        {step === 2 && (
          <MedicalConditionForm
            values={formValues.medicalCondition}
            role={role}
            onValuesChange={(newValues) =>
              setFormValues((prev) => ({
                ...prev,
                medicalCondition: newValues,
              }))
            }
            onNext={handleNext}
            onPrevious={() =>
              handlePrevious({
                ...formValues.personalInfo,
                ...formValues.CAC,
              })
            }
            prevFormValues={getPreviousValues()} // Pass combined previous form values
          />
        )}
        {step === 3 && (
          <PaymentForm
            values={formValues.payment}
            role={role}
            onValuesChange={(newValues) =>
              setFormValues((prev) => ({ ...prev, payment: newValues }))
            }
            onNext={handleNext}
            onPrevious={() =>
              handlePrevious({
                ...formValues.personalInfo,
                ...formValues.CAC,
                ...formValues.medicalCondition,
              })
            }
            prevFormValues={getPreviousValues()}
          />
        )}
        {step === 4 && (
          <PasswordCreationForm
            values={formValues.password}
            role={role}
            onValuesChange={(newValues) =>
              setFormValues((prev) => ({ ...prev, password: newValues }))
            }
            onPrevious={() =>
              handlePrevious({
                ...formValues.personalInfo,
                ...formValues.CAC,
                ...formValues.medicalCondition,
                ...formValues.payment,
              })
            }
            prevFormValues={getPreviousValues()}
          />
        )}
      </>
    );
  };

  const renderAdminRegistrationForm = () => (
    <AdminRegistrationForm role={role} />
  );

  const renderSuperAdminRegistrationForm = () => (
    <SuperAdminRegistrationForm role={role} />
  );

  const renderRoleBasedContent = () => {
    switch (role) {
      case "user":
        return renderUserRegistrationForm();
      case "admin":
        return renderAdminRegistrationForm();
      case "super-admin":
        return renderSuperAdminRegistrationForm();
      default:
        return renderUserRegistrationForm();
    }
  };

  const isAdminOrSuperAdmin = role === "admin" || role === "super-admin";

  // Show loading state
  if (registrationStatus.loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <Center>
          <Spinner size="lg" color="green.500" />
        </Center>
      </div>
    );
  }

  return isAdminOrSuperAdmin ? (
    <AdminRegAuthLayout
      formHeading={`Register as ${role}`}
      registrationForm={renderRoleBasedContent()}
      role={role}
    />
  ) : (
    <RegisterAuthLayout currentStep={step} setStep={setStep} role={role}>
      {renderRoleBasedContent()}
    </RegisterAuthLayout>
  );
};

export default Register;
