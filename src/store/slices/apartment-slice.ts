import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { Apartment } from '@/models/apartment';
import { API_URL } from '@/lib/utils';

interface ApartmentsState {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ApartmentsState = {
  apartments: [],
  isLoading: true,
  error: null,
};

export const fetchApartments = createAsyncThunk(
  'apartment/fetchApartments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/apartment`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch apartments');
      }
      const data = await res.json();
      return data.apartments || ([] as Apartment[]);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const apartmentSlice = createSlice({
  name: 'apartment',
  initialState,
  reducers: {
    setApartments: (state, action: PayloadAction<Apartment[]>) => {
      state.apartments = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchApartments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchApartments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.apartments = action.payload || [];
    });
    builder.addCase(fetchApartments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || 'Unable to load apartments';
    });
  },
});

export const { setApartments } = apartmentSlice.actions;

export default apartmentSlice.reducer;
