import React, { useState, useEffect, useCallback, useRef } from "react";
import { router } from '@inertiajs/react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    squadName: user.squadName || "",
    year_level: user.year_level || "",
    ml_ign: user.ml_ign || "",
    ml_id: user.ml_id || "",
    ml_server: user.ml_server || "",
    email: user.email || "",
    contact_number: user.contact_number || "",
    facebook_link: user.facebook_link || "",
  });
  const loginRef = useRef();
  const passwordInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileUpdateResult, setProfileUpdateResult] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    checking: false,
    isValid: true,
    message: ''
  });
  const [mlIdValidation, setMlIdValidation] = useState({
    checking: false,
    isValid: true,
    message: ''
  });
  const [showMlLogin, setShowMlLogin] = useState(false);
  const [mlLoginMessage, setMlLoginMessage] = useState('');
  const mlSdkLoadedRef = useRef(false);
  const mlInstanceRef = useRef(null);
  const mlLoginCompletedRef = useRef(false);
  const [fieldRestrictions, setFieldRestrictions] = useState({
    squadName: {
      canChange: true,
      lastChanged: user.squad_name_last_changed || null,
      nextChangeDate: null,
      message: ''
    },
    yearLevel: {
      canChange: true,
      lastChanged: user.year_level_last_changed || null,
      nextChangeDate: null,
      message: ''
    },
    mlAccount: {
      canChange: true,
      lastChanged: user.ml_account_last_changed || null,
      nextChangeDate: null,
      message: ''
    },
  });
  const handleLoginClick = () => {
    if (!fieldRestrictions.mlAccount.canChange) {
      setError(fieldRestrictions.mlAccount.message);
      return;
    }
    // Reset completion flag when starting new login
    mlLoginCompletedRef.current = false;
    setShowMlLogin(true);
    setMlLoginMessage('A Mobile Legends login window will appear. Enter the code sent to your in-game mailbox.');
  };

  // Lazy-load Moonton login SDK and handle login success to populate MLBB fields
  useEffect(() => {
    if (!showMlLogin || mlLoginCompletedRef.current) return;
    
    const ensureSdkAndInit = () => {
      const init = () => {
        // Initialize only once per open
        const options = {
          baseUrl: 'https://api.mobilelegends.com/base/',
          lang: 'en',
          params: {
            adjust_campaign: '',
            adjust_adgroup: 'ml',
          },
          referer: '',
          loginSuccessTip: false,
          logoutSuccessTip: false,
        };
        const instance = new window.$autologin(options);
        mlInstanceRef.current = instance;
        const LoginEvent = {
          LOGIN_SUCCESS: 'loginSucc',
          LOGIN_CLOSE: 'closeLogin',
          LOGIN_FAIL: 'loginFail',
          LOGOUT_SUCCESS: 'logoutSucc',
        };
        const LangCode = { en: 101 };
        instance.on(LoginEvent.LOGIN_SUCCESS, async (loginRes) => {
          try {
            const token = loginRes?.data?.data?.jwt;
            if (!token) {
              setMlLoginMessage('Login succeeded but token missing. Please try again.');
              return;
            }
            
            // CLOSE THE MOONTON MODAL IMMEDIATELY - BEFORE ANYTHING ELSE
            setShowMlLogin(false);
            mlLoginCompletedRef.current = true;
            
            // Force close all Moonton modals immediately
            const closeMoontonModalNow = () => {
              // Hide all fixed position elements with high z-index (likely modals)
              document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' && parseInt(style.zIndex) > 1000) {
                  const classes = (el.className || '').toString();
                  const id = (el.id || '').toString();
                  if (classes.includes('mlbb') || classes.includes('moonton') || classes.includes('mt-') || 
                      id.includes('mlbb') || id.includes('moonton') || id.includes('autologin')) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.remove();
                  }
                }
              });
              // Remove all Moonton iframes
              document.querySelectorAll('iframe').forEach(iframe => {
                if (iframe.src && (iframe.src.includes('mobilelegends') || iframe.src.includes('moonton'))) {
                  iframe.remove();
                }
              });
            };
            closeMoontonModalNow();
            setTimeout(closeMoontonModalNow, 10);
            setTimeout(closeMoontonModalNow, 50);
            
            // Fetch player base info (to get IGN)
            const infoResponse = await fetch('https://api.mobilelegends.com/base/getBaseInfo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Bearer ' + token,
              },
            });
            const info = await infoResponse.json();
            // Decode token payload to extract ml_id (roleId) and server (zoneId)
            let decodedPayload = {};
            try {
              decodedPayload = JSON.parse(atob(token.split('.')[1] || '')) || {};
            } catch (e) {
              // ignore decode errors
            }
            const extractedMlId = decodedPayload?.Ext?.roleId ? String(decodedPayload.Ext.roleId) : (formData.ml_id || '');
            const extractedServer = decodedPayload?.Ext?.zoneId ? String(decodedPayload.Ext.zoneId) : (formData.ml_server || '');
            const ignFromInfo = info?.data?.name || formData.ml_ign || '';
            
            // Update form data
            const updatedFormData = {
              ...formData,
              ml_id: extractedMlId,
              ml_server: extractedServer,
              ml_ign: ignFromInfo,
            };
            setFormData(updatedFormData);
            
            // Trigger ML ID validation after update
            if (extractedMlId && extractedMlId !== user.ml_id) {
              validateMlId(extractedMlId);
            }
            
            // Close modal again after data fetch
            closeMoontonModalNow();
            
            // Check if ML ID is available before auto-saving
            const checkMlIdBeforeSave = async () => {
              try {
                const checkResponse = await fetch(`/check-ml-id-availability?ml_id=${encodeURIComponent(extractedMlId)}&user_id=${user.id}`, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                  credentials: 'same-origin',
                });
                const checkData = await checkResponse.json();
                
                if (!checkData.available) {
                  setMlLoginMessage('❌ This ML ID is already registered with another account.');
                  setError('This ML ID is already registered with another account.');
                  return;
                }
              } catch (checkErr) {
                console.error('ML ID check error:', checkErr);
                // Continue with save attempt even if check fails
              }
              
              // Auto-save MLBB account changes to backend
              setMlLoginMessage('Saving MLBB account changes...');
              try {
                const payload = {
                  email: formData.email,
                  ml_id: extractedMlId,
                  ml_server: extractedServer,
                  ml_ign: ignFromInfo,
                };

                router.patch(route('profile.update'), payload, {
                  preserveState: true,
                  preserveScroll: true,
                  onSuccess: (page) => {
                    const updatedUser = page.props.auth?.user || payload;
                    setMlLoginMessage('✅ MLBB account updated successfully!');
                    setSuccess(true);

                    if (onSave && updatedUser) {
                      onSave(updatedUser);
                    }

                    setFormData(prev => ({
                      ...prev,
                      ml_id: extractedMlId,
                      ml_server: extractedServer,
                      ml_ign: ignFromInfo,
                    }));

                    setTimeout(() => {
                      router.reload({ only: ['user'], preserveScroll: true, preserveState: true });
                      setTimeout(() => setSuccess(false), 2000);
                    }, 1000);
                  },
                  onError: (errors) => {
                    const firstError = Object.values(errors)[0] || 'Failed to save MLBB account changes';
                    setMlLoginMessage('Failed to save changes: ' + firstError);
                    setError(firstError);
                  },
                });
              } catch (saveErr) {
                console.error('Save error:', saveErr);
                setMlLoginMessage('Failed to save changes. Please try saving manually.');
                setError('Failed to save MLBB account changes');
              }
            };
          
          checkMlIdBeforeSave();
          } catch (e) {
            setMlLoginMessage('Failed to fetch MLBB info. Please try again.');
          }
        });
        instance.on(LoginEvent.LOGIN_CLOSE, () => {
          setMlLoginMessage('Login cancelled.');
          setShowMlLogin(false);
          mlLoginCompletedRef.current = false; // Reset on close
        });
        instance.on(LoginEvent.LOGIN_FAIL, () => {
          setMlLoginMessage('Login failed. Please try again.');
        });
        instance.changeLang(LangCode.en);
        // Show the login popup
        try {
          if (typeof instance.loadIframe === 'function') {
            instance.loadIframe();
          }
        } catch (_) {}
      };
      if (window.$autologin) {
        init();
        return;
      }
      if (mlSdkLoadedRef.current) {
        // SDK already attempted; wait a tick and init if available
        setTimeout(() => {
          if (window.$autologin) init();
        }, 50);
        return;
      }
      mlSdkLoadedRef.current = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.web.moontontech.com/lib/mtstatic/ml-login/1.0.2/index.js';
      script.onload = init;
      script.onerror = () => {
        setMlLoginMessage('Unable to load MLBB login. Check your connection and try again.');
      };
      document.body.appendChild(script);
      return () => {
        try {
          document.body.removeChild(script);
        } catch (_) {}
      };
    };
    const cleanup = ensureSdkAndInit();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [showMlLogin, formData.ml_id, formData.ml_server, formData.ml_ign]);

  // Function to check field change restrictions
  const checkFieldRestrictions = useCallback(() => {
    const now = new Date();
    
    // Check squad name restriction (once per month)
    const squadNameRestriction = {
      canChange: true,
      lastChanged: user.squad_name_last_changed || null,
      nextChangeDate: null,
      message: ''
    };
    
    if (user.squad_name_last_changed) {
      const lastChanged = new Date(user.squad_name_last_changed);
      const nextChangeDate = new Date(lastChanged);
      nextChangeDate.setMonth(nextChangeDate.getMonth() + 1);
      
      if (now < nextChangeDate) {
        squadNameRestriction.canChange = false;
        squadNameRestriction.nextChangeDate = nextChangeDate;
        const daysLeft = Math.ceil((nextChangeDate - now) / (1000 * 60 * 60 * 24));
        squadNameRestriction.message = `Squad name can be changed again in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
      }
    }
    
    // Check year level restriction (once per year)
    const yearLevelRestriction = {
      canChange: true,
      lastChanged: user.year_level_last_changed || null,
      nextChangeDate: null,
      message: ''
    };
    
    if (user.year_level_last_changed) {
      const lastChanged = new Date(user.year_level_last_changed);
      const nextChangeDate = new Date(lastChanged);
      nextChangeDate.setFullYear(nextChangeDate.getFullYear() + 1);
      
      if (now < nextChangeDate) {
        yearLevelRestriction.canChange = false;
        yearLevelRestriction.nextChangeDate = nextChangeDate;
        const daysLeft = Math.ceil((nextChangeDate - now) / (1000 * 60 * 60 * 24));
        yearLevelRestriction.message = `Year level can be changed again in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
      }
    }

    // Check MLBB account restriction (once per year)
    const mlAccountRestriction = {
      canChange: true,
      lastChanged: user.ml_account_last_changed || null,
      nextChangeDate: null,
      message: ''
    };
    if (user.ml_account_last_changed) {
      const lastChanged = new Date(user.ml_account_last_changed);
      const nextChangeDate = new Date(lastChanged);
      nextChangeDate.setFullYear(nextChangeDate.getFullYear() + 1);
      if (now < nextChangeDate) {
        mlAccountRestriction.canChange = false;
        mlAccountRestriction.nextChangeDate = nextChangeDate;
        const daysLeft = Math.ceil((nextChangeDate - now) / (1000 * 60 * 60 * 24));
        mlAccountRestriction.message = `MLBB account can be changed again in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
      }
    }
    
    setFieldRestrictions({
      squadName: squadNameRestriction,
      yearLevel: yearLevelRestriction,
      mlAccount: mlAccountRestriction
    });
  }, [user.squad_name_last_changed, user.year_level_last_changed, user.ml_account_last_changed]);

  // Check field restrictions on component mount and when user changes
  useEffect(() => {
    checkFieldRestrictions();
  }, [checkFieldRestrictions]);

  // Sync formData when user prop changes (after page reload)
  useEffect(() => {
    setFormData({
      squadName: user.squadName || "",
      year_level: user.year_level || "",
      ml_ign: user.ml_ign || "",
      ml_id: user.ml_id || "",
      ml_server: user.ml_server || "",
      email: user.email || "",
      contact_number: user.contact_number || "",
      facebook_link: user.facebook_link || "",
    });
    // Keep login completion flag true after reload to prevent re-opening
    // Only reset when user explicitly clicks the button again
  }, [user]);

  // Cleanup Moonton elements when showMlLogin becomes false (only after it was true)
  const wasMlLoginOpenRef = useRef(false);
  useEffect(() => {
    if (showMlLogin) {
      wasMlLoginOpenRef.current = true;
    } else if (wasMlLoginOpenRef.current) {
      // Only cleanup if login was previously open (not on initial mount)
      wasMlLoginOpenRef.current = false;
      const cleanup = () => {
        try {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            if (iframe.src && (iframe.src.includes('mobilelegends') || iframe.src.includes('moonton'))) {
              iframe.style.display = 'none';
              iframe.remove();
            }
          });
          // Only remove Moonton SDK elements, be more specific to avoid removing page elements
          const moontonElements = document.querySelectorAll(
            '[class*="mlbb-login"], [id*="mlbb-login"], [class*="moonton-login"], [id*="moonton-login"], ' +
            '[class*="mt-common"], [id*="mt-common"], [class*="autologin-container"], [id*="autologin-container"]'
          );
          moontonElements.forEach(el => {
            // Only remove if it's clearly a Moonton SDK element (has specific classes or is in a modal/overlay context)
            if (el && el.parentNode && (
              el.classList.toString().includes('mlbb') || 
              el.classList.toString().includes('moonton') ||
              el.classList.toString().includes('mt-common')
            )) {
              el.style.display = 'none';
              el.remove();
            }
          });
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      };
      // Run cleanup immediately and after a delay
      cleanup();
      setTimeout(cleanup, 100);
      setTimeout(cleanup, 500);
    }
  }, [showMlLogin]);

  // Debounced email validation function
  const validateEmail = useCallback(async (email) => {
    if (!email || email === user.email) {
      setEmailValidation({ checking: false, isValid: true, message: '' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({ checking: false, isValid: false, message: 'Invalid email format' });
      return;
    }

    setEmailValidation({ checking: true, isValid: true, message: 'Checking email...' });

    router.post(route('profile.email.validate'), {
      email,
      user_id: user.id,
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        const data = page.props.flash?.validation || {};
        setEmailValidation({
          checking: false,
          isValid: data.available ?? true,
          message: data.message ?? ''
        });
      },
      onError: () => {
        setEmailValidation({
          checking: false,
          isValid: true,
          message: 'Could not verify email'
        });
      }
    });
  }, [user.email, user.id]);

  // Debounce email validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email) {
        validateEmail(formData.email);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [formData.email, validateEmail]);

  // Debounced ML ID validation function
  const validateMlId = useCallback(async (mlId) => {
    if (!mlId || mlId === user.ml_id) {
      setMlIdValidation({ checking: false, isValid: true, message: '' });
      return;
    }

    // Basic ML ID format validation (should be numeric)
    if (!/^\d+$/.test(mlId)) {
      setMlIdValidation({ checking: false, isValid: false, message: 'ML ID must be numeric' });
      return;
    }

    setMlIdValidation({ checking: true, isValid: true, message: 'Checking ML ID...' });

    try {
      const response = await fetch(`/check-ml-id-availability?ml_id=${encodeURIComponent(mlId)}&user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      setMlIdValidation({
        checking: false,
        isValid: data.available,
        message: data.available ? 'ML ID is available' : 'This ML ID is already registered with another account'
      });
    } catch (err) {
      setMlIdValidation({
        checking: false,
        isValid: true, // Assume valid if check fails
        message: 'Could not verify ML ID'
      });
    }
  }, [user.ml_id, user.id]);

  // Debounce ML ID validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.ml_id) {
        validateMlId(formData.ml_id);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [formData.ml_id, validateMlId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSendCode = async () => {
    if (!formData.email || formData.email === user.email) {
      setError('Please enter a different email address');
      return;
    }

    setIsSendingCode(true);
    setError(null);

    router.post(route('profile.email.send-code'), {
      email: formData.email,
      user_id: user.id,
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        const data = page.props.flash?.emailVerificationResult || {};
        if (data.success) {
          setEmailVerificationSent(true);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
          return;
        }

        setError(data.message || 'Failed to send verification code');
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0] || 'Failed to send verification code';
        setError(firstError);
      },
      onFinish: () => {
        setIsSendingCode(false);
      }
    });
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    router.post(route('profile.email.verify-code'), {
      verification_code: verificationCode,
      user_id: user.id,
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        const data = page.props.flash?.emailVerificationResult || {};
        if (!data.success) {
          setError(data.message || 'Invalid verification code');
          return;
        }

        setEmailVerificationSent(false);
        setVerificationCode('');
        setEmailVerified(true);

        const updatedUser = data.user;
        if (updatedUser) {
          setFormData(prev => ({
            ...prev,
            email: updatedUser.email
          }));

          if (onSave) {
            onSave(updatedUser);
          }
        }

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
      onError: (errors) => {
        const firstError = Object.values(errors)[0] || 'Invalid verification code';
        setError(firstError);
      },
      onFinish: () => {
        setIsVerifyingCode(false);
      }
    });
  };

  const handleSubmit = () => {
    // Check if email validation is still in progress
    if (emailValidation.checking) {
      setError('Please wait for email validation to complete');
      return;
    }

    // Check if email is invalid
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    // Check if email is changed but not verified
    if (formData.email !== user.email && !emailVerified) {
      setError('Please verify your email before saving changes');
      return;
    }

    // Check if ML ID validation is still in progress
    if (mlIdValidation.checking) {
      setError('Please wait for ML ID validation to complete');
      return;
    }

    // Check if ML ID is invalid (only if it's changed)
    if (formData.ml_id !== user.ml_id && !mlIdValidation.isValid) {
      setError(mlIdValidation.message || 'This ML ID is already registered with another account');
      return;
    }

    // Check field restrictions
    if (formData.squadName !== user.squadName && !fieldRestrictions.squadName.canChange) {
      setError(fieldRestrictions.squadName.message);
      return;
    }

    if (formData.year_level !== user.year_level && !fieldRestrictions.yearLevel.canChange) {
      setError(fieldRestrictions.yearLevel.message);
      return;
    }

    setIsLoading(true);
    setError(null);

    router.patch(route('profile.update'), formData, {
      onSuccess: (page) => {
        setSuccess(true);
        setProfileUpdateResult({
          success: true,
          message: page.props.flash?.profileUpdate?.message || 'Profile updated successfully.',
        });
        const updatedUser = page.props.user || page.props.auth?.user || formData;
        if (onSave) {
          onSave(updatedUser);
        }
      },
      onError: (errors) => {
        const message = Object.values(errors)[0] || 'Failed to update profile';
        setError(message);
        setProfileUpdateResult({
          success: false,
          message,
        });
      },
      onFinish: () => {
        setIsLoading(false);
      },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const closeProfileUpdateResult = () => {
    setProfileUpdateResult(null);
    if (profileUpdateResult?.success) {
      onClose();
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
    setDeleteError('');
    setDeleteSuccess(false);
    setDeleteMessage('');
    setTimeout(() => passwordInputRef.current?.focus(), 100);
  };

  const confirmDeleteAccount = () => {
    if (!deletePassword.trim()) {
      setDeleteError('Password is required');
      passwordInputRef.current?.focus();
      return;
    }

    setDeleteError('');

    router.delete('/profile', {
      data: { password: deletePassword },
      onSuccess: (page) => {
        setShowDeleteModal(false);
        setDeleteSuccess(true);
        setDeleteMessage(page.props.flash?.message || 'Account deleted successfully');
        setShowSuccessModal(true);
        
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        }, 2000);
      },
      onError: (errors) => {
        const errorMsg = Object.values(errors)[0] || 'Failed to delete account. Please check your password and try again.';
        setShowDeleteModal(false);
        setDeleteSuccess(false);
        setDeleteMessage(errorMsg);
        setShowSuccessModal(true);
      }
    });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError('');
    setDeleteSuccess(false);
    setDeleteMessage('');
  };

  const handleSuccessOkay = () => {
    setShowSuccessModal(false);
    if (deleteSuccess) {
      // Only redirect on success
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }, 100);
    } else {
      // On error, reopen delete modal
      setShowDeleteModal(true);
      setDeletePassword('');
      setDeleteError(deleteMessage);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-2"
      onClick={onClose}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* Modal Box */}
      <div
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 
                  rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-sm sm:max-w-2xl md:max-w-5xl 
                  p-4 sm:p-5 md:p-6 border border-yellow-500/30 z-10
                  max-h-[85vh] sm:max-h-[80vh] md:max-h-[70vh] overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800 mt-4 sm:mt-8 md:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 transition"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4 md:mb-6 border-b border-yellow-500/30 pb-2">
          ✨ Edit Profile
        </h2>

        {/* Success Message */}
        {success && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-400 text-xs sm:text-sm">
            {emailVerified ? 
              '✅ Email verified successfully! You can now save your profile changes.' :
              '✅ Profile updated successfully!'
            }
          </div>
        )}

        {/* Email Verification Message */}
        {emailVerificationSent && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-900/50 border border-blue-500 rounded-lg text-blue-400 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">📧 Email Verification Required</p>
                <p className="text-xs mt-1">Please check your new email address for verification instructions. Your email will be updated once verified.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-400 text-xs sm:text-sm break-words">
            ❌ {error}
          </div>
        )}

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <div>
              <label className="text-sm text-gray-300">Squad Name</label>
              <input
                type="text"
                name="squadName"
                value={formData.squadName}
                onChange={handleChange}
                disabled={isLoading || !fieldRestrictions.squadName.canChange}
                className={`w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border focus:ring-1 disabled:opacity-50 ${
                  !fieldRestrictions.squadName.canChange 
                    ? 'border-orange-400 focus:border-orange-400 focus:ring-orange-400' 
                    : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400'
                }`}
              />
              {!fieldRestrictions.squadName.canChange && (
                <p className="text-xs text-orange-400 mt-1">
                  ⏰ {fieldRestrictions.squadName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">Year Level</label>
              <input
                type="text"
                name="year_level"
                value={formData.year_level}
                onChange={handleChange}
                disabled={isLoading || !fieldRestrictions.yearLevel.canChange}
                className={`w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border focus:ring-1 disabled:opacity-50 ${
                  !fieldRestrictions.yearLevel.canChange 
                    ? 'border-orange-400 focus:border-orange-400 focus:ring-orange-400' 
                    : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400'
                }`}
              />
              {!fieldRestrictions.yearLevel.canChange && (
                <p className="text-xs text-orange-400 mt-1">
                  ⏰ {fieldRestrictions.yearLevel.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">MLBB IGN</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  disabled
                  type="text"
                  name="ml_ign"
                  value={formData.ml_ign}
                  onChange={handleChange}
                  className="flex-1 p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 opacity-50"
                />
                <button
                  onClick={handleLoginClick}
                  type="button"
                  className="px-4 py-2.5 md:py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 transition shadow-lg disabled:opacity-50 whitespace-nowrap text-sm sm:text-base"
                  disabled={isLoading || !fieldRestrictions.mlAccount.canChange}
                >
                  Change Mlbb Account
                </button>
              </div>
              {!fieldRestrictions.mlAccount.canChange && (
                <p className="text-xs text-orange-400 mt-1">
                  ⏰ {fieldRestrictions.mlAccount.message}
                </p>
              )}
              {showMlLogin && (
                <div className="mt-3 p-3 rounded-lg bg-blue-900/40 border border-blue-500/50 text-blue-200 text-sm">
                  A Moonton login popup should be visible now. Enter the verification code sent to your MLBB in-game mailbox. Once verified, we will auto-fill your MLBB IGN and IDs.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-sm text-gray-300">MLBB ID</label>
                <div className="relative">
                  <input
                    type="text"
                    name="ml_id"
                    value={formData.ml_id}
                    onChange={handleChange}
                    disabled={true}
                    readOnly={true}
                    className={`w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 opacity-50 cursor-not-allowed pr-10`}
                  />
                  {/* Validation Status Icon */}
                  {formData.ml_id && formData.ml_id !== user.ml_id && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {mlIdValidation.checking ? (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                      ) : mlIdValidation.isValid ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {/* Validation Message */}
                {formData.ml_id && formData.ml_id !== user.ml_id && mlIdValidation.message && (
                  <p className={`text-xs mt-1 ${
                    mlIdValidation.checking 
                      ? 'text-blue-400' 
                      : mlIdValidation.isValid 
                        ? 'text-green-400' 
                        : 'text-red-400'
                  }`}>
                    {mlIdValidation.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-300">Server</label>
                <input
                  type="text"
                  name="ml_server"
                  value={formData.ml_server}
                  onChange={handleChange}
                  disabled={true}
                  readOnly={true}
                  className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border focus:ring-1 disabled:opacity-50 pr-10 text-sm sm:text-base ${
                      emailValidation.checking 
                        ? 'border-blue-400 focus:border-blue-400 focus:ring-blue-400' 
                        : emailValidation.isValid 
                          ? 'border-green-400 focus:border-green-400 focus:ring-green-400' 
                          : 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    }`}
                  />
                  {/* Validation Status Icon */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {emailValidation.checking ? (
                      <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    ) : emailValidation.isValid ? (
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                {/* Send Code Button */}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || isLoading || formData.email === user.email || !emailValidation.isValid || emailValidation.checking}
                  className="px-4 py-2.5 md:py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                >
                  {isSendingCode ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Code'
                  )}
                </button>
              </div>
              {/* Validation Message */}
              {emailValidation.message ? (
                <p className={`text-xs mt-1 ${
                  emailValidation.checking 
                    ? 'text-blue-400' 
                    : emailValidation.isValid 
                      ? 'text-green-400' 
                      : 'text-red-400'
                }`}>
                  {emailValidation.message}
                </p>
              ) : user.email_verification_code ? (
                <p className="text-xs text-yellow-400 mt-1 md:mt-2">
                  ⚠️ Email change pending verification. Check your email for verification code.
                </p>
              ) : (
                <p className="text-xs text-yellow-400 mt-1 md:mt-2">
                  ⚠️ Changing your email may require re-verification.
                </p>
              )}

              {/* Verification Code Input */}
              {emailVerificationSent && (
                <div className="mt-4 p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">Enter Verification Code</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mb-3">
                    We've sent a 6-digit verification code to your new email address. Enter it below to complete the email change.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                        if (error) setError(null);
                      }}
                      placeholder="123456"
                      disabled={isVerifyingCode}
                      className="flex-1 p-2.5 sm:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:opacity-50 text-center text-xl sm:text-2xl font-mono tracking-widest"
                      maxLength="6"
                    />
                    <button
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || verificationCode.length !== 6}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isVerifyingCode ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ⏰ Verification code expires in 10 minutes
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Facebook Account</label>
              <input
                type="text"
                name="facebook_link"
                value={formData.facebook_link}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-2.5 md:p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto px-4 md:px-5 py-2.5 sm:py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
            <button
              className="w-full sm:w-auto px-4 md:px-5 py-2.5 sm:py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition text-sm md:text-base disabled:opacity-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto px-4 md:px-5 py-2.5 sm:py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition shadow-lg text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={isLoading 
                || emailValidation.checking 
                || !emailValidation.isValid 
                || (formData.email !== user.email && !emailVerified) 
                || mlIdValidation.checking
                || (formData.ml_id !== user.ml_id && !mlIdValidation.isValid)
                || (formData.squadName !== user.squadName && !fieldRestrictions.squadName.canChange) 
                || (formData.year_level !== user.year_level && !fieldRestrictions.yearLevel.canChange)
                || ((formData.ml_id !== user.ml_id || formData.ml_server !== user.ml_server) && !fieldRestrictions.mlAccount.canChange)
              }
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
          
          {/* Save Button Help Text */}
          <div className="mt-2 space-y-1">
            {(formData.email !== user.email && !emailVerified) && (
              <p className="text-xs text-yellow-400 text-center sm:text-left">
                ⚠️ Please verify your email before saving changes
              </p>
            )}
            {(formData.squadName !== user.squadName && !fieldRestrictions.squadName.canChange) && (
              <p className="text-xs text-orange-400 text-center sm:text-left">
                ⏰ {fieldRestrictions.squadName.message}
              </p>
            )}
            {(formData.year_level !== user.year_level && !fieldRestrictions.yearLevel.canChange) && (
              <p className="text-xs text-orange-400 text-center sm:text-left">
                ⏰ {fieldRestrictions.yearLevel.message}
              </p>
            )}
            {((formData.ml_id !== user.ml_id || formData.ml_server !== user.ml_server) && !fieldRestrictions.mlAccount.canChange) && (
              <p className="text-xs text-orange-400 text-center sm:text-left">
                ⏰ {fieldRestrictions.mlAccount.message}
              </p>
            )}
            {(formData.ml_id !== user.ml_id && !mlIdValidation.isValid) && (
              <p className="text-xs text-red-400 text-center sm:text-left">
                ⚠️ {mlIdValidation.message || 'This ML ID is already registered with another account'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div 
            className="bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border border-[#242424] shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center mr-3 border border-[#facc15]">
                <AlertTriangle className="w-6 h-6 text-[#facc15]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Delete Account
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            
            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your password to confirm
              </label>
              <input
                ref={passwordInputRef}
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all duration-200"
                placeholder="Enter your password"
                onKeyPress={(e) => e.key === 'Enter' && confirmDeleteAccount()}
              />
              {deleteError && (
                <p className="text-red-400 text-sm mt-1">{deleteError}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-300 bg-[rgba(10,10,10,0.8)] border border-[#242424] rounded-md hover:bg-[rgba(20,20,20,0.8)] hover:border-[#facc15] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-4 py-2 text-black bg-[#facc15] rounded-md hover:bg-[#e0b90f] transition-all duration-200 flex items-center space-x-2 border border-[#facc15] hover:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {profileUpdateResult && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeProfileUpdateResult();
            }
          }}
        >
          <div className={`bg-gray-900 rounded-lg p-6 max-w-md mx-4 border shadow-xl ${profileUpdateResult.success ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 border ${profileUpdateResult.success ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'}`}>
                {profileUpdateResult.success ? (
                  <div className="w-6 h-6 text-green-400 text-2xl font-bold">✓</div>
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <h3 className={`text-lg font-semibold ${profileUpdateResult.success ? 'text-green-400' : 'text-red-400'}`}>
                {profileUpdateResult.success ? 'Profile Updated Successfully' : 'Profile Update Failed'}
              </h3>
            </div>
            <p className="mb-6 text-gray-300">{profileUpdateResult.message}</p>
            <div className="flex justify-center">
              <button
                onClick={closeProfileUpdateResult}
                className={`px-6 py-2 rounded-md border ${profileUpdateResult.success ? 'text-black bg-green-400 border-green-400' : 'text-white bg-red-600 border-red-500'}`}
              >
                {profileUpdateResult.success ? 'Okay' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={(e) => {
            // Only close if clicking the backdrop
            if (e.target === e.currentTarget) {
              handleSuccessOkay();
            }
          }}
        >
          <div 
            className={`bg-[rgba(10,10,10,0.5)] rounded-lg p-6 max-w-md mx-4 border shadow-[0_4px_8px_rgba(0,0,0,0.1)] backdrop-blur-[10px] ${
              deleteSuccess ? 'border-[#facc15]' : 'border-red-500'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 border ${
                deleteSuccess 
                  ? 'bg-[rgba(250,204,21,0.2)] border-[#facc15]' 
                  : 'bg-[rgba(239,68,68,0.2)] border-red-500'
              }`}>
                {deleteSuccess ? (
                  <div className="w-6 h-6 text-[#facc15] text-2xl font-bold">✓</div>
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <h3 className={`text-lg font-semibold ${
                deleteSuccess ? 'text-white' : 'text-red-400'
              }`}>
                {deleteSuccess ? 'Account Deleted Successfully' : 'Delete Account Failed'}
              </h3>
            </div>
            <p className={`mb-6 ${
              deleteSuccess ? 'text-gray-300' : 'text-red-300'
            }`}>
              {deleteSuccess 
                ? 'Your account has been permanently deleted. You will be redirected to the login page.'
                : deleteMessage || 'Failed to delete account. Please check your password and try again.'
              }
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={handleSuccessOkay}
                className={`px-6 py-2 rounded-md transition-all duration-200 border hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] ${
                  deleteSuccess
                    ? 'text-black bg-[#facc15] hover:bg-[#e0b90f] border-[#facc15]'
                    : 'text-white bg-red-600 hover:bg-red-500 border-red-500'
                }`}
              >
                {deleteSuccess ? 'Okay' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}