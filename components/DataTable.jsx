"use client";
import { useState, useEffect } from "react";
import { Calendar, Search, SortAsc, SortDesc, Check, Download } from "lucide-react";
import { format } from "date-fns";
import { useContext } from 'react';
import { ThemeContext } from '../app/page';
import Dropdown from './Dropdown';
import axios from 'axios';

const statusColors = {
  todo: "badge-warning",
  Todo: "badge-warning",
  "in-progress": "badge-info",
  done: "badge-success",
  Done: "badge-success",
  Canceled: "badge-error",
  canceled: "badge-error"
};

const priorityColors = {
  low: "badge-ghost",
  Low: "badge-ghost",
  medium: "badge-warning",
  Medium: "badge-warning",
  high: "badge-error",
  High: "badge-error"

};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];

// Utility function for CSV export
const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cellData = row[header];
        if (header === 'created_at') {
          cellData = format(new Date(cellData), "MMM d, yyyy");
        }
        if (typeof cellData === 'string' && cellData.includes(',')) {
          cellData = `"${cellData}"`;
        }
        return cellData;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function DataTable() {
  const { setCurrentTheme } = useContext(ThemeContext);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for filters and pagination
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('https://nextjs-table-backend.onrender.com/api/list-data/');
        const formattedData = response.data.map(item => ({
          ...item,
          created_at: new Date(item.created_at)
        }));
        setTableData(formattedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleRowSelect = (code) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(item => item.code)));
    }
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const dataToExport = selectedRows.size > 0 
      ? sortedData.filter(item => selectedRows.has(item.code))
      : sortedData;
    
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm");
    exportToCSV(dataToExport, `tasks_export_${timestamp}.csv`);
  };

  const filteredData = tableData.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    
    const itemDate = new Date(item.created_at);
    const matchesDateRange = (!startDate || itemDate >= new Date(startDate)) &&
                           (!endDate || itemDate <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (sortColumn === 'created_at') {
        return sortOrder === "asc" 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-2 pb-6 sm:p-4  w-full">
      {/* Filters Section */}
      <Dropdown/>
      <div className="space-y-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select select-bordered w-full sm:w-auto"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="btn btn-primary btn-sm gap-2 whitespace-nowrap"
            title={selectedRows.size > 0 ? "Export selected rows" : "Export all filtered rows"}
          >
            <Download className="h-4 w-4" />
            Export CSV
            {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered input-sm"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto relative">
        {loading ? (
          <div className="absolute inset-0 bg-base-100/50 flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-error">
            <p>Error loading data: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-error btn-sm mt-2"
            >
              Retry
            </button>
          </div>
        ) : null}
        
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-4">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length}
                  onChange={handleSelectAll}
                  className="checkbox checkbox-sm"
                />
              </th>
              {["Code", "Title", "Status", "Priority", "Archived", "Created At"].map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(header.toLowerCase().replace(" ", ""))}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {sortColumn === header.toLowerCase().replace(" ", "") && (
                      sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.code}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.code)}
                    onChange={() => handleRowSelect(item.code)}
                    className="checkbox checkbox-sm"
                  />
                </td>
                <td>{item.code}</td>
                <td>{item.title}</td>
                <td>
                  <div className={`badge ${statusColors[item.status]} w-full`}>
                    {item.status === 'in-progress' ? "inprogress":item.status}
                  </div>
                </td>
                <td>
                  <div className={`badge ${priorityColors[item.priority]} w-full`}>
                    {item.priority}
                  </div>
                </td>
                <td>
                  {item.archived ? <Check className="h-4 w-4 text-success" /> : null}
                </td>
                <td>
                  {format(new Date(item.created_at), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="select select-bordered select-sm"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm">entries</span>
        </div>

        <div className="text-sm">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
        </div>
        
        <div className="join">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="join-item btn btn-sm"
          >
            «
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className="join-item btn btn-sm"
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            if (
              index + 1 === currentPage ||
              index + 1 === currentPage - 1 ||
              index + 1 === currentPage - 2 ||
              index + 1 === currentPage + 1 ||
              index + 1 === currentPage + 2
            ) {
              return (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`join-item btn btn-sm ${
                    currentPage === index + 1 ? "btn-active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              );
            }
            return null;
          })}
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className="join-item btn btn-sm"
          >
            ›
          </button>
          
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="join-item btn btn-sm"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
