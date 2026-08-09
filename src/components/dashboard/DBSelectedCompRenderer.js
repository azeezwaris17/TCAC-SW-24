import React from "react";
import UserDashboard from "./user/UserDashboard";
import ActivitiesManagement from "./admins/admin/ActivitiesManagement";
import MealSchedule from "./MealSchedule";
import DailySchedule from "./DailySchedule";
import PaymentHistory from "./paymentHistory";
import RegisteredAdmins from "./superAdmin/RegisteredAdmins";
import RegisteredUsers from "./RegisteredUsers";
import RegTeamComponent from "./RegTeamComp";
import HealthTeamComponent from "./HealthTeamComp";
import MealManagement from "./admins/admin/MealManagement";
import DaysManagement from "./admins/admin/DaysManagement";
import AdminPaymentApprovalTable from "./admins/admin/AdminPaymentApprovalTable";
import SlipManagement from "./admins/admin/SlipManagement";
import Settings from "./superAdmin/Settings";
import PaymentRequestManagement from "./superAdmin/PaymentRequestManagement";
import PostManagement from "./admins/admin/PostManagement";

const DashboardSelectedComponentRenderer = ({
  role,
  accountData,
  adminFunction,
  selectedComponent,
}) => {
  const renderComponent = () => {
    if (role === "User") {
      switch (selectedComponent) {
        case "dashboard":
          return <UserDashboard accountData={accountData}/>;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <UserDashboard accountData={accountData}/>;
      }
    }

    if (role === "Admin") {
      switch (adminFunction) {
        case "reg_team_lead":
          return (
            <>
              {selectedComponent === "registered-users" ? (
                <RegisteredUsers accountData={accountData}/>
              ) : selectedComponent === "meal-schedule" ? (
                <MealSchedule />
              ) : (
                <RegisteredUsers accountData={accountData}/>
              )}
            </>
          );
        case "health_team_lead":
          return (
            <>
              {selectedComponent === "meal-schedule" ? (
                <MealSchedule />
              ) : selectedComponent === "daily-schedule" ? (
                <DailySchedule />
              ) : (
                <DailySchedule />
              )}
            </>
          );
        case "admin":
          return (
            <>
              {selectedComponent === "registered-users" ? (
                <RegisteredUsers accountData={accountData}/>
              ) : selectedComponent === "daily-schedule" ? (
                <DailySchedule />
              ) : selectedComponent === "meal-management" ? (
                <MealManagement />
              ) : selectedComponent === "activities-management" ? (
                <ActivitiesManagement />
              ) : selectedComponent === "post-management" ? (
                <PostManagement />
              ) : selectedComponent === "days-management" ? (
                <DaysManagement />
              ) : selectedComponent === "payment-management" ? (
                <AdminPaymentApprovalTable />
              ) : selectedComponent === "slip-management" ? (
                <SlipManagement />
              ) : (
                <RegisteredUsers accountData={accountData}/>
              )}
            </>
          );
        default:
          return <RegisteredUsers />;
      }
    }

    if (role === "Super Admin") {
      switch (selectedComponent) {
        case "registered-users":
          return <RegisteredUsers accountData={accountData}/>;
        case "registered-admins":
          return <RegisteredAdmins accountData={accountData}/>;
        case "activities-management":
          return <ActivitiesManagement />;
        case "meal-management":
          return <MealManagement />;
        case "post-management":
          return <PostManagement />;
        case "days-management":
          return <DaysManagement />;
        case "payment-management":
          return <AdminPaymentApprovalTable />;
        case "slip-management":
          return <SlipManagement />;
        case "settings":
          return <Settings accountData={accountData} />;
        case "payment-requests":
          return <PaymentRequestManagement />;
        default:
          return <RegisteredUsers accountData={accountData}/>;
      }
    }
  };

  return <>{renderComponent()}</>;
};

export default DashboardSelectedComponentRenderer;