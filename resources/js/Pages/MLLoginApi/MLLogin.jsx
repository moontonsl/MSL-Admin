import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

const MLLogin = forwardRef(({ onLoginInfo, onLoginClose, onLoginSuccess }, ref) => {
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

      instance.on(LoginEvent.LOGIN_SUCCESS, (loginRes) => {
        const token = loginRes.data.data.jwt;
        fetch('https://api.mobilelegends.com/base/getBaseInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Bearer ' + token,
          },
        })
          .then((res) => res.json())
          .then((info) => {
            if (onLoginInfo) onLoginInfo(info);
            if (onLoginSuccess) onLoginSuccess();
          });
      });

      instance.on(LoginEvent.LOGIN_CLOSE, () => {
        console.log('Login closed');
        if (onLoginClose) onLoginClose();
      });

      instance.on(LoginEvent.LOGIN_FAIL, () => {
        console.error('Login failed');
      });

      instance.on(LoginEvent.LOGOUT_SUCCESS, () => {
        console.log('Logged out');
      });

      instance.changeLang(LangCode.en);
    };

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [onLoginInfo, onLoginClose, onLoginSuccess]);

  function tite() {
    const observer = new MutationObserver(() => {
      const mlbbGameDownLoad = document.getElementsByClassName('mlbb-download-box');
      const mlbbSocial = document.getElementsByClassName('mlbb-social-box');
      const mlbbCommontip = document.getElementsByClassName('mlbb-common-tip');
      const mtCommonInner = document.getElementsByClassName('mt-common-inner');
      const signmlbb = document.getElementsByClassName('signmlbb');

      if (signmlbb.length > 0) {
        signmlbb[0].style.display = 'none';
      }

      if (mtCommonInner.length > 0) {
        mtCommonInner[0].style.backgroundColor = 'black';
        mtCommonInner[0].style.color = 'white';
        mtCommonInner[0].style.borderRadius = '10px';
        mtCommonInner[0].style.padding = '10px';
        mtCommonInner[0].style.margin = '10px';
        mtCommonInner[0].style.textAlign = 'center';
        mtCommonInner[0].style.fontSize = '16px';
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

export default MLLogin;
