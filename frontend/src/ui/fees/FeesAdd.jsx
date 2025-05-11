import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFeesHistory } from '../../features/fees/feesSlice';
import { fetchStudents } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess } from '../../utils/Message';

function FeesAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get necessary state from Redux store
  const { loading, error } = useSelector((state) => state.fees);
  const { students, loading: studentsLoading } = useSelector((state) => state.student);

  // Initialize form state
  const [formData, setFormData] = useState({
    studentId: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    feesStatus: 'Pending', // Changed default to match schema
    remarks: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({
    studentId: '',
    amountPaid: '',
    paymentDate: '',
    paymentMethod: '',
    feesStatus: ''
  });

  // Payment method options from schema
  const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "Other"];
  
  // Fees status options from schema
  const feesStatuses = ["Paid", "Pending", "Partial"];

  // Fetch students when component mounts
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'studentId':
        if (!value) error = 'Student is required';
        break;
      case 'amountPaid':
        if (!value) {
          error = 'Amount is required';
        } else if (isNaN(value) || Number(value) <= 0) {
          error = 'Amount must be a positive number';
        }
        break;
      case 'paymentDate':
        if (!value) error = 'Payment date is required';
        break;
      case 'paymentMethod':
        if (!paymentMethods.includes(value)) {
          error = 'Invalid payment method';
        }
        break;
      case 'feesStatus':
        if (!feesStatuses.includes(value)) {
          error = 'Invalid fee status';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field as user types
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // Validate entire form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field
    Object.keys(formData).forEach(key => {
      if (key !== 'remarks') { // remarks is optional
        if (!validateField(key, formData[key])) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare the data for submission
    const submissionData = {
      ...formData,
      amountPaid: Number(formData.amountPaid),
      studentId: formData.studentId
    };

    try {
      await dispatch(addFeesHistory(submissionData)).unwrap();
      handleSuccess("Fee payment recorded successfully!");
      setTimeout(() => navigate("/dashboard/admin/fees"), 1000);
    } catch (err) {
      console.error('Failed to record fee payment:', err);
    }
  };

  // Handle blur events for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Record New Fee Payment</h2>
              <p className="mt-1 text-sm text-gray-600">Fill in the payment details</p>
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

            {/* Fees Form */}
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              {/* Student Information Section */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
                
                {/* Student Selector */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                      Student *
                    </label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                        errors.studentId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={studentsLoading}
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} (Roll: {student.rollNumber}, Class: {student.class}-{student.section})
                        </option>
                      ))}
                    </select>
                    {errors.studentId && (
                      <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                    )}
                    {studentsLoading && (
                      <p className="mt-1 text-sm text-gray-500">Loading students...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount Paid */}
                  <div>
                    <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">
                      Amount Paid (₹) *
                    </label>
                    <input
                      type="number"
                      name="amountPaid"
                      id="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${
                        errors.amountPaid ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter amount"
                    />
                    {errors.amountPaid && (
                      <p className="mt-1 text-sm text-red-600">{errors.amountPaid}</p>
                    )}
                  </div>

                  {/* Payment Date */}
                  <div>
                    <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      id="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border ${
                        errors.paymentDate ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      required
                    />
                    {errors.paymentDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Method */}
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method *
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                        errors.paymentMethod ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                    )}
                  </div>

                  {/* Fees Status */}
                  <div>
                    <label htmlFor="feesStatus" className="block text-sm font-medium text-gray-700">
                      Payment Status *
                    </label>
                    <select
                      id="feesStatus"
                      name="feesStatus"
                      value={formData.feesStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                        errors.feesStatus ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      {feesStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.feesStatus && (
                      <p className="mt-1 text-sm text-red-600">{errors.feesStatus}</p>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={3}
                    value={formData.remarks}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Any additional notes about this payment"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/admin/fees')}
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
                  ) : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeesAdd;