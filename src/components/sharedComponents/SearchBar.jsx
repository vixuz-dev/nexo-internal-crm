import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Buscar...',
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-neutral-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-poppinsRegular text-neutral-900"
      />
    </div>
  );
};

export default SearchBar;

