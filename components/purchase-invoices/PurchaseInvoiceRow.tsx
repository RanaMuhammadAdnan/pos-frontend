import React from 'react';
import { TableRow, TableCell, IconButton, Tooltip, Stack, Typography } from '@mui/material';
import { ReceiptLong as DetailIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PurchaseInvoice } from 'types/purchaseInvoice';

interface PurchaseInvoiceRowProps {
  invoice: PurchaseInvoice;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const PurchaseInvoiceRow: React.FC<PurchaseInvoiceRowProps> = React.memo(({ invoice, onView, onEdit, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>{invoice.invoiceNumber}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{invoice.vendor?.name || invoice.vendorId}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{invoice.date?.slice(0, 10)}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={500}>{invoice.total}</Typography>
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="View Details / Print">
            <IconButton size="small" onClick={() => onView(invoice.id)} color="info">
              <DetailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Invoice">
            <IconButton size="small" onClick={() => onEdit(invoice.id)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Invoice">
            <IconButton size="small" onClick={() => onDelete(invoice.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}); 