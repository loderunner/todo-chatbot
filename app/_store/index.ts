import { configureStore } from '@reduxjs/toolkit';

import todo, { middleware } from './todo';

export const store = configureStore({
  reducer: {
    todo,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
