"use client";
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, IconButton, Stack, TablePagination, DialogContentText } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { Expense } from 'types/expense';
import { getExpenses } from 'actions';
import { createExpense } from 'actions';
import { updateExpense } from 'actions';
import { deleteExpense } from 'actions';

export const ExpensesContent: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState({ description: '', amount: '', date: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    const result = await getExpenses();
    if (result.success && Array.isArray(result.data)) {
      setExpenses(result.data);
    } else {
      setError(result.error || 'Failed to fetch expenses');
    }
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleOpenForm = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setForm({ description: expense.description, amount: expense.amount.toString(), date: expense.date.slice(0, 10) });
    } else {
      setEditingExpense(null);
      setForm({ description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingExpense(null);
    setForm({ description: '', amount: '', date: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.date) return;
    setLoading(true);
    if (editingExpense) {
      const result = await updateExpense(editingExpense.id, { ...form, id: editingExpense.id, amount: parseFloat(form.amount) });
      if (result.success && result.data) {
        setSnackbar({ open: true, message: 'Expense updated', severity: 'success' });
        fetchExpenses();
        handleCloseForm();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update', severity: 'error' });
      }
    } else {
      const result = await createExpense({ ...form, amount: parseFloat(form.amount) });
      if (result.success && result.data) {
        setSnackbar({ open: true, message: 'Expense added', severity: 'success' });
        fetchExpenses();
        handleCloseForm();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to add', severity: 'error' });
      }
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    const expense = expenses.find(e => e.id === id) || null;
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    setLoading(true);
    const result = await deleteExpense(expenseToDelete.id);
    if (result.success) {
      setSnackbar({ open: true, message: 'Expense deleted', severity: 'success' });
      fetchExpenses();
    } else {
      setSnackbar({ open: true, message: result.error || 'Failed to delete', severity: 'error' });
    }
    setLoading(false);
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(search.toLowerCase()) ||
      expense.amount.toString().includes(search) ||
      expense.date.slice(0, 10).includes(search)
  );

  const paginatedExpenses = filteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ borderRadius: 2, boxShadow: 1 }}>
      {/* Header with Add Button */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Expenses ({filteredExpenses.length})
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Add Expense
          </Button>
        </Stack>
      </Box>
      {/* Search Filter */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search expenses..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
          />
        </Stack>
      </Box>
      {/* Error Alert */}
      {error && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No expenses found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.date.slice(0, 10)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenForm(expense)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(expense.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredExpenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />
      {/* Add/Edit Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{expenseToDelete?.description}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}; 