import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import Step1BasicDetails from './components/Step1BasicDetails.jsx';
import Step2EducationDetails from './components/Step2EducationDetails.jsx';
import Step3GameDetails from './components/Step3GameDetails.jsx';
import Step4AccountCredentials from './components/Step4AccountCredentials.jsx';
import webBg2025 from './assets/webbg2025.png';
import './register.css';

const initialFormData = {
    // Step 1
    firstName: '', lastName: '', suffix: '', birthday: '', age: 0, gender: '', contactNo: '', facebookLink: '',
    // Step 2
    yearLevel: '', university: '', island: '', region: '', studentId: '', course: '', proofOfEnrollment: null,
    // Step 3
    userId: '', serverId: '', ign: '', squadName: '', squadAbbreviation: '', rank: '', inGameRole: '', mainHero: '',
    // Step 4
    username: '', password: '', confirmPassword: '', email: '', captcha: ''
};

const fileTypeIsValid = (file, allowedTypes) =>
    file && allowedTypes.includes(file.type);

const Register = () => {
    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));

        // setData(prev => ({
        //     ...prev,
        //     [name]: type === 'file' ? files[0] : value
        // }));
        setData(formData);
    };

    const handleNext = () => {
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrev = () => {
        setErrorMessage("");
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid(currentStep)) return;
        setErrorMessage("");
        // console.log(data);
        // setData(formData);

        post(route('register'), {
            onStart: () => {
                console.log("Starting registration...");
                setErrorMessage(""); // Clear any previous errors
            },
            onSuccess: (response) => {
                console.log("Registration successful:", response);
                setErrorMessage("");
                // Reset form data to initial state
                reset();
                // Reset to first step
                setCurrentStep(1);
                // Optional: Show success message
                alert("Account created successfully!");
                // Optional: Redirect
                // window.location.href = '/login';
            },
            onError: (errors) => {
                console.error("Registration failed:", errors);

                // Handle validation errors
                if (errors) {
                    // If there are specific field errors
                    const errorMessages = Object.values(errors).flat();
                    setErrorMessage(`⚠️ ${errorMessages.join(', ')}`);

                    // Or handle specific errors
                    if (errors.email) {
                        setErrorMessage(`⚠️ Email: Email has already been taken.`);
                    } else if (errors.username) {
                        setErrorMessage(`⚠️ Username: Username has already been taken.`);
                    }else if (errors.userId) {
                        setErrorMessage(`⚠️ ML Account: The ML Account has already been taken.`);
                    } else {
                        setErrorMessage("⚠️ Please check your information and try again.");
                    }
                }
            },
            onFinish: () => {
                console.log("Request finished (success or error)");
                // reset('password', 'confirmPassword'); // Clear sensitive fields
            },
            preserveScroll: true, // Keep scroll position
            preserveState: true,  // Keep form state on errors
        });
        // Optionally reset form or redirect here

        setFormData(initialFormData);

        setCurrentStep(1);
    };

    function isFormValid(step) {
        const requireFields = (fields) =>
            fields.every(f => (formData[f] && formData[f].toString().trim() !== ""));

        switch (step) {
            case 1:
                if (!requireFields(['firstName', 'lastName', 'gender', 'birthday', 'age', 'contactNo', 'facebookLink'])) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                break;
            case 2: {
                const required = ['yearLevel', 'university', 'island', 'region', 'studentId', 'course', 'proofOfEnrollment'];
                if (!requireFields(required)) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
                if (!fileTypeIsValid(formData.proofOfEnrollment, allowedTypes)) {
                    setErrorMessage("⚠️ File must be an image (jpg, jpeg, png) or PDF.");
                    return false;
                }
                break;
            }
            case 3: {
                const required = ['userId', 'serverId', 'rank', 'inGameRole', 'mainHero'];
                if (!requireFields(required)) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                break;
            }
            case 4: {
                const { username, password, confirmPassword, email, captcha } = formData;
                if (!requireFields(['username', 'password', 'confirmPassword', 'email', 'captcha'])) {
                    setErrorMessage("⚠️ Please fill in all the required fields.");
                    return false;
                }
                if (password.length < 8) {
                    setErrorMessage("⚠️ Password must be at least 8 characters.");
                    return false;
                }
                if (password !== confirmPassword) {
                    setErrorMessage("⚠️ Passwords do not match.");
                    return false;
                }
                if (captcha != verificationCode) {
                    console.log(verificationCode);
                    setErrorMessage("⚠️ Incorrect code.");
                    return false;
                }
                break;
            }
            default:
                setErrorMessage("⚠️ Invalid step.");
                return false;
        }
        setErrorMessage("");
        return true;
    }

    const stepProps = {
        formData,
        handleInputChange,
        errorMessage,
        setErrorMessage,
        handleSubmit,
        verificationCode,
        setVerificationCode
    };

    const stepComponents = {
        1: <Step1BasicDetails {...stepProps} />,
        2: <Step2EducationDetails {...stepProps} />,
        3: <Step3GameDetails {...stepProps} />,
        4: <Step4AccountCredentials {...stepProps} />
    };

    return (
        <>
        <Head title="Register Account" />
        <Header />
            <main>
                <div className="register-main-bg">


                    {/* <img src={webBg2025} className="background-image-register" alt="Web Background" /> */}



                    <div className={currentStep === 4? `form-container-register-step4${errorMessage ? ' has-error' : ''}`: `form-container-register${errorMessage ? ' has-error' : ''}`}>
                        <form onSubmit={handleSubmit} className="form-register">
                            {stepComponents[currentStep]}
                                {errorMessage && (
                                    <div className="error-message">
                                        <p>{errorMessage}</p>
                                    </div>
                                )}
                            <div className="navigation-buttons">
                                {currentStep > 1 && (
                                    <button type="button" onClick={handlePrev} className="register-btn">
                                        Prev
                                    </button>
                                )}
                                {currentStep < 4 ? (
                                    <button type="button" onClick={handleNext} className="register-btn">
                                        Next
                                    </button>
                                ) : (
                                    <button type="submit" className="register-btn">
                                        Submit
                                    </button>
                                )}
                            </div>
                            <div className="footer-container-register">
                                <p className="footer-text-register">
                                    Already have an account?&nbsp;<a href="/login" className="sign-in-link-register">Login here</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        <Footer />
    </>
    );
};

export default Register;
