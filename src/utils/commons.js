// Utilidad para convertir un archivo a base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const extension = file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;
      // Extraer solo el string base64, quitando el prefijo data:image/jpeg;base64,
      const base64String = reader.result.split(',')[1];
      resolve(`${mimeType},${base64String},.${extension}`);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Calcula el mensaje de pagos para un producto
export function getPaymentMessage(price, weeklyPayment) {
  const total = Number(price);
  const weekly = Number(weeklyPayment);
  if (!total || !weekly || weekly <= 0) return { message: '', totalWeeks: 0, lastPayment: 0, weeklyPayment: weekly, numPayments: 0 };
  const numPayments = Math.floor(total / weekly);
  const lastPayment = total - (numPayments * weekly);
  let message = '';
  let totalWeeks = numPayments;
  if (lastPayment === 0) {
    message = `Tu producto se liquidará en ${numPayments} pagos de $${weekly}`;
  } else {
    message = `Tu producto se liquidará en ${numPayments} pagos de $${weekly} y un último pago de $${lastPayment}`;
    totalWeeks += 1;
  }
  return {
    message,
    totalWeeks,
    lastPayment,
    weeklyPayment: weekly,
    numPayments
  };
} 