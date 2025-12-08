import { Toaster } from 'react-hot-toast';

const CustomToaster = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        fontFamily: 'PoppinsMedium, PoppinsRegular, sans-serif',
        fontSize: '1rem',
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      },
      success: {
        style: {
          background: '#22c55e',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#22c55e',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
      loading: {
        style: {
          background: '#2563eb',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#2563eb',
        },
      },
    }}
  />
);

export default CustomToaster; 