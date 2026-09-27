import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './app/App';
import {store} from './features/store';
import {ThemeProvider} from './context/ThemeContext';
import {AuthProvider} from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <App/>
          <ToastContainer position="bottom-right"/>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
