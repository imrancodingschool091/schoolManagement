import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff,deleteStaff } from '../../features/staffs/staffsSlice';
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Staffs = () => {
  const dispatch = useDispatch();
  const { staffList: staff, loading, error } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This staff member will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteStaff(id)).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Staff member has been deleted.',
          timer: 2000,
          showConfirmButton: false,
        });
        dispatch(fetchStaff());
      } catch (err) {
        Swal.fire('Error', 'Failed to delete staff member. Try again.', 'error');
      }
    }
  };

  const formatRole = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : 'N/A';
  };

  const staffData = Array.isArray(staff) ? staff : [];

  console.log('Current staff data:', staffData); // Debug log

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Staff Members</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all staff accounts and permissions.
                </p>
              </div>
              <Link
                to="/dashboard/admin/staff/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Staff
              </Link>
            </div>

            {loading && <div className="rounded-md bg-blue-50 p-4">Loading staff...</div>}
            {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

            {!loading && staffData.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">No staff members</h3>
                <p className="text-sm text-gray-500">Start by adding a staff member.</p>
                <div className="mt-6">
                  <Link
                    to="/dashboard/admin/staff/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add New Staff
                  </Link>
                </div>
              </div>
            )}

            {!loading && staffData.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffData.map((staffMember, index) => (
                        <tr key={staffMember._id} className={index % 5 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-500">{staffMember._id?.slice(0, 8) || 'N/A'}...</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {staffMember.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{staffMember.email || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatRole(staffMember.role)}
                            {staffMember.superAdmin && ' (Super Admin)'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${staffMember.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {staffMember.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <Link to={`/dashboard/admin/staff/edit/${staffMember._id}`} className="text-yellow-600 hover:text-yellow-900">Edit</Link>
                            {!staffMember.superAdmin && (
                              <button onClick={() => handleDelete(staffMember._id)} className="text-red-600 hover:text-red-900">Delete</button>
                            )}
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

export default Staffs;