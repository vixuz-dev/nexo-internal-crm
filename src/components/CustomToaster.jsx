import { Toaster } from 'react-hot-toast';

const CustomToaster = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        fontFamily: "'Poppins', system-ui, sans-serif",
        fontSize: '1rem',
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      },
      success: {
        style: {
          background: '#1a7288',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#1a7288',
        },
      },
      error: {
        style: {
          background: '#616160',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#616160',
        },
      },
      loading: {
        style: {
          background: '#208eaa',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#208eaa',
        },
      },
    }}
  />
);

export default CustomToaster;
