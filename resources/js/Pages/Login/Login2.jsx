import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Header, Footer } from '@/Components';
import './login.css';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'react-feather';
import axios from 'axios';
const Login = () => {
  const { post, data, setData } = useForm({
    username: '',
    password: '',
    remember: false,
});
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showMLBBModal, setShowMLBBModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setData({
      ...data,
      [name]: value,
    });
    setError(''); // Clear error on input change

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('⚠️Please enter account details.');
      return;
    }
    post(route('login'), {
        onFinish: () => reset('password'),
        onError: (errors) => {
          // errors is an object with validation or custom error messages from the backend
          // For example: { username: "The username field is required." }
          // Or: { message: "The provided credentials do not match our records." }
          if (errors.message) {
              setError(errors.message); // Show custom error
          } else if (errors.username || errors.password) {
              setError(errors.username || errors.password); // Show validation error
          } else {
              setError('⚠️ Wrong username or password.');
          }
      },
    });
    // Simulate login error for demonstration
    // if (formData.username !== 'admin' || formData.password !== 'admin') {
    //   setError('⚠️Wrong username or password.');
    //   return;
    setError('');
  };

  // Main "choose login" state
  if (!showLoginForm && !showMLBBModal) {
    return (
      <>
        <Head title="Log in MSL Account" />
        <Header />
        <main>
          <div className="login-main-bg">
              {/* <img src={webBg2025} className="background-image-register" alt="Web Background" /> */}
              <div className="login-wrapper" >
                <div className="login-container-login">
                  <div className="form-container-login">
                    <h2 className="choose-login-title" style={{ textAlign: 'left' }}>
                      Where Student Gamers Become Campus Legends.
                    </h2>
                    <button className="choose-login-btn" onClick={() => setShowLoginForm(true)}>
                      <span className="choose-login-btn-icon">
                        <img src="/android-chrome-192x192.png" alt="MSL" style={{ width: 35, height: 35, borderRadius: 6 }} />
                      </span>
                      <span>SIGN IN WITH MSL ACCOUNT</span>
                    </button>
                    <button className="choose-login-btn" onClick={() => setShowMLBBModal(true)}>
                      <span className="choose-login-btn-icon">
                        <img src="/images/Student Portal/mlbbiconlogin.png" alt="MLBB" style={{ width: 35, height: 35, borderRadius: 6 }} />
                      </span>
                      <span>SIGN IN WITH MLBB ACCOUNT</span>
                    </button>
                    <button className="choose-login-btn" onClick={() => window.location.href = '/register'}>
                      <span className="choose-login-btn-icon">
                        <svg width="35" height="35" fill="none" viewBox="0 0 24 24"><path d="M12 12v6m0 0v-6m0 6H6m6 0h6M6 6h12M6 6v12M6 6H3m3 0h12m0 0v12m0-12h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span>CREATE AN ACCOUNT</span>
                    </button>
                  </div>
                </div>
                <div className="video-container-login">
                  <div className="video-foreground">
                    <iframe
                      src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                      title="MSL Video"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen>
                    </iframe>
                  </div>
                </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // MLBB modal state (just a placeholder)
  if (showMLBBModal) {
    return (
      <>
        <Head title="Log in MSL Account" />
        <Header />
        <main>
          <div className="login-main-bg">
            {/* <img src={webBg2025} className="background-image-register" alt="Web Background" /> */}
              <div className="login-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="choose-login-container">
                  <h2 className="choose-login-title">MLBB ACCOUNT LOGIN</h2>
                  <div style={{ color: "#fff", textAlign: "center", margin: "2rem 0" }}>
                    This is still on progress, please wait for the next update.
                    <br />
                    <br />
                    <span style={{ fontSize: "0.9rem", color: "#ccc" }}>
                      If you have any questions, please contact the SERP Web Dev </span>
                  </div>
                  <button
                    className="choose-login-btn"
                    onClick={() => setShowMLBBModal(false)}>
                    <span>
                      Back
                    </span>
                  </button>
                </div>
              </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Default: show the original login form
  return (
    <>
    <Head title="Log in MSL Account" />
    <Header />
      <main>
          <div className="login-main-bg">
              {/* <img src={webBg2025} className="background-image-register" alt="Web Background" /> */}
            <div className="login-wrapper">
            <div className={`login-container-login ${error ? 'has-error' : ''}`} style={{ flex: 1 }}>
              <div className="form-container-login">
                <h1 className="title-login" style={{ textAlign: 'left', }}>Unlock your path in student esports and leadership.</h1>
                <form className="form-login" onSubmit={handleSubmit}>

                  <div className="input-group-login">
                    <label htmlFor="username" className="label-login">
                      Username
                    </label>
                    <input type="text" id="username" name="username" placeholder="eg. Simeon" value={formData.username} onChange={handleInputChange} className="input-field-login"/>
                  </div>
                  <div className="input-group-login">
                    <label htmlFor="password" className="label-login">
                      Password
                    </label>
                    <div className="password-container-login">
                      <input type={passwordVisible ? 'text' : 'password'} id="password" name="password" placeholder="********" value={formData.password} onChange={handleInputChange} className="input-field-login"/>
                      <button type="button" className="eye-icon-login" onClick={() => setPasswordVisible((v) => !v)} aria-label={passwordVisible ? 'Hide password' : 'Show password'}>{passwordVisible ?
                        <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                    </div>
                  </div>
                  {error && ( <div className="error-message-login"> <p>{error}</p></div>)}
                  <div className="footer-container-login">
                    <button type="submit" className="login-btn-login">
                      Login
                    </button>
                    <p className="footer-text-login">
                      <a href="/forgot-password" className="forgot-password-link-login">
                        Forgot Password
                      </a>
                      <br />
                      Don't have an account?{' '}
                      <a href="/register" className="sign-in-link-login">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="video-container-login">
              <div className="video-foreground">
                <iframe
                  src="https://player.vimeo.com/video/1091173390?h=b2f78d509b&autoplay=1&loop=1&muted=1&background=1"
                  title="MSL Video"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    <Footer />
    </>
  );
};

export default Login;
