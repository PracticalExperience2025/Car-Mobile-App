import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  email: string;
  token: string;
  language: string;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

const initialState: UserState = {
  id: '',
  email: '',
  token: '',
  language: 'English',
  notificationsEnabled: true,
  emailNotificationsEnabled: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, 'language' | 'notificationsEnabled' | 'emailNotificationsEnabled'>>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    toggleEmailNotifications: (state) => {
      state.emailNotificationsEnabled = !state.emailNotificationsEnabled;
    },
    logout: (state) => {
      state.id = '';
      state.email = '';
      state.token = '';
    },
  },
});

export const { setUser, setLanguage, toggleNotifications, toggleEmailNotifications, logout } = userSlice.actions;
export default userSlice.reducer;
