import React, { useEffect, useState } from "react";

const CustomPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maxVisiblePages = 6;

  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages === 0) return null;

  return (
    <div className={`mt-6 w-full ${isMobile ? "space-y-4" : "flex justify-center items-center gap-2 flex-wrap"}`}>
      {isMobile ? (
        <>
          {/* Página buttons */}
          <div className="flex justify-center gap-2 flex-wrap">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border text-base font-poppinsMedium transition
                  ${
                    currentPage === number
                      ? "bg-primary-600 text-white border-primary-600 font-poppinsBold shadow-lg"
                      : "border-neutral-300 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                  }`}
              >
                {number}
              </button>
            ))}
          </div>

          {/* Controles */}
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
            >
              « Primera
            </button>

            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
            >
              ‹ Anterior
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
            >
              Siguiente ›
            </button>

            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
            >
              Última »
            </button>
          </div>
        </>
      ) : (
        // Desktop layout: controles a los lados
        <>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
          >
            « Primera
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
          >
            ‹ Anterior
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border text-base font-poppinsMedium transition
                ${
                  currentPage === number
                    ? "bg-primary-600 text-white border-primary-600 font-poppinsBold shadow-lg"
                    : "border-neutral-300 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
          >
            Siguiente ›
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 text-base"
          >
            Última »
          </button>
        </>
      )}
    </div>
  );
};

export default CustomPagination;
