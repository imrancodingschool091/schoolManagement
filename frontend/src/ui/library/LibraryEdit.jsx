import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchLibraryHistoryById, 
  updateLibraryHistory, 
  clearLibraryError 
} from '../../features/library/librarySlice';
import { fetchStudents } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess } from '../../utils/Message';

function LibraryEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Get state from Redux store
  const { entry: currentRecord, loading, error } = useSelector((state) => state.library);
  const { students, loading: studentsLoading } = useSelector((state) => state.student);

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    bookTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    isReturned: false
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchLibraryHistoryById(id));
    dispatch(fetchStudents());

    return () => {
      dispatch(clearLibraryError());
    };
  }, [dispatch, id]);

  // Update form when record loads
  useEffect(() => {
    if (currentRecord) {
      setFormData({
        studentId: currentRecord.studentId?._id || currentRecord.studentId || '',
        bookTitle: currentRecord.bookTitle || '',
        issueDate: currentRecord.issueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        returnDate: currentRecord.returnDate?.split('T')[0] || '',
        isReturned: currentRecord.isReturned || false
      });
    }
  }, [currentRecord]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      studentId: formData.studentId || null,
      ...(formData.returnDate ? { returnDate: formData.returnDate } : {})
    };

    try {
      await dispatch(updateLibraryHistory({ 
        id, 
        libraryData: submissionData 
      })).unwrap();
      
      handleSuccess("Library record updated successfully!");
      setTimeout(() => navigate("/dashboard/admin/libraryHistory"), 1000);
    } catch (err) {
      console.error('Failed to update library record:', err);
    }
  };

  // Loading state
  if (loading && !currentRecord) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="rounded-md bg-blue-50 p-4 max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Loading library record</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Please wait while we fetch the record...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Not found state
  if (!currentRecord && !loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Record not found</h3>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/admin/libraryHistory')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Library History
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Edit Library Record</h2>
                  <p className="mt-1 text-sm text-gray-500">Update the book details and issue information</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/admin/libraryHistory')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to List
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Library Form */}
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              {/* Book Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Book Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      name="bookTitle"
                      id="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                      Issued To (Optional)
                    </label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={studentsLoading}
                    >
                      <option value="">Select a student (optional)</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} (Roll: {student.rollNumber}, Class: {student.class}-{student.section})
                        </option>
                      ))}
                    </select>
                    {studentsLoading && (
                      <p className="mt-1 text-sm text-gray-500">Loading students...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates Section */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      id="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                      Return Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      id="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.issueDate}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isReturned"
                        name="isReturned"
                        type="checkbox"
                        checked={formData.isReturned}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isReturned" className="font-medium text-gray-700">
                        Mark as returned
                      </label>
                      <p className="text-gray-500">Check this box if the book has been returned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/libraryHistory')}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LibraryEdit;