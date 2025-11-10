import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { Content } from '@/models/content';
import { API_URL } from '@/lib/utils';

interface ContentState {
  content: Content;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  content: {
    siteContent: {},
    systemSettings: {
      siteName: '',
      siteLogo: '',
      siteIcon: '',
      siteUrl: '',
      siteSlogan: '',
      siteGraphImage: '',
      siteKeywords: [],
      siteDescription: '',
      siteAuthor: '',
      siteLocale: '',
      siteType: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogImageAlt: '',
      twitterCard: '',
      twitterSite: '',
      twitterCreator: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      maintenanceMode: false,
      headerLinks: [],
      footerLinks: [],
      socialLinks: [],
      contact: {
        email: '',
        phones: [],
        whatsappPhone: '',
        addresses: [],
        map: '',
      },
    },
  },
  isLoading: true,
  error: null,
};

// Async thunks
export const fetchSiteContent = createAsyncThunk(
  'content/fetchSiteContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/content`);
      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // delay here

      return data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSiteContent = createAsyncThunk(
  'content/updateSiteContent',
  async ({ content }: { content: Partial<Content> }, { rejectWithValue }) => {
    try {
      const updated = await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      const data = await updated.json();
      return data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Content Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSiteContent: (state, action: PayloadAction<Content>) => {
      state.content = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch System Settings
    builder.addCase(fetchSiteContent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSiteContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
    });
    builder.addCase(fetchSiteContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    // Update Site Content
    builder.addCase(updateSiteContent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSiteContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
    });
    builder.addCase(updateSiteContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSiteContent } = contentSlice.actions;

export default contentSlice.reducer;
