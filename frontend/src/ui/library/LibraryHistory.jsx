import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibraryHistory, deleteLibraryHistory } from "../../features/library/librarySlice";
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const LibraryHistory = () => {
  const dispatch = useDispatch();
  // Corrected the selector to match your slice structure
  const { library: history, loading, error } = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(fetchLibraryHistory());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This entry will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteLibraryHistory(id)).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Library entry has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(fetchLibraryHistory());
      } catch (err) {
        Swal.fire('Error', 'Failed to delete entry. Try again.', 'error');
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Changed to directly use history since your slice stores data in library property
  const historyData = Array.isArray(history) ? history : [];

  console.log('Current library data:', historyData); // Debug log

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Library History</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track student book issues and returns.
                </p>
              </div>
              <Link
                to="/dashboard/admin/library/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Entry
              </Link>
            </div>

            {loading && <div className="rounded-md bg-blue-50 p-4">Loading history...</div>}
            {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

            {!loading && historyData.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">No entries</h3>
                <p className="text-sm text-gray-500">Start by adding a library record.</p>
                <div className="mt-6">
                  <Link
                    to="/dashboard/admin/library/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add New Entry
                  </Link>
                </div>
              </div>
            )}

            {!loading && historyData.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historyData.map((entry, index) => (
                        <tr key={entry._id} className={index % 5 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-500">{entry._id?.slice(0, 8) || 'N/A'}...</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.studentId?.name || 'No student assigned'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll: {entry.studentId?.rollNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{entry.bookTitle || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(entry.issueDate)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(entry.returnDate)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatDate(entry.studentId?.name)}</td>




                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${entry.isReturned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {entry.isReturned ? 'Returned' : 'Issued'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <Link to={`/dashboard/admin/library/edit/${entry._id}`} className="text-yellow-600 hover:text-yellow-900">Edit</Link>
                            <button onClick={() => handleDelete(entry._id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryHistory;