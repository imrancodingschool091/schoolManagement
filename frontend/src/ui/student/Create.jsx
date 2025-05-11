import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addStudent } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess, handleError } from '../../utils/Message';

function Create() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    dateOfBirth: '',
    gender: 'Male',
    feesStatus: 'Pending',
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

  // Validate date of birth (must be at least 5 years old)
  const validateDateOfBirth = (date) => {
    const dob = new Date(date);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return dob <= minDate;
  };

  // Validate postal code (basic Indian postal code validation)
  const validatePostalCode = (code) => {
    return /^[1-9][0-9]{5}$/.test(code);
  };

  // Validate contact number (10 digits)
  const validateContactNumber = (number) => {
    return /^[0-9]{10}$/.test(number);
  };

  // Validate name (letters and spaces only)
  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (!validateName(value)) error = 'Name can only contain letters and spaces';
        else if (value.length > 50) error = 'Name cannot exceed 50 characters';
        break;
        
      case 'rollNumber':
        if (!value.trim()) error = 'Roll number is required';
        else if (value.length > 20) error = 'Roll number cannot exceed 20 characters';
        break;
        
      case 'class':
        if (!value) error = 'Class is required';
        break;
        
      case 'section':
        if (!value) error = 'Section is required';
        break;
        
      case 'dateOfBirth':
        if (!value) error = 'Date of birth is required';
        else if (!validateDateOfBirth(value)) error = 'Student must be at least 5 years old';
        break;
        
      case 'address.street':
        if (!value.trim()) error = 'Street address is required';
        else if (value.length > 100) error = 'Street address cannot exceed 100 characters';
        break;
        
      case 'address.postalCode':
        if (!value.trim()) error = 'Postal code is required';
        else if (!validatePostalCode(value)) error = 'Invalid postal code (must be 6 digits)';
        break;
        
      case 'address.city':
        if (!value.trim()) error = 'City is required';
        break;
        
      case 'address.state':
        if (!value.trim()) error = 'State is required';
        break;
        
      case 'address.country':
        if (!value.trim()) error = 'Country is required';
        break;
        
      case 'parentDetails.fatherName':
        if (!value.trim()) error = "Father's name is required";
        else if (!validateName(value)) error = "Father's name can only contain letters and spaces";
        else if (value.length > 50) error = "Father's name cannot exceed 50 characters";
        break;
        
      case 'parentDetails.motherName':
        if (!value.trim()) error = "Mother's name is required";
        else if (!validateName(value)) error = "Mother's name can only contain letters and spaces";
        else if (value.length > 50) error = "Mother's name cannot exceed 50 characters";
        break;
        
      case 'parentDetails.contactNumber':
        if (!value.trim()) error = 'Contact number is required';
        else if (!validateContactNumber(value)) error = 'Invalid contact number (must be 10 digits)';
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      handleError("Please fix the errors in the form");
      return;
    }
    
    dispatch(addStudent(formData))
      .unwrap()
      .then(() => {
        handleSuccess("New Student Created!");
        setTimeout(() => {
          navigate("/dashboard/admin/students");
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to create student:', err);
        handleError(err.message || "Failed to create student");
      });
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Add New Student</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in the details to register a new student</p>
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
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
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
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
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

                  <div className="sm:col-span-3">
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
                  ) : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Create;