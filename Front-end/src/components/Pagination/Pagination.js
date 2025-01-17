import React from 'react';

const Pagination = ({ tasksPerPage, totalTasks, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`mx-2 px-4 py-2 rounded ${
            currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
