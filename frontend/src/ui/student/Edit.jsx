import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, fetchStudentById, clearStudentError } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess, handleError } from '../../utils/Message';

function Edit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, student: currentStudent } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: 'A',
    dateOfBirth: '',
    gender: 'Male',
    feesStatus: 'Pending',
    active: true,
    address: {
      street: '',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '',
      country: 'India'
    },
    parentDetails: {
      fatherName: '',
      motherName: '',
      contactNumber: ''
    }
  });

  // Fetch student data on mount
  useEffect(() => {
    dispatch(fetchStudentById(id));

    return () => {
      dispatch(clearStudentError());
    };
  }, [dispatch, id]);

  // Set form data once student is loaded
  useEffect(() => {
    if (currentStudent) {
      setFormData({
        ...currentStudent,
        dateOfBirth: currentStudent.dateOfBirth
          ? new Date(currentStudent.dateOfBirth).toISOString().split('T')[0]
          : '',
        address: {
          ...currentStudent.address,
        },
        parentDetails: {
          ...currentStudent.parentDetails,
        },
      });
    }
  }, [currentStudent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: inputValue
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updateStudent({ id, studentData: formData })).unwrap();
      handleSuccess("Student updated successfully!");
      navigate("/dashboard/admin/students");
    } catch (err) {
      handleError(err.message || "Failed to update student");
    }
  };

  if (loading && !currentStudent) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border" />
          <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll Number" className="w-full p-2 border" />
          <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Class" className="w-full p-2 border" />
          <input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="Section" className="w-full p-2 border" />
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select name="feesStatus" value={formData.feesStatus} onChange={handleChange} className="w-full p-2 border">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
            Active
          </label>

          <h3 className="text-xl font-semibold mt-6">Address</h3>
          <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street" className="w-full p-2 border" />
          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" className="w-full p-2 border" />
          <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" className="w-full p-2 border" />
          <input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full p-2 border" />
          <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="Country" className="w-full p-2 border" />

          <h3 className="text-xl font-semibold mt-6">Parent Details</h3>
          <input type="text" name="parentDetails.fatherName" value={formData.parentDetails.fatherName} onChange={handleChange} placeholder="Father's Name" className="w-full p-2 border" />
          <input type="text" name="parentDetails.motherName" value={formData.parentDetails.motherName} onChange={handleChange} placeholder="Mother's Name" className="w-full p-2 border" />
          <input type="text" name="parentDetails.contactNumber" value={formData.parentDetails.contactNumber} onChange={handleChange} placeholder="Contact Number" className="w-full p-2 border" />

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Student</button>
        </form>
      </div>
    </>
  );
}

export default Edit;
