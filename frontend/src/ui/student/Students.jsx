import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, deleteStudent } from "../../features/students/studentsSlice";
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Students = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this student? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteStudent(id)).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(fetchStudents());
      } catch (err) {
        console.error("Failed to delete student:", err);
        Swal.fire('Error', 'Could not delete student. Please try again.', 'error');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all student records and information
                </p>
              </div>
              <Link
                to="/dashboard/admin/student/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Student
              </Link>
            </div>

            {/* Loading Message */}
            {loading && (
              <div className="rounded-md bg-blue-50 p-4">Loading student data...</div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
            )}

            {/* No Students */}
            {!loading && students.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">No students</h3>
                <p className="text-sm text-gray-500">Get started by adding a new student.</p>
                <div className="mt-6">
                  <Link
                    to="/dashboard/admin/student/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add New Student
                  </Link>
                </div>
              </div>
            )}

            {/* Students Table */}
            {students.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={student._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-500">{student._id.slice(0, 8)}...</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">{student.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{student.class}</div>
                            <div className="text-sm text-gray-500">Section: {student.section || 'A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {student.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <Link to={`/dashboard/admin/student/view/${student._id}`} className="text-indigo-600 hover:text-indigo-900">
                              View
                            </Link>
                            <Link to={`/dashboard/admin/student/edit/${student._id}`} className="text-yellow-600 hover:text-yellow-900">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-900">
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

export default Students;
