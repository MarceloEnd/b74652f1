import { Provider } from 'react-redux';
import { store, persistor } from '../store';
import { AddComment } from './AddComment';
import { ShowComments } from './ShowComments';
import { PersistGate } from 'redux-persist/integration/react';

export const App = () => {

  return (
    <div>
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <AddComment />
          <ShowComments />
        </PersistGate>
      </Provider>
    </div>
  );
}

