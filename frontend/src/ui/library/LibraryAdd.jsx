import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addLibraryHistory } from '../../features/library/librarySlice';
import { fetchStudents } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess } from '../../utils/Message';

function LibraryAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get necessary state from Redux store
  const { loading, error } = useSelector((state) => state.library);
  const { students, loading: studentsLoading } = useSelector((state) => state.student);

  // Initialize form state
  const [formData, setFormData] = useState({
    studentId: '',
    bookTitle: '',
    issueDate: new Date().toISOString().split('T')[0], // Default to today's date
    returnDate: '',
    isReturned: false
  });

  // Fetch students when component mounts
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data for submission
    const submissionData = {
      ...formData,
      // Convert empty studentId to null
      studentId: formData.studentId || null,
      // Only include returnDate if it exists
      ...(formData.returnDate ? { returnDate: formData.returnDate } : {})
    };

    try {
      await dispatch(addLibraryHistory(submissionData)).unwrap();
      handleSuccess("Library record created successfully!");
      setTimeout(() => navigate("/dashboard/admin/libraryHistory"), 1000);
    } catch (err) {
      console.error('Failed to create library record:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Add New Library Record</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in the book details and issue information</p>
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
              {/* Book Information Section */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Book Information</h3>
                
                {/* Book Title */}
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
                      placeholder="Enter book title"
                    />
                  </div>
                </div>
              </div>

              {/* Student Information Section */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
                
                {/* Student Selector */}
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
                  {/* Issue Date */}
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

                  {/* Return Date */}
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

                {/* Return Status */}
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
                      <p className="text-gray-500">Check this box if the book has already been returned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/library')}
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
                      Processing...
                    </>
                  ) : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LibraryAdd;