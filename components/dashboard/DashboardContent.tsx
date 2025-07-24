"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from 'components/common/Layout';
import { DashboardCard } from 'components/common/DashboardCard';
import { Box, Typography, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, TextField, ToggleButton, ToggleButtonGroup, CircularProgress } from '@mui/material';
import { People as PeopleIcon, ShoppingCart as ShoppingCartIcon, TrendingUp as TrendingUpIcon, Assessment as AssessmentIcon, Receipt as ReceiptIcon, Person as PersonIcon, Money as MoneyIcon } from '@mui/icons-material';
import { getVendorsAction } from 'actions/vendor/getVendors';
import { getItemsAction } from 'actions/item/getItems';
import { getCustomersAction } from 'actions/customer/getCustomers';
import { getExpenses } from 'actions/expense/getExpenses';
import { getSaleInvoiceStats } from 'actions/saleInvoice/getSaleInvoiceStats';
import { getSaleInvoices } from 'actions/saleInvoice/getSaleInvoices';
import { getPurchaseInvoicesAction } from 'actions/purchaseInvoice/getPurchaseInvoices';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const DashboardContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [cards, setCards] = useState<any[]>([]);
  const [saleInvoices, setSaleInvoices] = useState<any[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<any[]>([]);
  const [salePagination, setSalePagination] = useState({ page: 1, limit: 5, total: 0 });
  const [purchasePagination, setPurchasePagination] = useState({ page: 1, limit: 5, total: 0 });
  const [saleSearch, setSaleSearch] = useState('');
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [saleDateRange, setSaleDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [purchaseDateRange, setPurchaseDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [salePeriod, setSalePeriod] = useState<'all'|'monthly'>('all');
  const [purchasePeriod, setPurchasePeriod] = useState<'all'|'monthly'>('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getVendorsAction(),
      getItemsAction(),
      getCustomersAction(),
      getExpenses(),
      getSaleInvoiceStats(),
    ]).then(([vendors, items, customers, expenses, saleStats]) => {
      setStats({
        vendors: vendors.data?.length || 0,
        items: items.data?.items?.length || 0,
        customers: customers.data?.length || 0,
        expenses: expenses.data?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0,
        saleStats: saleStats.data || {},
      });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Fetch sale invoices with filters
    const filters: any = {
      page: salePagination.page,
      limit: salePagination.limit,
      search: saleSearch,
    };
    if (salePeriod === 'monthly') {
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      filters.startDate = start;
      filters.endDate = end;
    } else if (saleDateRange[0] && saleDateRange[1]) {
      filters.startDate = saleDateRange[0].format('YYYY-MM-DD');
      filters.endDate = saleDateRange[1].format('YYYY-MM-DD');
    }
    getSaleInvoices(filters).then((res) => {
      setSaleInvoices(res.data?.saleInvoices || []);
      setSalePagination((prev) => ({ ...prev, total: res.data?.pagination?.total || 0 }));
    });
  }, [salePagination.page, salePagination.limit, saleSearch, saleDateRange, salePeriod]);

  useEffect(() => {
    // Fetch purchase invoices with filters
    const filters: any = {
      page: purchasePagination.page,
      limit: purchasePagination.limit,
      search: purchaseSearch,
    };
    if (purchasePeriod === 'monthly') {
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      filters.startDate = start;
      filters.endDate = end;
    } else if (purchaseDateRange[0] && purchaseDateRange[1]) {
      filters.startDate = purchaseDateRange[0].format('YYYY-MM-DD');
      filters.endDate = purchaseDateRange[1].format('YYYY-MM-DD');
    }
    getPurchaseInvoicesAction(filters).then((res) => {
      setPurchaseInvoices(res.data?.invoices || []);
      setPurchasePagination((prev) => ({ ...prev, total: res.data?.pagination?.total || 0 }));
    });
  }, [purchasePagination.page, purchasePagination.limit, purchaseSearch, purchaseDateRange, purchasePeriod]);

  useEffect(() => {
    // Set up cards with navigation
    setCards([
      {
        title: 'Total Expenses',
        value: stats.expenses?.toLocaleString('en-PK', { maximumFractionDigits: 0 }),
        icon: <AssessmentIcon />,
        color: 'error.main',
        onClick: () => router.push('/expenses'),
      },
      {
        title: 'Total Products',
        value: stats.items?.toLocaleString('en-PK', { maximumFractionDigits: 0 }),
        icon: <ShoppingCartIcon />,
        color: 'secondary.main',
        onClick: () => router.push('/items'),
      },
      {
        title: 'Total Vendors',
        value: stats.vendors?.toLocaleString('en-PK', { maximumFractionDigits: 0 }),
        icon: <PeopleIcon />,
        color: 'primary.main',
        onClick: () => router.push('/vendors'),
      },
      {
        title: 'Total Customers',
        value: stats.customers?.toLocaleString('en-PK', { maximumFractionDigits: 0 }),
        icon: <PersonIcon />,
        color: 'info.main',
        onClick: () => router.push('/customers'),
      },
      {
        title: 'Total Sales',
        value: stats.saleStats?.totalRevenue?.toLocaleString('en-PK', { maximumFractionDigits: 0 }) || '0',
        icon: <TrendingUpIcon />,
        color: 'success.main',
        onClick: () => router.push('/sale-invoices'),
      },
      {
        title: 'Total Profit',
        value: stats.saleStats?.totalProfit?.toLocaleString('en-PK', { maximumFractionDigits: 0 }) || '0',
        icon: <MoneyIcon />,
        color: 'warning.main',
        onClick: () => router.push('/sale-invoices'),
      },
    ]);
  }, [stats, router]);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 3, mb: 4 }}>
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            onClick={card.onClick}
          />
        ))}
      </Box>
      {/* Sale Invoices Table */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Sale Invoices</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={salePeriod}
              exclusive
              onChange={(_e, val) => val && setSalePeriod(val)}
              size="small"
            >
              <ToggleButton value="all">All Time</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
            <DatePicker
              label="From"
              value={saleDateRange[0]}
              onChange={(date) => setSaleDateRange([date, saleDateRange[1]])}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <DatePicker
              label="To"
              value={saleDateRange[1]}
              onChange={(date) => setSaleDateRange([saleDateRange[0], date])}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <TextField
              size="small"
              placeholder="Search..."
              value={saleSearch}
              onChange={(e) => setSaleSearch(e.target.value)}
              sx={{ minWidth: 180 }}
            />
          </Stack>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleInvoices.map((inv: any) => (
                <TableRow key={inv.id} hover>
                  <TableCell>{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.invoiceDate?.slice(0, 10)}</TableCell>
                  <TableCell>{inv.customer?.name || '-'}</TableCell>
                  <TableCell align="right">{Number(inv.totalAmount).toLocaleString('en-PK', { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell align="right">{Number(inv.profit).toLocaleString('en-PK', { maximumFractionDigits: 0 })}</TableCell>
                </TableRow>
              ))}
              {saleInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No sale invoices found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={salePagination.total}
          page={salePagination.page - 1}
          onPageChange={(_e, newPage) => setSalePagination((prev) => ({ ...prev, page: newPage + 1 }))}
          rowsPerPage={salePagination.limit}
          onRowsPerPageChange={(e) => setSalePagination((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }))}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      {/* Purchase Invoices Table */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Purchase Invoices</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={purchasePeriod}
              exclusive
              onChange={(_e, val) => val && setPurchasePeriod(val)}
              size="small"
            >
              <ToggleButton value="all">All Time</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
            <DatePicker
              label="From"
              value={purchaseDateRange[0]}
              onChange={(date) => setPurchaseDateRange([date, purchaseDateRange[1]])}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <DatePicker
              label="To"
              value={purchaseDateRange[1]}
              onChange={(date) => setPurchaseDateRange([purchaseDateRange[0], date])}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <TextField
              size="small"
              placeholder="Search..."
              value={purchaseSearch}
              onChange={(e) => setPurchaseSearch(e.target.value)}
              sx={{ minWidth: 180 }}
            />
          </Stack>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseInvoices.map((inv: any) => (
                <TableRow key={inv.id} hover>
                  <TableCell>{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.date?.slice(0, 10)}</TableCell>
                  <TableCell>{inv.vendor?.name || '-'}</TableCell>
                  <TableCell align="right">{Number(inv.total).toLocaleString('en-PK', { maximumFractionDigits: 0 })}</TableCell>
                </TableRow>
              ))}
              {purchaseInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No purchase invoices found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={purchasePagination.total}
          page={purchasePagination.page - 1}
          onPageChange={(_e, newPage) => setPurchasePagination((prev) => ({ ...prev, page: newPage + 1 }))}
          rowsPerPage={purchasePagination.limit}
          onRowsPerPageChange={(e) => setPurchasePagination((prev) => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }))}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Layout>
  );
}; 