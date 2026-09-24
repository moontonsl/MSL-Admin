import React, { useState } from 'react';
import styles from '../register.module.scss';
import { CalendarDays } from 'lucide-react';

const Step1BasicDetails = ({
  formData,
  handleInputChange,
  setErrorMessage,
}) => {
  const [localError, setLocalError] = useState('');

  const requiredFields = [
    'firstName',
    'lastName',
    'gender',
    'birthday',
    'age',
    'contactNo',
    'facebookLink',
  ];

  const validateForm = () => {
    if (formData.contactNo && !/^09\d{9}$/.test(formData.contactNo)) {
      setErrorMessage('⚠️ Invalid number. Must be 11 digits and start with 09.');
      return false;
   }
   return true;
  };

  const handleAnyInputChange = (e) => {
    handleInputChange(e);
    validateForm();
  };

  const handleAnyInputBlur = () => {
    validateForm();
  };

  const handleBirthdayChange = (e) => {
    const inputDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      setErrorMessage('⚠️ Selected dates are not allowed. Please select a valid birthday.');
      handleInputChange({ target: { name: 'age', value: "test3" } });
      return;
    }

    let age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
      age -= 1;
    }

    if (age < 16) {
      setErrorMessage('⚠️ Age not allowed. Must be 16 or above.');
      handleInputChange(e);
      handleInputChange({ target: { name: 'age', value: "" } });
      return;
    }

    if (age > 130) {
      setErrorMessage('⚠️ Age not allowed.');
      handleInputChange(e);
      handleInputChange({ target: { name: 'age', value: '' } });
      return;
    }

    // If valid, clear error
    setErrorMessage('');
    handleInputChange(e);
    
    handleInputChange({ target: { name: 'age', value: age } });
    handleInputChange({ target: { name: 'birthday', value: e.target.value } });
    console.log(formData);
    validateForm();
  };

  const handleContactChange = (e) => {
    const contact = e.target.value;
    if (/^\d*$/.test(contact) && contact.length <= 11) {
      handleInputChange(e);
      // If valid, clear error while typing
      if (/^09\d{9}$/.test(contact)) {
        setErrorMessage('');
      }
      validateForm();
    }
  };

  const handleContactBlur = (e) => {
    const contact = e.target.value;
    if (!/^09\d{9}$/.test(contact)) {
      setErrorMessage('⚠️ Invalid number. Must be 11 digits and start with 09.');
    } else {
      setErrorMessage('');
    }
    validateForm();
  };

  return (
<div className="">
  <h1 className={`${styles['title-register']} text-white mb-2 text-2xl md:text-[2.5rem]`}>
    CREATE MSL ACCOUNT
  </h1>
  <h2 className={`${styles['subtitle-register']} text-white`}>
    BASIC DETAILS
  </h2>

  {/* Progress Bar */}
  {(() => {
    const filled = requiredFields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    ).length;
    const percent = Math.round((filled / requiredFields.length) * 25);

    return (
      <div className="my-4 px-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-xs text-gray-100 text-right">
          Step 1 of 4 &mdash; {percent}% of this step complete
        </div>
      </div>
    );
  })()}

  {/* First Name & Last Name */}
  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
    <div className="w-full">
      <label htmlFor="firstName" className={`${styles['label-register']} block mb-1`}>
        First Name<span className={styles.required}> *</span>
      </label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        placeholder="e.g. Crisostomo"
        required
      />
    </div>
    <div className="w-full">
      <label htmlFor="lastName" className={`${styles['label-register']} block mb-1`}>
        Last Name<span className={styles.required}> *</span>
      </label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        placeholder="e.g. Ibarra"
        required
      />
    </div>
  </div>

  {/* Suffix & Gender */}
  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
    <div className="w-full">
      <label htmlFor="suffix" className={`${styles['label-register']} block mb-1`}>
        Suffix
      </label>
      <select
        id="suffix"
        name="suffix"
        value={formData.suffix}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} ${styles['suffix-select']} appearance-none bg-[url('data:image/svg+xml;base64,...')] bg-no-repeat bg-right-4 bg-center bg-3 bg-transparent pr-12 text-white border border-gray-700 bg-gray-900 bg-opacity-70 cursor-pointer w-full p-3 rounded-lg text-base focus:outline-none focus:border-yellow-400`}
      >
        <option value=""></option>
        <option value="Jr">Jr</option>
        <option value="Sr">Sr</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
      </select>
    </div>
    <div className="w-full">
      <label htmlFor="gender" className={`${styles['label-register']} block mb-1`}>
        Gender <span className={styles.required}> *</span>
      </label>
      <select
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} ${styles['gender-select']} appearance-none bg-[url('data:image/svg+xml;base64,...')] bg-no-repeat bg-right-4 bg-center bg-3 bg-transparent pr-12 text-white border border-gray-700 bg-gray-900 bg-opacity-70 cursor-pointer w-full p-3 rounded-lg text-base focus:outline-none focus:border-yellow-400`}
        required
      >
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    </div>
  </div>

  {/* Birthday */}
  <div className="mb-4">
    <div className="w-full relative">
      <label htmlFor="birthday" className={`${styles['label-register']} block mb-1`}>
        Birthday<span className={styles.required}> *</span>
      </label>
      <input
        type="date"
        id="birthday"
        name="birthday"
        max={new Date().toISOString().split('T')[0]}
        value={formData.birthday}
        onChange={handleBirthdayChange}
        className={`
          ${styles['input-field-register']} 
          ${!formData.birthday ? 'mobile-date-placeholder' : ''} 
          w-full p-3 text-white 
          border border-gray-700 bg-gray-900 bg-opacity-70 
          rounded-lg text-base placeholder-gray-500 
          focus:outline-none focus:border-yellow-400
          md:appearance-auto appearance-none
        `}
        placeholder="Please click to select a date"
        required
      />
      <CalendarDays className="absolute top-[65%] right-3 -translate-y-1/2 text-gray-400 w-5 h-5 md:hidden pointer-events-none" />
    </div>
  </div>

  {/* Age & Contact No. */}
  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
    <div className="w-full">
      <label htmlFor="age" className={`${styles['label-register']} block mb-1`}>
        Age<span className={styles.required}> *</span>
      </label>
      <input
        type="number"
        id="age"
        name="age"
        value={formData.age}
        onChange={handleAnyInputChange}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        readOnly
      />
    </div>
    <div className="w-full">
      <label htmlFor="contactNo" className={`${styles['label-register']} block mb-1`}>
        Contact No.<span className={styles.required}> *</span>
      </label>
      <input
        type="text"
        id="contactNo"
        name="contactNo"
        value={formData.contactNo}
        onChange={handleContactChange}
        onBlur={handleContactBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        placeholder="e.g. 09123456789"
        required
      />
    </div>
  </div>

  {/* Facebook Profile Link */}
  <div className="mb-8">
    <div className="w-full">
      <label htmlFor="facebookLink" className={`${styles['label-register']} block mb-1`}>
        Facebook Profile Link<span className={styles.required}> *</span>
      </label>
      <input
        type="text"
        id="facebookLink"
        name="facebookLink"
        value={formData.facebookLink}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        placeholder="e.g. http://facebook.com/username"
        required
      />
    </div>
  </div>
</div>

  );
};

export default Step1BasicDetails;
