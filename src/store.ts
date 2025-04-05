import { configureStore } from '@reduxjs/toolkit';
import { CommentReducer } from './store/reducer/CommentReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 


const persistConfig = {
    key: 'root',
    storage,
  };
  
const persistedReducer = persistReducer(persistConfig, CommentReducer);

  
export const store = configureStore({
  reducer: {
    comments: persistedReducer,
  },
});

export const persistor = persistStore(store);