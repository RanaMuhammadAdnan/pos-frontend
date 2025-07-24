'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import { Print, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SaleInvoice } from 'types';

interface SaleInvoiceDetailClientProps {
  saleInvoice: SaleInvoice;
}

export const SaleInvoiceDetailClient = ({ saleInvoice }: SaleInvoiceDetailClientProps) => {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      case 'returned': return 'error';
      default: return 'default';
    }
  };

  // IMPORTANT: Ensure you have the following global CSS in your app (e.g. in globals.css):
  // @media print {
  //   body * { visibility: hidden; }
  //   #print-invoice, #print-invoice * { visibility: visible; }
  //   #print-invoice { position: absolute; left: 0; top: 0; width: 100vw; }
  //   .no-print { display: none !important; }
  // }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header (not printed) */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        '@media print': { display: 'none' }
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Sale Invoice
        </Typography>
      </Box>

      {/* Printable Invoice Content */}
      <div id="print-invoice">
        <Paper sx={{ p: 4 }}>
          {/* Invoice Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                SALE INVOICE
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Invoice #{saleInvoice.invoiceNumber}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={saleInvoice.status.toUpperCase()}
                color={getStatusColor(saleInvoice.status) as any}
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Customer and Invoice Details */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Bill To:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {saleInvoice.customer?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {saleInvoice.customer?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {saleInvoice.customer?.phone}
              </Typography>
              {saleInvoice.customer?.address && (
                <Typography variant="body2" color="text.secondary">
                  {saleInvoice.customer.address}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Invoice Details:
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Invoice Date:</strong> {new Date(saleInvoice.invoiceDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Created:</strong> {new Date(saleInvoice.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {/* Items Table */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saleInvoice.items && saleInvoice.items.length > 0 ? (
                  saleInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body1">
                          {item.item?.name || `Item ${item.itemId}`}
                        </Typography>
                        {item.item?.sku && (
                          <Typography variant="body2" color="text.secondary">
                            SKU: {item.item.sku}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unitPrice}</TableCell>
                      <TableCell align="right">{item.discount}</TableCell>
                      <TableCell align="right">{item.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No items found for this invoice
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Box sx={{ minWidth: 300 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{saleInvoice.subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount:</Typography>
                <Typography>{saleInvoice.discountAmount}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6">{saleInvoice.totalAmount}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Notes */}
          {saleInvoice.notes && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Notes:
              </Typography>
              <Typography variant="body1">
                {saleInvoice.notes}
              </Typography>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Thank you for your business!
            </Typography>
          </Box>
          {/* Print Button (screen only) */}
          <Button
            onClick={handlePrint}
            variant="outlined"
            sx={{ mt: 2, alignSelf: 'flex-start' }}
            className="no-print"
          >
            Print
          </Button>
        </Paper>
      </div>
    </Box>
  );
}; 