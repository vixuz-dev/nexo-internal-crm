import React, { useRef, useState } from 'react';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';

const FileUpload = ({ onFileSelect, acceptedTypes = ['.xlsx', '.xls'] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validar tipo de archivo
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      alert('Por favor, sube un archivo Excel (.xlsx o .xls)');
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-600 bg-primary-50'
              : 'border-neutral-400 hover:border-primary-500 hover:bg-neutral-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <FiUpload className={`h-12 w-12 mb-4 ${isDragging ? 'text-primary-600' : 'text-primary-700'}`} />
            <p className="text-neutral-900 font-poppinsMedium text-lg mb-2">
              Sube el archivo aquí
            </p>
            <p className="text-neutral-700 font-poppinsRegular text-sm">
              Arrastra y suelta o haz clic para seleccionar
            </p>
            <p className="text-neutral-600 font-poppinsRegular text-xs mt-2">
              Formatos aceptados: .xlsx, .xls
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-neutral-400 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FiFile className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-neutral-900 font-poppinsMedium">{selectedFile.name}</p>
                <p className="text-neutral-500 font-poppinsRegular text-sm">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-neutral-100 rounded-lg transition"
              title="Eliminar archivo"
            >
              <FiX className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

