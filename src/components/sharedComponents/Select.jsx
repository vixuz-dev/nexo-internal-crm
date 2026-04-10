import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const Select = ({
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Seleccione una opción',
  label,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  optionValue = 'value',
  optionLabel = 'label',
  readOnlyClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (onBlur) {
          onBlur({ target: { value: value || '' } });
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, value, onBlur]);

  // Si es modo solo lectura, mostrar como input de texto
  if (readOnly) {
    const selectedOption = options.find(
      opt => {
        const optValue = typeof opt === 'object' ? opt[optionValue] : opt;
        return String(optValue) === String(value);
      }
    );
    const displayValue = selectedOption
      ? (typeof selectedOption === 'object' ? selectedOption[optionLabel] : selectedOption)
      : value || '-';

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-black mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type="text"
          value={displayValue}
          readOnly
          disabled
          className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg bg-neutral-50 cursor-not-allowed ${readOnlyClassName || 'text-black'} ${className}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // Encontrar la opción seleccionada para mostrar su label
  const selectedOption = options.find(
    opt => {
      const optValue = typeof opt === 'object' ? opt[optionValue] : opt;
      return String(optValue) === String(value);
    }
  );
  const displayValue = selectedOption
    ? (typeof selectedOption === 'object' ? selectedOption[optionLabel] : selectedOption)
    : placeholder;

  const handleSelect = (optionValueResolved) => {
    if (onChange) {
      onChange(optionValueResolved);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-black mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-5 py-3 border-2 rounded-lg bg-white text-black text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none flex items-center justify-between transition min-h-[48px] ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-neutral-500'
          } ${disabled ? 'bg-neutral-100 text-black cursor-not-allowed' : 'cursor-pointer hover:border-primary-400'} ${className}`}
        >
          <span className={`flex-1 text-left ${value ? 'text-black' : 'text-black'}`}>
            {displayValue}
          </span>
          <FiChevronDown
            className={`h-5 w-5 transition-transform duration-200 flex-shrink-0 ml-3 ${
              isOpen ? 'transform rotate-180' : ''
            } ${error ? 'text-red-500' : 'text-black'}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 bg-white border-2 border-neutral-500 rounded-lg shadow-xl overflow-y-auto"
            style={{ 
              width: 'max-content',
              minWidth: '100%',
              maxWidth: '500px',
              maxHeight: '400px',
              minHeight: options.length > 0 ? 'auto' : 'auto'
            }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-4 text-base text-black text-center">
                No hay opciones disponibles
              </div>
            ) : (
              <div className="py-1">
                {options.map((option, index) => {
                  const optionValueResolved = typeof option === 'object' ? option[optionValue] : option;
                  const optionLabelResolved = typeof option === 'object' ? option[optionLabel] : option;
                  const key = typeof option === 'object' && option.id ? option.id : index;
                  const isSelected = String(optionValueResolved) === String(value);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelect(optionValueResolved)}
                      className={`w-full px-4 py-3 text-left text-base transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-black hover:bg-neutral-50'
                      }`}
                    >
                      <span className="flex-1 whitespace-nowrap pr-4">{optionLabelResolved}</span>
                      {isSelected && <FiCheck className="h-5 w-5 text-primary-600 ml-2 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
