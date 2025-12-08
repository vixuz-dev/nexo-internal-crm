import React from 'react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'buenos días';
  if (hour >= 12 && hour < 19) return 'buenas tardes';
  return 'buenas noches';
}

const WelcomeMessage = ({ companyInformation }) => {
  const legalName = (companyInformation?.legal_name || '').toLowerCase();
  const greeting = getGreeting();

  return (
    <div className="mb-8 mt-4">
      <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
        Hola{' '}
        <span
          className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent"
          style={{ fontWeight: 600 }}
        >
          {legalName}
        </span>
        ,{' '}{greeting}
      </h2>
      <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
        Lo más interesante de tu perfil.
      </p>
    </div>
  );
};

export default WelcomeMessage; 