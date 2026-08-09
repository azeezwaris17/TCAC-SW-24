import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Link,
  Badge,
  Button,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import styles from "@/styles/userDashboard.module.css";

const statusColor = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

const getStatusColor = (status) => {
  const colors = {
    pending: "#ecc94b",
    approved: "#48bb78",
    rejected: "#f56565",
  };
  return colors[status] || "#a0aec0";
};

const PaymentHistoryTable = ({ paymentHistory = [], balance = null, onPrintSlip }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box className={styles.paymentHistorySection}>
      <Box className={styles.paymentHistoryTable}>
        {isMobile ? (
          <div className={styles.mobilePaymentCard}>
            {paymentHistory.map((payment, index) => (
              <div key={index} className={styles.mobilePaymentItem}>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Date</span>
                  <span className={styles.mobilePaymentValue}>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Amount</span>
                  <span className={styles.mobilePaymentValue}>
                    {payment.amount?.toLocaleString()} NGN
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Type</span>
                  <span className={styles.mobilePaymentValue}>
                    {payment.paymentType}
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Camp Type</span>
                  <span className={styles.mobilePaymentValue}>
                    {payment.campType || "-"}
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Status</span>
                  <span className={styles.mobilePaymentStatus} style={{ backgroundColor: `${getStatusColor(payment.status)}20`, color: getStatusColor(payment.status) }}>
                    {payment.status}
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Admin Comment</span>
                  <span className={styles.mobilePaymentValue}>
                    {payment.adminComment || "-"}
                  </span>
                </div>
                <div className={styles.mobilePaymentRow}>
                  <span className={styles.mobilePaymentLabel}>Receipt</span>
                  <span className={styles.mobilePaymentValue}>
                    {payment.receiptUrl ? (
                      <Link href={payment.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>
                        View
                      </Link>
                    ) : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table variant="simple" size="md" className={styles.desktopTable}>
            <Thead>
              <Tr>
                <Th className={styles.tableHeader}>Date</Th>
                <Th className={styles.tableHeader}>Transaction Date</Th>
                <Th className={styles.tableHeader}>Amount</Th>
                <Th className={styles.tableHeader}>Camp Type</Th>
                <Th className={styles.tableHeader}>Receipt</Th>
                <Th className={styles.tableHeader}>Status</Th>
                <Th className={styles.tableHeader}>Admin Comment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paymentHistory.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className={styles.emptyState}>
                    <Text textAlign="center" color="gray.500">No payment history yet.</Text>
                  </Td>
                </Tr>
              ) : (
                paymentHistory.map((item, idx) => (
                  <Tr key={item._id || idx} className={styles.tableRow}>
                    <Td className={styles.tableCell}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</Td>
                    <Td className={styles.tableCell}>{item.transactionDate ? new Date(item.transactionDate).toLocaleString() : "-"}</Td>
                    <Td className={styles.tableCell}>₦{item.amount ? Number(item.amount).toLocaleString() : "-"}</Td>
                    <Td className={styles.tableCell}>{item.campType || "-"}</Td>
                    <Td className={styles.tableCell}>
                      {item.receiptUrl ? (
                        <Link href={item.receiptUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptLink}>View</Link>
                      ) : "-"}
                    </Td>
                    <Td className={styles.tableCell}>
                      <Badge colorScheme={statusColor[item.status] || "gray"} className={styles.statusBadge}>
                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
                      </Badge>
                    </Td>
                    <Td className={styles.tableCell}>{item.adminComment || "-"}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Box>
      {balance === 0 && (
        <Flex justify="center" mt={4}>
          <Button colorScheme="blue" size="sm" onClick={onPrintSlip} className={styles.printButton}>Print Slip</Button>
        </Flex>
      )}
    </Box>
  );
};

export default PaymentHistoryTable;
