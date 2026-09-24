import React, { useState } from 'react';


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
      handleInputChange({ target: { name: 'age', value: "test2" } });
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
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <h2 className="subtitle-register">BASIC DETAILS</h2>
      {/* Dynamic Progress Bar for Step 1 */}
      {(() => {
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        const percent = Math.round((filled / requiredFields.length) * 25);

        return (
          <div style={{ margin: "16px 0" }}>
            <div style={{
              height: "12px",
              background: "#eee",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "4px"
            }}>
              <div style={{
                width: `${percent}%`,
                height: "100%",
                background: "#f1c40f",
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 1 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}


      <div className="form-row-register">
        <div className="input-group-register left-side-register">
          <label htmlFor="firstName" className="label-register">
            First Name<span className="required"> *</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleAnyInputChange}
            onBlur={handleAnyInputBlur}
            className="input-field-register"
            placeholder="e.g. Crisostomo"
            required
          />
        </div>
        <div className="input-group-register right-side-register">
          <label htmlFor="lastName" className="label-register">
            Last Name<span className="required"> *</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleAnyInputChange}
            onBlur={handleAnyInputBlur}
            className="input-field-register"
            placeholder="e.g. Ibarra"
            required
          />
        </div>
      </div>
      <div className="form-row-register">
        <div className="input-group-register left-side-register">
          <label htmlFor="suffix" className="label-register">
            Suffix
          </label>
          <select
            id="suffix"
            name="suffix"
            value={formData.suffix}
            onChange={handleAnyInputChange}
            onBlur={handleAnyInputBlur}
            className="input-field-register suffix-select"
          >
            <option value=""></option>
            <option value="Jr">Jr</option>
            <option value="Sr">Sr</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>
        </div>
        <div className="input-group-register left-side-register">
          <label htmlFor="gender" className="label-register" >
            Gender <span className="required"> *</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleAnyInputChange}
            onBlur={handleAnyInputBlur}
            className="input-field-register gender-select"
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="birthday" className="label-register">
            Birthday<span className="required"> *</span>
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            max={new Date().toISOString().split('T')[0]}
            value={formData.birthday}
            onChange={handleBirthdayChange}
            className={`input-field-register birthday ${!formData.birthday ? 'mobile-date-placeholder' : ''}`}
            required
          />
        </div>
      </div>
      <div className="form-row-register">
        <div className="input-group-register right-side-register">
          <label htmlFor="age" className="label-register">
            Age<span className="required"> *</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleAnyInputChange}
            className="input-field-register"
            readOnly
          />
        </div>
        <div className="input-group-register right-side-register">
          <label htmlFor="contactNo" className="label-register">
            Contact No.<span className="required"> *</span>
          </label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleContactChange}
            onBlur={handleContactBlur}
            className="input-field-register"
            placeholder="e.g. 09123456789"
            required
          />
        </div>
      </div>
      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="facebookLink" className="label-register">
            Facebook Profile Link<span className="required"> *</span>
          </label>
          <input
            type="text"
            id="facebookLink"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={handleAnyInputChange}
            onBlur={handleAnyInputBlur}
            className="input-field-register"
            placeholder="e.g. http://facebook.com/username"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Step1BasicDetails;
