"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPurchaseInvoiceByIdAction } from 'actions/purchaseInvoice/getPurchaseInvoiceById';
import { PurchaseInvoice } from 'types/purchaseInvoice';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack, Alert, Snackbar } from '@mui/material';

export const PurchaseInvoiceDetailClient: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPurchaseInvoiceByIdAction(Number(id)).then(result => {
      if (result.success && result.data) setInvoice(result.data);
      else setError(result.error || 'Not found');
      setLoading(false);
    });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

  if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;
  if (!invoice) return null;

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <div id="print-invoice">
        <Paper sx={{ p: 3, boxShadow: 'none' }}>
          {/* Professional Invoice Header */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight={700} mb={0.5}>
              {invoice.vendor?.name || invoice.vendorId}
            </Typography>
            <Typography variant="h5" fontWeight={600} mb={0.5}>
              Invoice #{invoice.invoiceNumber}
            </Typography>
            <Box mt={1} mb={1}>
              <Typography variant="body1">
                {(invoice.vendor as any)?.address || '-'}
              </Typography>
              <Typography variant="body1">
                {invoice.vendor?.phone || '-'}
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={500}>
              Date: {invoice.date?.slice(0, 10)}
            </Typography>
            <Box mt={2} mb={2} borderBottom="2px solid #eee" />
          </Box>
          {/* Invoice Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Gross Price</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Net Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {((invoice as any).PurchaseInvoiceItems || []).map((item: any) => {
                const i = item.Item || {};
                const netPrice = typeof i.netPrice === 'number' ? i.netPrice : Number(i.netPrice) || 0;
                const totalPrice = netPrice * item.quantity;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{i.name || item.itemId || '-'}</TableCell>
                    <TableCell>{i.sku || '-'}</TableCell>
                    <TableCell>{i.grossPrice ?? '-'}</TableCell>
                    <TableCell>{i.discount ?? '-'}</TableCell>
                    <TableCell>{i.tax ?? '-'}</TableCell>
                    <TableCell>{i.netPrice ?? '-'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{totalPrice}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={7} align="right" sx={{ borderTop: '2px solid #222' }}>
                  <Typography variant="h6" fontWeight={700}>Net Total</Typography>
                </TableCell>
                <TableCell sx={{ borderTop: '2px solid #222' }}>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {((invoice as any).PurchaseInvoiceItems || []).reduce((sum: any, item: any) => {
                      const netPrice = typeof item.Item?.netPrice === 'number' ? item.Item.netPrice : Number(item.Item?.netPrice) || 0;
                      return sum + netPrice * item.quantity;
                    }, 0)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* Thank you note */}
          <Box mt={4} textAlign="center">
            <Typography variant="subtitle1" fontWeight={500} color="text.secondary">
              Thank you for your business!
            </Typography>
          </Box>
          <Button onClick={handlePrint} variant="outlined" sx={{ mt: 2, alignSelf: 'flex-start' }} className="no-print">Print</Button>
        </Paper>
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 