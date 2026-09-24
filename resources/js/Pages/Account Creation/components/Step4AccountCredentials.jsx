import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from '../register.module.scss';

const Step4AccountCredentials = ({
  formData,
  handleInputChange,
  errorMessage,
  setErrorMessage,
  successMessage, // <--- Add this prop
  setSuccessMessage, // <--- Add this prop
  verificationCode,
  setVerificationCode
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const validateUsername = (username) => /^[A-Za-z0-9._-]{1,15}$/.test(username);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateUsername(value)) {
      handleInputChange(e);
      setErrorMessage && setErrorMessage("");
    } else {
      setErrorMessage && setErrorMessage("⚠️ Username can only contain letters, numbers, dot (.), underscore (_), or dash (-).");
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

    // Clear any previous messages
    setErrorMessage && setErrorMessage("");
    setSuccessMessage && setSuccessMessage("");

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
          setSuccessMessage && setSuccessMessage(`✅ ${data.message}</span>`);
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
      <h1 className={`${styles['title-register']} text-white mb-2 text-2xl md:text-[2.5rem]`}>
        CREATE MSL ACCOUNT
      </h1>
      <h2 className={`${styles['subtitle-register']} text-white`}>
        LOGIN DETAILS
      </h2>

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
          <div className="my-4 px-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-xs text-gray-100 text-right">
              Step 4 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col mb-4 gap-4">
        {/* Username */}
        <div className="w-full">
          <label htmlFor="username" className="block mb-1 text-white">
            Username<span className={styles.required}> *</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleUsernameChange}
            maxLength={15}
            autoComplete="off"
            required
            placeholder="e.g. Simoun"
            className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label htmlFor="password" className="block mb-1 text-white">
            Create a password<span className={styles.required}> *</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="must be 8 characters"
              required
              className={`${styles['input-field-register']} w-full p-3 pr-12 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white"
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full">
          <label htmlFor="confirmPassword" className="block mb-1 text-white">
            Confirm password<span className={styles.required}> *</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="repeat password"
              required
              className={`${styles['input-field-register']} w-full p-3 pr-12 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white"
            >
              {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="w-full">
          <label htmlFor="email" className="block mb-1 text-white">
            Email Address<span className={styles.required}> *</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. crislbarra@gmail.com"
              required
              className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={timer > 0 || !isFormValidForSendCode()}
              title={
                !isFormValidForSendCode()
                  ? "Fill out all fields correctly to enable"
                  : timer > 0
                  ? `Please wait ${timer}s before resending`
                  : ""
              }
              className={`h-[48px] px-4 rounded-lg border text-sm min-w-[8rem] ${
                timer > 0
                  ? "bg-yellow-100 text-gray-500 border-yellow-400 cursor-not-allowed"
                  : "bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-300"
              }`}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Send Code"}
            </button>
          </div>
        </div>

        {/* Captcha */}
        <div className="w-full">
          <label htmlFor="captcha" className="block mb-1 text-white">
            Code<span className={styles.required}> *</span>
          </label>
          <input
            type="text"
            id="captcha"
            name="captcha"
            value={formData.captcha}
            onChange={handleInputChange}
            placeholder="Enter the code"
            required
            className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4AccountCredentials;