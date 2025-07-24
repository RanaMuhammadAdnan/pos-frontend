"use client";
import React from 'react';
import { TableRow, TableCell, Box } from '@mui/material';
import { Edit, Delete, Receipt } from '@mui/icons-material';
import { Vendor } from 'types';
import { ActionButton } from 'components/common/ActionButton';

interface VendorRowProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onInvoices?: (vendor: Vendor) => void;
}

export const VendorRow = ({ vendor, onEdit, onDelete, onInvoices }: VendorRowProps) => {
  const handleEdit = () => {
    onEdit(vendor);
  };

  const handleDelete = () => {
    onDelete(vendor);
  };

  const handleInvoices = () => {
    onInvoices?.(vendor);
  };

  return (
    <TableRow hover>
      <TableCell>{vendor.name}</TableCell>
      <TableCell>{vendor.email || '-'}</TableCell>
      <TableCell>{vendor.phone}</TableCell>
      <TableCell>
        <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.address}</Box>
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <ActionButton icon={<Receipt />} tooltip="View invoices" onClick={handleInvoices} color="info" />
          <ActionButton icon={<Edit />} tooltip="Edit vendor" onClick={handleEdit} color="primary" />
          <ActionButton icon={<Delete />} tooltip="Delete vendor" onClick={handleDelete} color="error" />
        </Box>
      </TableCell>
    </TableRow>
  );
}; 