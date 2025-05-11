import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchFeesHistoryById,
  updateFeesHistory,
  clearFeesError
} from '../../features/fees/feesSlice';
import { fetchStudents } from '../../features/students/studentsSlice';
import Header from '../../common/Header';
import { handleSuccess } from '../../utils/Message';

function FeesEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Get state from Redux store
  const { entry: currentRecord, loading, error } = useSelector((state) => state.fees);
  const { students, loading: studentsLoading } = useSelector((state) => state.student);

  // Form state with validation
  const [formData, setFormData] = useState({
    studentId: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    feesStatus: 'Pending',
    remarks: ''
  });

  const [errors, setErrors] = useState({
    studentId: '',
    amountPaid: '',
    paymentDate: '',
    paymentMethod: '',
    feesStatus: '',
    form: ''
  });

  // Constants from schema
  const PAYMENT_METHODS = ["Cash", "Credit Card", "Bank Transfer", "Other"];
  const FEE_STATUSES = ["Paid", "Pending", "Partial"];

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchFeesHistoryById(id));
    dispatch(fetchStudents());

    return () => {
      dispatch(clearFeesError());
    };
  }, [dispatch, id]);

  // Update form when record loads
  useEffect(() => {
    if (currentRecord) {
      setFormData({
        studentId: currentRecord.studentId?._id || currentRecord.studentId || '',
        amountPaid: currentRecord.amountPaid?.toString() || '',
        paymentDate: currentRecord.paymentDate 
          ? new Date(currentRecord.paymentDate).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        paymentMethod: currentRecord.paymentMethod || 'Cash',
        feesStatus: currentRecord.feesStatus || 'Pending',
        remarks: currentRecord.remarks || ''
      });
    }
  }, [currentRecord]);

  // Field validation
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
        if (!PAYMENT_METHODS.includes(value)) {
          error = 'Invalid payment method';
        }
        break;
      case 'feesStatus':
        if (!FEE_STATUSES.includes(value)) {
          error = 'Invalid fee status';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};
    
    // Validate each required field
    Object.keys(formData).forEach(key => {
      if (key !== 'remarks') {
        if (!validateField(key, formData[key])) {
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      amountPaid: isNaN(Number(formData.amountPaid)) ? 0 : Number(formData.amountPaid)
    };

    try {
      await dispatch(updateFeesHistory({ 
        id, 
        feesData: submissionData  // Corrected property name
      })).unwrap();
      
      handleSuccess("Fee record updated successfully!");
      navigate("/dashboard/admin/fees");
    } catch (err) {
      console.error('Failed to update fee record:', err);
      setErrors(prev => ({
        ...prev,
        form: err.message || 'Failed to update fee record'
      }));
    }
  };

  // Loading state
  if ((loading && !currentRecord) || studentsLoading) {
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
                <h3 className="text-sm font-medium text-blue-800">Loading fee record</h3>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Record not found</h3>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/admin/fees')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Fees
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
                  <h2 className="text-2xl font-semibold text-gray-800">Edit Fee Record</h2>
                  <p className="mt-1 text-sm text-gray-500">Update the fee payment details</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/admin/fees')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to List
                </button>
              </div>
            </div>

            {/* Error Message */}
            {(error || errors.form) && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error || errors.form}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fees Form */}
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              {/* Student Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
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
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        errors.studentId ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
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
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">
                      Amount Paid (₹) *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="amountPaid"
                        id="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border ${
                          errors.amountPaid ? 'border-red-300' : 'border-gray-300'
                        } rounded-md`}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {errors.amountPaid && (
                      <p className="mt-1 text-sm text-red-600">{errors.amountPaid}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
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

                  <div className="sm:col-span-3">
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method *
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        errors.paymentMethod ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      {PAYMENT_METHODS.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="feesStatus" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="feesStatus"
                      name="feesStatus"
                      value={formData.feesStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        errors.feesStatus ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      required
                    >
                      {FEE_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {errors.feesStatus && (
                      <p className="mt-1 text-sm text-red-600">{errors.feesStatus}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="px-6 py-5 space-y-6">
                <div className="sm:col-span-6">
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
                      Updating...
                    </>
                  ) : 'Update Fee Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeesEdit;