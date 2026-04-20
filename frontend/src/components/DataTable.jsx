import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import '../styles/DataTable.css';

export default function DataTable({ data, columns, title }) {
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown size={16} className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ?
      <ChevronUp size={16} className="sort-icon active" /> :
      <ChevronDown size={16} className="sort-icon active" />;
  };

  return (
    <div className="data-table-container">
      {title && <h3 className="table-title">{title}</h3>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <button
                    className="sort-button"
                    onClick={() => handleSort(column.key)}
                    title="Click to sort"
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="data-row">
                  {columns.map((column) => (
                    <td key={column.key} className={`cell-${column.key}`}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <div className="pagination-info">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </div>

          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
