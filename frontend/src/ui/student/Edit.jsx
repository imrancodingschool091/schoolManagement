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

  const [errors, setErrors] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    parentDetails: {
      fatherName: '',
      motherName: '',
      contactNumber: ''
    }
  });

  // Load student data when component mounts or ID changes
  useEffect(() => {
    dispatch(fetchStudentById(id));
    
    return () => {
      dispatch(clearStudentError());
    };
  }, [dispatch, id]);

  // Update form data when currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      const formattedStudent = {
        ...currentStudent,
        dateOfBirth: currentStudent.dateOfBirth ? new Date(currentStudent.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
          street: currentStudent.address?.street || '',
          city: currentStudent.address?.city || 'Delhi',
          state: currentStudent.address?.state || 'Delhi',
          postalCode: currentStudent.address?.postalCode || '',
          country: currentStudent.address?.country || 'India'
        },
        parentDetails: {
          fatherName: currentStudent.parentDetails?.fatherName || '',
          motherName: currentStudent.parentDetails?.motherName || '',
          contactNumber: currentStudent.parentDetails?.contactNumber || ''
        }
      };
      setFormData(formattedStudent);
    }
  }, [currentStudent]);

  // Validate date of birth (must be at least 5 years old)
  const validateDateOfBirth = (date) => {
    if (!date) return 'Date of birth is required';
    const dob = new Date(date);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return dob <= minDate ? '' : 'Student must be at least 5 years old';
  };

  // Validate postal code (basic Indian postal code validation)
  const validatePostalCode = (code) => {
    if (!code) return 'Postal code is required';
    return /^[1-9][0-9]{5}$/.test(code) ? '' : 'Invalid postal code (must be 6 digits)';
  };

  // Validate contact number (10 digits)
  const validateContactNumber = (number) => {
    if (!number) return 'Contact number is required';
    return /^[0-9]{10}$/.test(number) ? '' : 'Invalid contact number (must be 10 digits)';
  };

  // Validate name (letters and spaces only)
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    if (name.length > 50) return 'Name cannot exceed 50 characters';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'rollNumber':
        if (!value.trim()) return 'Roll number is required';
        if (value.length > 20) return 'Roll number cannot exceed 20 characters';
        return '';
      case 'class':
        return !value ? 'Class is required' : '';
      case 'section':
        return !value ? 'Section is required' : '';
      case 'dateOfBirth':
        return validateDateOfBirth(value);
      case 'address.street':
        if (!value.trim()) return 'Street address is required';
        if (value.length > 100) return 'Street address cannot exceed 100 characters';
        return '';
      case 'address.postalCode':
        return validatePostalCode(value);
      case 'address.city':
        return !value.trim() ? 'City is required' : '';
      case 'address.state':
        return !value.trim() ? 'State is required' : '';
      case 'address.country':
        return !value.trim() ? 'Country is required' : '';
      case 'parentDetails.fatherName':
        if (!value.trim()) return "Father's name is required";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Father's name can only contain letters and spaces";
        if (value.length > 50) return "Father's name cannot exceed 50 characters";
        return '';
      case 'parentDetails.motherName':
        if (!value.trim()) return "Mother's name is required";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Mother's name can only contain letters and spaces";
        if (value.length > 50) return "Mother's name cannot exceed 50 characters";
        return '';
      case 'parentDetails.contactNumber':
        return validateContactNumber(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Clear previous error for this field
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setErrors(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: ''
        }
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Update form data
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: inputValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setErrors(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: error
        }
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate top-level fields
    const topLevelFields = ['name', 'rollNumber', 'class', 'section', 'dateOfBirth'];
    topLevelFields.forEach(field => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });
    
    // Validate address fields
    const addressFields = ['street', 'city', 'state', 'postalCode', 'country'];
    addressFields.forEach(field => {
      const error = validateField(`address.${field}`, formData.address[field]);
      newErrors.address[field] = error;
      if (error) isValid = false;
    });
    
    // Validate parent details
    const parentFields = ['fatherName', 'motherName', 'contactNumber'];
    parentFields.forEach(field => {
      const error = validateField(`parentDetails.${field}`, formData.parentDetails[field]);
      newErrors.parentDetails[field] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      handleError("Please fix the errors in the form");
      return;
    }
    
    try {
      await dispatch(updateStudent({ id, studentData: formData })).unwrap();
      handleSuccess("Student updated successfully!");
      navigate("/dashboard/admin/students");
    } catch (error) {
      console.error('Failed to update student:', error);
      handleError(error.message || "Failed to update student");
    }
  };

  // Helper function to check if a field has an error
  const hasError = (fieldPath) => {
    const parts = fieldPath.split('.');
    let value = errors;
    
    for (const part of parts) {
      if (value[part] === undefined) return false;
      value = value[part];
    }
    
    return Boolean(value);
  };

  // Helper function to get error message
  const getError = (fieldPath) => {
    const parts = fieldPath.split('.');
    let value = errors;
    
    for (const part of parts) {
      if (value[part] === undefined) return '';
      value = value[part];
    }
    
    return value;
  };

  if (loading && !currentStudent) {
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
                <h3 className="text-sm font-medium text-blue-800">Loading student data</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Please wait while we fetch the student record...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentStudent && !loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Student not found</h3>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/admin/students')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Students
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
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Student</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update the student details below
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/admin/students')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to List
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 mx-6 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error updating student</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student Form */}
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200" noValidate>
              {/* Basic Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('name') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      id="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('rollNumber') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('rollNumber') && (
                      <p className="mt-1 text-sm text-red-600">{getError('rollNumber')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                      Class
                    </label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${hasError('class') ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      <option value="">Select Class</option>
                      {[9, 10, 11, 12].map(grade => (
                        <option key={grade} value={grade}>Class {grade}</option>
                      ))}
                    </select>
                    {hasError('class') && (
                      <p className="mt-1 text-sm text-red-600">{getError('class')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${hasError('section') ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      {['A', 'B', 'C'].map(section => (
                        <option key={section} value={section}>Section {section}</option>
                      ))}
                    </select>
                    {hasError('section') && (
                      <p className="mt-1 text-sm text-red-600">{getError('section')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('dateOfBirth') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('dateOfBirth') && (
                      <p className="mt-1 text-sm text-red-600">{getError('dateOfBirth')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="feesStatus" className="block text-sm font-medium text-gray-700">
                      Fees Status
                    </label>
                    <select
                      id="feesStatus"
                      name="feesStatus"
                      value={formData.feesStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex items-end">
                    <div className="flex items-center h-5">
                      <input
                        id="active"
                        name="active"
                        type="checkbox"
                        checked={formData.active}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="active" className="font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      id="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('address.street') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('address.street') && (
                      <p className="mt-1 text-sm text-red-600">{getError('address.street')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      id="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('address.postalCode') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('address.postalCode') && (
                      <p className="mt-1 text-sm text-red-600">{getError('address.postalCode')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      id="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('address.city') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('address.city') && (
                      <p className="mt-1 text-sm text-red-600">{getError('address.city')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      id="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('address.state') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('address.state') && (
                      <p className="mt-1 text-sm text-red-600">{getError('address.state')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      id="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('address.country') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('address.country') && (
                      <p className="mt-1 text-sm text-red-600">{getError('address.country')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Parent Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="parentDetails.fatherName" className="block text-sm font-medium text-gray-700">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="parentDetails.fatherName"
                      id="parentDetails.fatherName"
                      value={formData.parentDetails.fatherName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('parentDetails.fatherName') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('parentDetails.fatherName') && (
                      <p className="mt-1 text-sm text-red-600">{getError('parentDetails.fatherName')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="parentDetails.motherName" className="block text-sm font-medium text-gray-700">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="parentDetails.motherName"
                      id="parentDetails.motherName"
                      value={formData.parentDetails.motherName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('parentDetails.motherName') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {hasError('parentDetails.motherName') && (
                      <p className="mt-1 text-sm text-red-600">{getError('parentDetails.motherName')}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="parentDetails.contactNumber" className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="parentDetails.contactNumber"
                      id="parentDetails.contactNumber"
                      value={formData.parentDetails.contactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${hasError('parentDetails.contactNumber') ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                    />
                    {hasError('parentDetails.contactNumber') ? (
                      <p className="mt-1 text-sm text-red-600">{getError('parentDetails.contactNumber')}</p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">10 digit mobile number</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/students')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Update Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;