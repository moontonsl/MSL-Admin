import React, { useState, useRef, useEffect } from "react";
import MLLogin from '../../MLLoginApi/MLLogin.jsx';
import styles from '../register.module.scss'; 


const Step3GameDetails = ({
  formData,
  handleInputChange,
  errorMessage,
  setErrorMessage
}) => {
  const [localError, setLocalError] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingMlId, setIsCheckingMlId] = useState(false);
  const [isMlIdValid, setIsMlIdValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [dropdownOptions, setDropdownOptions] = useState({
    rankings: [],
    in_game_roles: [],
    main_heroes: []
  });

  const loginRef = useRef();

  useEffect(() => {
    fetch('/json/lists.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setDropdownOptions(data);
      })
      .catch(error => {
        console.error("Error fetching dropdown lists:", error);
      });
  }, []);

  const handleLoginInfo = (info) => {
    console.log('Received Login Info:', info);
    setUserInfo(info);
    
    if (info?.code === 0) {
      const data = info.data;

      formData.ign = data.name || '';
      formData.level = data.level || '';
      formData.country = data.reg_country || '';
      formData.userId = data.roleId || '';
      formData.serverId = data.zoneId || '';
      formData.avatar = data.avatar || '';

      handleInputChange({ target: { name: 'ign', value: data.name || '' } });
      handleInputChange({ target: { name: 'level', value: data.level || '' } });
      handleInputChange({ target: { name: 'country', value: data.reg_country || '' } });
      handleInputChange({ target: { name: 'userId', value: data.roleId || '' } });
      handleInputChange({ target: { name: 'serverId', value: data.zoneId || '' } });
      handleInputChange({ target: { name: 'avatar', value: data.avatar || '' } });
    
      const checkMlIdExists = async (ml_id) => {
        try {
          const response = await fetch(`/check-ml-id?ml_id=${encodeURIComponent(ml_id)}`);
          const data = await response.json();
          console.log('ML ID Check Response:', data);
          return data.exists;
        } catch (error) {
          console.log(encodeURIComponent(ml_id));
          console.error('Error checking ML ID:', error);
          return false;
        }
      };

      const checkMlIdAndHandleResult = async () => {
        setIsCheckingMlId(true);
        setLocalError("");
        
        try {
          const mlIdExists = await checkMlIdExists(data.roleId || '');
          console.log('ML ID Exists:', mlIdExists);
          if (mlIdExists) {
            setErrorMessage(`⚠️ ML Account: The ML Account has already been taken.`);
            setIsMlIdValid(false);
            handleInputChange({ target: { name: 'ign', value: '' } });
            handleInputChange({ target: { name: 'level', value: '' } });
            handleInputChange({ target: { name: 'country', value: '' } });
            handleInputChange({ target: { name: 'userId', value: '' } });
            handleInputChange({ target: { name: 'serverId', value: '' } });
            handleInputChange({ target: { name: 'avatar', value: '' } });
            console.log(localError);
            setTimeout(() => {
              setIsBlurred(false);
            }, 1000);
          } else {
            setLocalError("");
            setIsMlIdValid(true);
            if (setErrorMessage) setErrorMessage("");
            setIsBlurred(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error during ML ID check:', error);
          setLocalError("⚠️ Error checking ML ID. Please try again.");
        } finally {
          setIsCheckingMlId(false);
        }
      };

      checkMlIdAndHandleResult();
      
    } else {
      setIsLoading(false);
      setIsBlurred(false);
    }
  };

  const handleLoginClick = () => {
    setIsLoading(true);
    setIsBlurred(false);
    if (loginRef.current) {
      loginRef.current.triggerLogin();
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "userId",
      "serverId",
      "rank",
      "inGameRole",
      "mainHero"
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        setLocalError("⚠️ Please fill in all the required fields.");
        if (setErrorMessage) setErrorMessage("⚠️ Please fill in all the required fields.");
        return false;
      }
    }
    setLocalError("");
    if (setErrorMessage) setErrorMessage("");
    return true;
  };

  const handleAnyInputBlur = () => {
    validateForm();
  };

  return (
    <div className="">
      <h1 className={`${styles['title-register']} text-white mb-2 text-2xl md:text-[2.5rem]`}>
        CREATE MSL ACCOUNT
      </h1>
      <h2 className={`${styles['subtitle-register']} text-white`}>
        MLBB DETAILS
      </h2>

      {(() => {
        const requiredFields = [
          "userId",
          "serverId",
          "rank",
          "inGameRole",
          "mainHero"
        ];
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        const percent = 51 + Math.round((filled / requiredFields.length) * (75 - 51));

        return (
          <div className="my-4 px-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-xs text-gray-100 text-right">
              Step 3 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}
      
      <div className="w-full max-w-2xl relative border border-blue-500 rounded-lg overflow-hidden">
        {!isBlurred && (
          <div className={`
            ${styles.blurred} 
            absolute inset-0 flex flex-col md:flex-row justify-center items-center 
            w-full h-full bg-black bg-opacity-50 rounded-lg z-20 p-4 
            backdrop-blur-md 
          `}>
            <img src="/mlbb-logo.png" alt="MSL Logo" className="w-36 md:w-48 mb-4 md:mb-0 md:mr-8" />
            <div className={`${styles.loading}`}>
              <svg
                width="64px"
                height="48px"
                viewBox="0 0 64 48"
                style={{ transform: "translateX(-16px)" }}
              >
                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  stroke="#c14d05"
                  strokeWidth="3"
                  fill="none"
                />

                <polyline
                  points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                  stroke="#00ffcc"
                  strokeWidth="3"
                  fill="none"
                  style={{
                    strokeDasharray: 100,
                    strokeDashoffset: 100,
                    animation: `
                      dashFlow 1.5s linear infinite,
                      neonGlow 1.5s ease-in-out infinite alternate
                    `,
                    filter: "drop-shadow(0 0 2px #00ffcc) drop-shadow(0 0 4px #00ffcc)",
                  }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur=".5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke"
                    values="#00ffcc;#00ffff;#00ffcc"
                    dur=".5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="filter"
                    values="
                      drop-shadow(0 0 2px #00ffcc) drop-shadow(0 0 4px #00ffcc);
                      drop-shadow(0 0 4px #00ffff) drop0-shadow(0 0 6px #00ffff);
                      drop-shadow(0 0 2px #00ffcc) drop-shadow(0 0 4px #00ffcc)
                    "
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </polyline>
              </svg>
            </div>
            <div className={styles['electric-wrapper']}>
              <div 
                onClick={handleLoginClick}
                className={`${styles['neon-button']} text-sm md:text-base px-4 md:px-8 py-2 md:py-3 flex items-center justify-center gap-2`}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
                <div className={`${styles.lightning} ${isLoading ? styles['lightning-show'] : ''}`}></div>
              </div>
              <MLLogin
                ref={loginRef}
                onLoginInfo={handleLoginInfo}
                onLoginClose={() => {
                  setIsLoading(false);
                }}
                onLoginSuccess={() => {
                  setIsLoading(false);
                  setIsBlurred(true);
                }}
              />
            </div>
          </div>
        )}
        
        <div className="space-y-4 p-4">
            {isCheckingMlId && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded z-10">
                <div className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking ML ID availability...
                </div>
              </div>
            )}
            
            {isMlIdValid && !isCheckingMlId && (
              <div className="mb-4 p-3 bg-green-700 border border-green-500 text-white rounded">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ML Account is available! Please complete the form below.
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="userId" className="block text-white text-sm font-bold mb-2">
                  User ID<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  inputMode="numeric"
                  pattern="\d*"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 disabled:opacity-50`}
                  placeholder="e.g. 7373793739"
                  required
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("Text");
                    if (!/^\d+$/.test(pasted)) e.preventDefault();
                  }}
                  disabled
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="serverId"
                  className="block text-white text-sm font-bold mb-2"
                >
                  MLBB Server ID<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="serverId"
                  name="serverId"
                  inputMode="numeric"
                  pattern="\d*"
                  value={formData.serverId}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 disabled:opacity-50`}
                  placeholder="e.g. 12345"
                  required
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("Text");
                    if (!/^\d+$/.test(pasted)) e.preventDefault();
                  }}
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="ign" className="block text-white text-sm font-bold mb-2">
                  In-Game Name
                </label>
                <input
                  type="text"
                  id="ign"
                  name="ign"
                  value={formData.ign}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 disabled:opacity-50`}
                  disabled
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="squadName"
                  className="block text-white text-sm font-bold mb-2"
                >
                  MLBB Squad Name
                </label>
                <input
                  type="text"
                  id="squadName"
                  name="squadName"
                  value={formData.squadName}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
                  placeholder="e.g. Legends Squad"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="squadAbbreviation"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Squad Abbreviation
                </label>
                <input
                  type="text"
                  id="squadAbbreviation"
                  name="squadAbbreviation"
                  value={formData.squadAbbreviation}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
                  placeholder="e.g. El Fili Esports"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="rank" className="block text-white text-sm font-bold mb-2">
                  Current Rank<span className="text-red-500"> *</span>
                </label>
                <select
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 appearance-none`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1em 1em',
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Ranking
                  </option>
                  {dropdownOptions.rankings.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="inGameRole"
                  className="block text-white text-sm font-bold mb-2"
                >
                  In-Game Role<span className="text-red-500"> *</span>
                </label>
                <select
                  id="inGameRole"
                  name="inGameRole"
                  value={formData.inGameRole}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 appearance-none`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1em 1em',
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {dropdownOptions.in_game_roles.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="mainHero"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Main Hero<span className="text-red-500"> *</span>
                </label>
                <select
                  id="mainHero"
                  name="mainHero"
                  value={formData.mainHero}
                  onChange={handleInputChange}
                  className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400 appearance-none`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1em 1em',
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Hero
                  </option>
                  {dropdownOptions.main_heroes.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
        </div>
      </div>
    </div> 
  );
};

export default Step3GameDetails;