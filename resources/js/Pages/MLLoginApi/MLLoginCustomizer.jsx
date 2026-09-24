import { useEffect } from 'react';

export default function MLLoginCustomizer() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mlbbGameDownLoad = document.getElementsByClassName('mlbb-download-box');
      const mlbbSocial = document.getElementsByClassName('mlbb-social-box');
      const mlbbCommontip = document.getElementsByClassName('mlbb-common-tip');

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
  }, []);

  return null;
}
