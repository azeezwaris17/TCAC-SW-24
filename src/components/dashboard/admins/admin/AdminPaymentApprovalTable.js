import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Link, Badge, Button, Input, Select, useToast, Spinner, HStack, VStack, Flex } from "@chakra-ui/react";

const statusColor = { pending: "yellow", approved: "green", rejected: "red" };

function truncateName(name) { if (!name) return "-"; return name.length > 15 ? name.slice(0, 15) + "..." : name; }

const ITEMS_PER_PAGE = 10;

const AdminPaymentApprovalTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [adminComments, setAdminComments] = useState({});
  const [statusUpdates, setStatusUpdates] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allPayments, setAllPayments] = useState([]); // Store all payments for counts
  const toast = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      
      const url = `/api/admin/payments${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : data.payments || []);
    } catch {
      setPayments([]);
    }
    setLoading(false);
  };

  // Fetch all payments for status counts
  const fetchAllPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      setAllPayments(Array.isArray(data) ? data : data.payments || []);
    } catch {
      setAllPayments([]);
    }
  };

  useEffect(() => { 
    fetchPayments(); 
    fetchAllPayments(); // Fetch all payments for counts
  }, [statusFilter, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  const handleCommentChange = (id, value) => setAdminComments(prev => ({ ...prev, [id]: value }));
  const handleStatusChange = (id, value) => setStatusUpdates(prev => ({ ...prev, [id]: value }));

  const handleAction = async id => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    const payment = payments.find(p => p._id === id);
    const status = statusUpdates[id];
    const adminComment = adminComments[id] || "";
    try {
      const res = await fetch("/api/admin/update-payment-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: id, status, adminComment, userId: payment.userId?._id || payment.userId, amount: payment.amount }) });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Payment updated", status: "success", duration: 3000, isClosable: true });
        fetchPayments();
        fetchAllPayments(); // Refresh counts
      } else {
        toast({ title: "Error", description: data.error || "Failed to update payment", status: "error", duration: 4000, isClosable: true });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update payment", status: "error", duration: 4000, isClosable: true });
    }
    setActionLoading(prev => ({ ...prev, [id]: false }));
  };

  const getFullName = user => {
    if (!user) return "-";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return truncateName(`${firstName} ${lastName}`.trim());
  };

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const paginatedPayments = payments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalAmount = payments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Get counts for each status from all payments
  const statusCounts = {
    all: allPayments.length,
    pending: allPayments.filter(p => p.status === "pending").length,
    approved: allPayments.filter(p => p.status === "approved").length,
    rejected: allPayments.filter(p => p.status === "rejected").length,
  };

  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={6} mb={8} maxW="1100px" mx="auto" border="1px solid #e2e8f0">
      <Text fontWeight="bold" fontSize="xl" mb={4}>Payment Approvals</Text>
      
      {/* Filters and Search Section */}
      <VStack spacing={4} mb={6} align="stretch">
        <Flex direction={{ base: "column", md: "row" }} gap={4} justify="space-between" align={{ base: "stretch", md: "center" }}>
          {/* Status Filter */}
          <Box flex="1">
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Filter by Status</Text>
            <HStack spacing={2} flexWrap="wrap">
              <Button
                size="sm"
                variant={statusFilter === "all" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setStatusFilter("all")}
              >
                All ({statusCounts.all})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "pending" ? "solid" : "outline"}
                colorScheme="yellow"
                onClick={() => setStatusFilter("pending")}
              >
                Pending ({statusCounts.pending})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "approved" ? "solid" : "outline"}
                colorScheme="green"
                onClick={() => setStatusFilter("approved")}
              >
                Approved ({statusCounts.approved})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "rejected" ? "solid" : "outline"}
                colorScheme="red"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected ({statusCounts.rejected})
              </Button>
            </HStack>
          </Box>

          {/* Search Bar */}
          <Box flex="1" maxW={{ base: "100%", md: "300px" }}>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Search by User Name</Text>
            <Input
              placeholder="Search by first name or last name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="md"
            />
          </Box>
        </Flex>

        {/* Results Summary */}
        <Box>
          <Text fontSize="sm" color="gray.600">
            Showing {payments.length} payments
            {searchQuery && ` matching "${searchQuery}"`}
            {statusFilter !== "all" && ` with status "${statusFilter}"`}
            {statusFilter === "all" && searchQuery === "" && ` (${allPayments.length} total)`}
          </Text>
        </Box>
      </VStack>

      {loading ? (
        <Box textAlign="center" py={10}><Spinner size="lg" /></Box>
      ) : (
        <>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Transaction Date</Th>
                <Th>User Name</Th>
                <Th>Amount</Th>
                <Th>Camp Type</Th>
                <Th>Receipt</Th>
                <Th>Status</Th>
                <Th>Admin Comment</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPayments.length === 0 ? (
                <Tr><Td colSpan={9}><Text textAlign="center" color="gray.500">No payments found.</Text></Td></Tr>
              ) : (
                paginatedPayments.map(item => (
                  <Tr key={item._id}>
                    <Td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</Td>
                    <Td>{item.transactionDate ? new Date(item.transactionDate).toLocaleString() : "-"}</Td>
                    <Td>{item.userId && (item.userId.firstName || item.userId.lastName) ? getFullName(item.userId) : "-"}</Td>
                    <Td>₦{item.amount ? Number(item.amount).toLocaleString() : "-"}</Td>
                    <Td>{item.campType || "-"}</Td>
                    <Td>{item.receiptUrl ? (<Link href={item.receiptUrl} target="_blank" rel="noopener noreferrer" color="blue.500" textDecoration="underline">View</Link>) : "-"}</Td>
                    <Td><Badge colorScheme={statusColor[item.status] || "gray"}>{item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}</Badge></Td>
                    <Td><Input size="sm" value={adminComments[item._id] ?? item.adminComment ?? ""} onChange={e => handleCommentChange(item._id, e.target.value)} placeholder="Add comment" disabled={item.status !== "pending"} /></Td>
                    <Td>
                      {item.status === "pending" ? (
                        <Box display="flex" gap={2}>
                          <Select size="sm" width="110px" value={statusUpdates[item._id] || ""} onChange={e => handleStatusChange(item._id, e.target.value)} placeholder="Select"><option value="approved">Approve</option><option value="rejected">Reject</option></Select>
                          <Button size="sm" colorScheme="green" isLoading={actionLoading[item._id]} onClick={() => handleAction(item._id)} isDisabled={!statusUpdates[item._id] || actionLoading[item._id]}>Update</Button>
                        </Box>
                      ) : (<Text fontSize="sm" color="gray.400">No action</Text>)}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Text>Total: ₦{totalAmount.toLocaleString()}</Text>
            <Box>
              <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} mr={2}>Prev</Button>
              <Text as="span" mx={2}>Page {page} of {totalPages}</Text>
              <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} ml={2}>Next</Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminPaymentApprovalTable;
