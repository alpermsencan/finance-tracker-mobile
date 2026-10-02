import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, Bill } from '../../services/api';

interface BillState {
  bills: Bill[];
  upcomingBills: Bill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillState = {
  bills: [],
  upcomingBills: [],
  loading: false,
  error: null,
};

export const fetchUpcomingBills = createAsyncThunk('bills/fetchUpcoming', async () => {
  return await api.getUpcomingBills(3);
});

export const fetchAllBills = createAsyncThunk('bills/fetchAll', async () => {
  return await api.getAllBills();
});

export const addNewBill = createAsyncThunk('bills/add', async (bill: Partial<Bill>) => {
  return await api.createBill(bill);
});

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcomingBills.fulfilled, (state, action: PayloadAction<Bill[]>) => {
        state.loading = false;
        state.upcomingBills = action.payload;
      })
      .addCase(fetchUpcomingBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Hata oluştu';
      })
      .addCase(fetchAllBills.fulfilled, (state, action: PayloadAction<Bill[]>) => {
        state.bills = action.payload;
      })
      .addCase(addNewBill.fulfilled, (state, action: PayloadAction<Bill>) => {
        state.bills.unshift(action.payload);
      });
  },
});

export default billSlice.reducer;
