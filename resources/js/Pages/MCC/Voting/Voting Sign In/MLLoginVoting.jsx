import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MLLoginVoting = forwardRef(({ onLoginSuccess }, ref) => {
  const instanceRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.web.moontontech.com/lib/mtstatic/ml-login/1.0.2/index.js';
    script.onload = () => {
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
      instanceRef.current = instance;

      const LoginEvent = {
        LOGIN_SUCCESS: 'loginSucc',
        LOGIN_CLOSE: 'closeLogin',
        LOGIN_FAIL: 'loginFail',
        LOGOUT_SUCCESS: 'logoutSucc',
      };

      const LangCode = { en: 101 };

      instance.on(LoginEvent.LOGIN_SUCCESS, async (loginRes) => {
        const token = loginRes.data.data.jwt;
        try {
          // Get user info from Moonton
          const infoResponse = await fetch('https://api.mobilelegends.com/base/getBaseInfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Authorization': 'Bearer ' + token,
            },
          });
          
          const info = await infoResponse.json();
          
          if (info.data) {
            // Log the info we're getting from Moonton
            console.log('Moonton user info:', info.data);

            // Extract user info from the token payload
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', tokenPayload);

            // Prepare login data for our backend using the correct fields
            const loginData = {
              ml_id: tokenPayload.Ext.roleId.toString(), // roleId is the ML ID
              server_id: tokenPayload.Ext.zoneId.toString(), // zoneId is the server ID
              ign: info.data.name, // name is the IGN
              token: token
            };

            // Log the data we're sending to our backend
            console.log('Sending to backend:', loginData);

            // Send to our backend
            const response = await axios.post('/ml/login', loginData);
            
            if (response.data.success) {
              toast.success('Login successful!');
              if (onLoginSuccess) {
                onLoginSuccess(response.data);
              } else {
                // Redirect to predictions page
                window.location.href = response.data.redirect;
              }
            } else {
              toast.error(response.data.message || 'Login failed');
            }
          } else {
            console.error('Invalid Moonton response:', info);
            toast.error('Invalid response from Mobile Legends. Please try again.');
          }
        } catch (error) {
          console.error('Login error:', error);
          
          // Handle validation errors
          if (error.response?.status === 422) {
            const validationErrors = error.response.data.errors;
            if (validationErrors) {
              // Show each validation error
              Object.entries(validationErrors).forEach(([field, messages]) => {
                toast.error(`${field}: ${messages.join(', ')}`);
              });
            } else {
              toast.error(error.response.data.message || 'Validation failed. Please check your information.');
            }
          } else {
            toast.error('Failed to login. Please try again.');
          }
        }
      });

      instance.on(LoginEvent.LOGIN_CLOSE, () => {
        console.log('Login closed');
      });

      instance.on(LoginEvent.LOGIN_FAIL, () => {
        console.error('Login failed');
        toast.error('Login failed. Please try again.');
      });

      instance.on(LoginEvent.LOGOUT_SUCCESS, async () => {
        try {
          await axios.post('/ml/logout');
          toast.success('Logged out successfully');
          window.location.href = '/ml/login';
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Failed to logout properly');
        }
      });

      instance.changeLang(LangCode.en);
    };

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [onLoginSuccess]);

  function tite() {
    const observer = new MutationObserver(() => {
      const mlbbGameDownLoad = document.getElementsByClassName('mlbb-download-box');
      const mlbbSocial = document.getElementsByClassName('mlbb-social-box');
      const mlbbCommontip = document.getElementsByClassName('mlbb-common-tip');
      const mtCommonInner = document.getElementsByClassName('mt-common-inner');
      const signmlbb = document.getElementsByClassName('signmlbb');
      const loginTypeOuter = document.getElementsByClassName('login-type-outer');
      const mtTitle = document.getElementsByClassName('mt-title');

      if (mtCommonInner.length > 0) {
        mtCommonInner[0].style.backgroundColor = 'black';
        mtCommonInner[0].style.color = 'white';
        mtCommonInner[0].style.borderRadius = '10px';
        mtCommonInner[0].style.padding = '10px';
        mtCommonInner[0].style.margin = '10px';
        mtCommonInner[0].style.textAlign = 'center';
        mtCommonInner[0].style.fontSize = '16px';
      }

      if (mtTitle.length > 0) {
        mtTitle[0].innerHTML = 'Sign in with Mobile Legends';
        mtTitle[0].style.marginLeft = '50px';
        mtTitle[0].style.fontSize = '20px';
        mtTitle[0].style.fontWeight = 'bold';
        mtTitle[0].style.color = 'white';
        mtTitle[0].style.backgroundColor = 'black';
        mtTitle[0].style.borderRadius = '10px';
        mtTitle[0].style.padding = '10px';
        mtTitle[0].style.marginBottom = '20px';
      }



      if (signmlbb.length > 0) {
        signmlbb[0].style.display = 'none';
      }

      if (mlbbCommontip.length > 1) {
        for (let i = 0; i < mlbbGameDownLoad.length; i++) {
          mlbbGameDownLoad[i].style.display = 'none';
        }
        for (let i = 0; i < mlbbSocial.length; i++) {
          mlbbSocial[i].style.display = 'none';
        }
        mlbbCommontip[1].innerHTML =
          'Your credentials are encrypted and protected. We never share your information — your privacy and security are our top priority.<br/>';

        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }

  useImperativeHandle(ref, () => ({
    triggerLogin: () => {
      if (instanceRef.current) {
        instanceRef.current.loadIframe();
        tite();
      }
    },
  }));

  return null;
});

export default MLLoginVoting; 