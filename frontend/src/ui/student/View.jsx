import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById, clearStudentError } from '../../features/students/studentsSlice';
import Header from '../../common/Header';

function View() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { student: currentStudent, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudentById(id));
    
    return () => {
      dispatch(clearStudentError());
    };
  }, [dispatch, id]);

  // Format the student data consistently
  const student = currentStudent?.student || currentStudent;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && !student) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading student details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-red-500 text-lg font-semibold">Error</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={() => navigate('/dashboard/admin/students')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Back to Students List
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-700 text-lg font-semibold">Student Not Found</p>
            <p className="text-sm mt-2">No data available for this student.</p>
            <button
              onClick={() => navigate('/dashboard/admin/students')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Back to Students List
            </button>
          </div>
        </div>
      </>
    );
  }

  // Safely access nested objects with fallbacks
  const address = student.address || {};
  const parentDetails = student.parentDetails || {};

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Student Information</h2>
              <p className="text-sm text-gray-500">Details for {student.name || 'Unknown'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/dashboard/admin/student/edit/${id}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => navigate('/dashboard/admin/students')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm"
              >
                Back
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium text-gray-900">{student.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="text-base font-medium text-gray-900">{student.rollNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class & Section</p>
                <p className="text-base font-medium text-gray-900">
                  Class {student.class || 'N/A'} - Section {student.section || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-base font-medium text-gray-900">{formatDate(student.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-base font-medium text-gray-900">{student.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admission Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(student.admissionDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fees Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  student.feesStatus === 'Paid' ? 'bg-green-100 text-green-700'
                  : student.feesStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {student.feesStatus || 'N/A'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {student.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Street</p>
                  <p className="text-base text-gray-900">{address.street || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-base text-gray-900">{address.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="text-base text-gray-900">{address.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="text-base text-gray-900">{address.postalCode || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="text-base text-gray-900">{address.country || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Parent Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Father's Name</p>
                  <p className="text-base text-gray-900">{parentDetails.fatherName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother's Name</p>
                  <p className="text-base text-gray-900">{parentDetails.motherName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-base text-gray-900">{parentDetails.contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{parentDetails.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default View;