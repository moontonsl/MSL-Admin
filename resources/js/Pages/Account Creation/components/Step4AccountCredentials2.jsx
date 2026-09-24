import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const Step4AccountCredentials = ({
  formData,
  handleInputChange,
  errorMessage,
  setErrorMessage, // <-- Make sure this is passed as a prop from parent!
  verificationCode,
  setVerificationCode
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);


const validateUsername = (username) => {
  return /^[\x20-\x7E]{1,15}$/.test(username);
};
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateUsername(value)) {
      handleInputChange(e);
      setErrorMessage && setErrorMessage("");
    } else {
      setErrorMessage && setErrorMessage("⚠️ Username not allowed or exceeds limits of characters.");
    }
  };
  const isFormValidForSendCode = () => {
    if (!formData.username || formData.username.trim() === "") return false;
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      return false;
    if (!formData.password || formData.password.length < 8) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const handleSendCode = () => {
    if (timer > 0) return;

    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !formData.password ||
      formData.password.length < 8
    ) {
      setErrorMessage && setErrorMessage("⚠️ Please fill out properly the email and password first");
      return;
    }

    if (!formData.username || formData.username.trim() === "") {
      setErrorMessage && setErrorMessage("⚠️ Username is required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage && setErrorMessage("⚠️ Passwords do not match.");
      return;
    }

    setErrorMessage && setErrorMessage("");
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // Add code sending logic here
    fetch('/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ email: formData.email })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          // Optionally show a success message
          setErrorMessage && setErrorMessage("✅ " + data.message);
          setVerificationCode && setVerificationCode(data.code);
          console.log(data.code);
        }
      })
      .catch(error => {
        setErrorMessage && setErrorMessage("❌ Failed to send code. Please try again.");
    });
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);
  
  return (
    <div className="">
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <div className="image-container-register">
        <img src="msl-logo.png" alt="MSL Account Logo" className="image-logo-register" />
      </div>

      {/* Dynamic Progress Bar for Step 4 */}
      {(() => {
        const requiredFields = [
          "username",
          "password",
          "confirmPassword",
          "email",
          "captcha"
        ];
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        const percent = 76 + Math.round((filled / requiredFields.length) * (100 - 76));

        return (
          <div style={{ margin: "16px 0" }}>
            <div style={{ height: "12px", background: "#eee", borderRadius: "6px", overflow: "hidden", marginBottom: "4px" }}>
              <div style={{ width: `${percent}%`, height: "100%", background: "#f1c40f", transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 4 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="username" className="label-register">
            Username<span className="required"> *</span>
          </label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleUsernameChange} className="input-field-register" placeholder="e.g. Simoun" required maxLength={15} autoComplete="off" />
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="password" className="label-register">
            Create a password<span className="required"> *</span>
          </label>
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} className="input-field-register" placeholder="must be 8 characters" required />
            <button type="button" className="eye-icon-login" onClick={() => setShowPassword((v) => !v)} >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="confirmPassword" className="label-register">
            Confirm password<span className="required"> *</span>
          </label>
          <div className="password-container">
            <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="input-field-register" placeholder="repeat password" required />
            <button type="button" className="eye-icon-login" onClick={() => setShowConfirmPassword((v) => !v)} >
              {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="email" className="label-register">
            Email Address<span className="required"> *</span>
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field-register" placeholder="e.g. crislbarra@gmail.com" required style={{ flex: 3, marginRight: 8 }} />
            <button type="button" className="register-btn-sendcode" style={{ flex: 1, minWidth: 0, background: timer > 0 ? "#fffbe6" : "", color: timer > 0 ? "gray" : "", borderColor: timer > 0 ? "#f1c40f" : "", cursor: timer > 0 ? "not-allowed" : "pointer" }} onClick={handleSendCode} disabled={ timer > 0 || !isFormValidForSendCode() } title={ !isFormValidForSendCode() ? "Fill out all fields correctly to enable" : timer > 0 ? `Please wait ${timer}s before resending` : "" } >
              {timer > 0 ? `Resend in ${timer}s` : "Send Code"}
            </button>
          </div>
        </div>
      </div>

      <div className="form-row-register">
        <div className="input-group-register full-width-register">
          <label htmlFor="captcha" className="label-register">
            Code <span className="required"> *</span>
          </label>
          <input type="text" id="captcha" name="captcha" value={formData.captcha} onChange={handleInputChange} className="input-field-register captcha-input" placeholder="Enter the code" required style={{ flex: 3 }} />
        </div>
      </div>

    </div>
  );
};

export default Step4AccountCredentials;
