import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;


export async function sendOtp(personalPhonenumber, typeVerification) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/otp/insert`,
        {
          personalPhonenumber: String(personalPhonenumber),
          typeVerification,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const data = error.response?.data;
      let errMsg =
        data?.message ||
        data?.statusMessage ||
        'Error al enviar código OTP';
      if (Array.isArray(data?.error) && data.error.length) {
        errMsg = data.error.join('. ');
      }
      throw new Error(errMsg);
    }
  }
  
  export async function validateOtp(personalPhonenumber, otp, typeVerification) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/otp/validate_otp`,
        {
          personalPhonenumber: String(personalPhonenumber),
          otp: String(otp),
          typeVerification,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const data = error.response?.data;
      let errMsg =
        data?.message ||
        data?.statusMessage ||
        'Error al validar código OTP';
      if (Array.isArray(data?.error) && data.error.length) {
        errMsg = data.error.join('. ');
      }
      throw new Error(errMsg);
    }
  }