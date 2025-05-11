import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchFeesHistory, 
  deleteFeesHistory,
  fetchFeesByStudentId 
} from '../../features/fees/feesSlice';
import Header from '../../common/Header';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Fees = () => {
  const dispatch = useDispatch();
  const { fees, studentFees, loading, error } = useSelector((state) => state.fees);
  const [showAll, setShowAll] = React.useState(true);
  const [studentIdFilter, setStudentIdFilter] = React.useState('');

  useEffect(() => {
    if (showAll) {
      dispatch(fetchFeesHistory());
    } else if (studentIdFilter) {
      dispatch(fetchFeesByStudentId(studentIdFilter));
    }
  }, [dispatch, showAll, studentIdFilter]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This fee record will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteFeesHistory(id)).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Fee record has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh the appropriate list
        if (showAll) {
          dispatch(fetchFeesHistory());
        } else if (studentIdFilter) {
          dispatch(fetchFeesByStudentId(studentIdFilter));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete record. Try again.', 'error');
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const currentData = showAll ? fees : studentFees;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fees History</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track student fee payments and status.
                </p>
              </div>
              <Link
                to="/dashboard/admin/fees/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Payment
              </Link>
            </div>

            {/* Filter Controls */}
           

            {loading && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Loading fee records</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Please wait while we fetch the fee records...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading fee records</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && currentData.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No fee records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {showAll ? 'No fees have been recorded yet.' : 'No fees found for this student.'}
                </p>
                <div className="mt-6">
                  <Link
                    to="/dashboard/admin/fees/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Payment
                  </Link>
                </div>
              </div>
            )}

            {!loading && currentData.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((fee, index) => (
                        <tr key={fee._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {fee.studentId?.name || 'No student assigned'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {fee.studentId?._id?.slice(0, 8) || 'N/A'}...
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatCurrency(fee.amountPaid)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(fee.paymentDate)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {fee.paymentMethod}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${fee.feesStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                                fee.feesStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {fee.feesStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {fee.remarks || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <Link 
                              to={`/dashboard/admin/fees/edit/${fee._id}`} 
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(fee._id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
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

export default Fees;