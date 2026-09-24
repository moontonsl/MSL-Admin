// Step3GameDetails.jsx
import React, { useState, useRef } from "react";
import MLLogin from '../../MLLoginApi/MLLogin.jsx';


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

  const loginRef = useRef();

  const handleLoginInfo = (info) => {
    console.log('Received Login Info:', info);
    setUserInfo(info);
    info ? setIsBlurred(false) : setIsBlurred(true);
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
          return data.exists; // true if exists, false if not
        } catch (error) {
          console.log(encodeURIComponent(ml_id));
          console.error('Error checking ML ID:', error);
          return false;
        }
      };

      const checkMlIdAndHandleResult = async () => {
        setIsCheckingMlId(true);
        setLocalError(""); // Clear any previous errors
        
        try {
          const mlIdExists = await checkMlIdExists(data.roleId || '');
          console.log('ML ID Exists:', mlIdExists);
          if (mlIdExists) {
            setLocalError("⚠️ ML Account already used. Please use a different ML Account.");
            setIsMlIdValid(false);
            // Clear the form data using handleInputChange
            handleInputChange({ target: { name: 'ign', value: '' } });
            handleInputChange({ target: { name: 'level', value: '' } });
            handleInputChange({ target: { name: 'country', value: '' } });
            handleInputChange({ target: { name: 'userId', value: '' } });
            handleInputChange({ target: { name: 'serverId', value: '' } });
            handleInputChange({ target: { name: 'avatar', value: '' } });
            
            setTimeout(() => {
              setIsBlurred(false);
            }, 1000);
          } else {
            setLocalError(""); // Clear any existing errors
            setIsMlIdValid(true);
            if (setErrorMessage) setErrorMessage(""); // Clear parent errors
            setIsBlurred(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error during ML ID check:', error);
          setLocalError("⚠️ Error checking ML ID. Please try again.");
          // Don't clear form data on network error, let user retry
        } finally {
          setIsCheckingMlId(false);
        }
      };

      // Call the async function
      checkMlIdAndHandleResult();
      
    } else {
      setIsLoading(false);
      setIsBlurred(false); // Show the login screen again
    }
  };

  const handleLoginClick = () => {
    setIsLoading(true);
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
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <h2 className="subtitle-register">MLBB DETAILS</h2>

      {/* Dynamic Progress Bar for Step 3 */}
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
          <div style={{ margin: "16px 0" }}>
            <div style={{ height: "12px", background: "#eee", borderRadius: "6px", overflow: "hidden", marginBottom: "4px" }}>
              <div style={{ width: `${percent}%`, height: "100%", background: "#f1c40f", transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 3 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}
      <div className="form-register-container">
        {!isBlurred ?
          <div className="blurred">
            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-4 h-full pb-10 px-4">
              <img src="/mlbb-logo.png" alt="MSL Logo" className="msl-logo w-48 md:w-48" />
              <div className="loading scale-75 md:scale-100 rotate-90 md:rotate-0">
                <svg width="64px" height="48px" viewBox="0 0 64 48">
                  <polyline
                    points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                    id="back"
                  />
                  <polyline
                    points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                    id="front"
                  />
                </svg>
              </div>
              <div className="electric-wrapper">
                <div onClick={() => {
                  handleLoginClick()
                  }}
                  className="neon-button text-sm md:text-base px-4 md:px-8 py-2 md:py-3 flex items-center justify-center gap-2">
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
          </div>
        : null}
        <div className={`form-register`}>
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
          
          {localError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded z-10">
              {localError}
            </div>
          )}
          
          {isMlIdValid && !isCheckingMlId && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ML Account is available! Please complete the form below.
              </div>
            </div>
          )}
          
          <div className="form-row-register">
            <div className="input-group-register left-side-register">
              <label htmlFor="userId" className="label-register">
                User ID<span className="required"> *</span>
              </label>
              <input
                type="text"
                id="userId"
                name="userId"
                inputMode="numeric"
                pattern="\d*"
                value={formData.userId}
                onChange={handleInputChange}
                className="input-field-register"
                placeholder="e.g. 7373793739"
                required
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
                onPaste={e => {
                  const pasted = e.clipboardData.getData('Text');
                  if (!/^\d+$/.test(pasted)) e.preventDefault();
                }}
                onBlur={handleAnyInputBlur}
              disabled/>
            </div>
            <div className="input-group-register right-side-register">
              <label htmlFor="serverId" className="label-register">
                MLBB Server ID<span className="required"> *</span>
              </label>
              <input
                type="text"
                id="serverId"
                name="serverId"
                inputMode="numeric"
                pattern="\d*"
                value={formData.serverId}
                onChange={handleInputChange}
                className="input-field-register"
                placeholder="e.g. 12345"
                required
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
                onPaste={e => {
                  const pasted = e.clipboardData.getData('Text');
                  if (!/^\d+$/.test(pasted)) e.preventDefault();
                }}
                onBlur={handleAnyInputBlur}
              disabled/>
            </div>
          </div>
          <div className="form-row-register">
            <div className="input-group-register left-side-register">
              <label htmlFor="ign" className="label-register">
                In-Game Name
              </label>
              <input
                type="text"
                id="ign"
                name="ign"
                value={formData.ign}
                onChange={handleInputChange}
                className="input-field-register"

              disabled/>
            </div>
            <div className="input-group-register right-side-register">
              <label htmlFor="squadName" className="label-register">
                MLBB Squad Name
              </label>
              <input
                type="text"
                id="squadName"
                name="squadName"
                value={formData.squadName}
                onChange={handleInputChange}
                className="input-field-register"
                placeholder="e.g. Legends Squad"
              />
            </div>
          </div>
          <div className="form-row-register">
            <div className="input-group-register left-side-register">
              <label htmlFor="squadAbbreviation" className="label-register">
                Squad Abbreviation
              </label>
              <input
                type="text"
                id="squadAbbreviation"
                name="squadAbbreviation"
                value={formData.squadAbbreviation}
                onChange={handleInputChange}
                className="input-field-register"
                placeholder="e.g. El Fili Esports"
              />
            </div>
            <div className="input-group-register right-side-register">
              <label htmlFor="rank" className="label-register">
                Current Rank<span className="required"> *</span>
              </label>
              <select
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                className="input-field-register current-rank-select"
                required
                onBlur={handleAnyInputBlur}
              >
                <option value="" disabled>Select Ranking</option>
                <option value="Warrior">Warrior</option>
                <option value="Elite">Elite</option>
                <option value="Master">Master</option>
                <option value="Grandmaster">Grandmaster</option>
                <option value="Epic">Epic</option>
                <option value="Legend">Legend</option>
                <option value="Mythic">Mythic</option>
                <option value="Mythical Glory">Mythical Honor</option>
                <option value="Mythical Glory">Mythical Glory</option>
                <option value="Mythical Glory">Mythical Immortal</option>
              </select>
            </div>
          </div>
          <div className="form-row-register">
            <div className="input-group-register left-side-register">
              <label htmlFor="inGameRole" className="label-register">
                In-Game Role<span className="required"> *</span>
              </label>
              <select
                id="inGameRole"
                name="inGameRole"
                value={formData.inGameRole}
                onChange={handleInputChange}
                className="input-field-register in-game-role-select"
                required
                onBlur={handleAnyInputBlur}
              >
                <option value="" disabled>Select Role</option>
                <option value="Tank">Tank</option>
                <option value="Support">Support</option>
                <option value="Marksman">Marksman</option>
                <option value="Mage">Mage</option>
                <option value="Assassin">Assassin</option>
                <option value="Fighter">Fighter</option>
              </select>
            </div>
            <div className="input-group-register right-side-register">
              <label htmlFor="mainHero" className="label-register">
                Main Hero<span className="required"> *</span>
              </label>
              <select
                id="mainHero"
                name="mainHero"
                value={formData.mainHero}
                onChange={handleInputChange}
                className="input-field-register main-hero-select"
                required
                onBlur={handleAnyInputBlur}
              >
                <option value="" disabled>Select Hero</option>
                <option value="Aamon">Aamon</option>
                <option value="Akai">Akai</option>
                <option value="Aldous">Aldous</option>
                <option value="Alice">Alice</option>
                <option value="Alpha">Alpha</option>
                <option value="Alucard">Alucard</option>
                <option value="Angela">Angela</option>
                <option value="Argus">Argus</option>
                <option value="Arlott">Arlott</option>
                <option value="Atlas">Atlas</option>
                <option value="Aurora">Aurora</option>
                <option value="Badang">Badang</option>
                <option value="Balmond">Balmond</option>
                <option value="Barats">Barats</option>
                <option value="Baxia">Baxia</option>
                <option value="Beatrix">Beatrix</option>
                <option value="Belerick">Belerick</option>
                <option value="Benedetta">Benedetta</option>
                <option value="Brody">Brody</option>
                <option value="Bruno">Bruno</option>
                <option value="Carmilla">Carmilla</option>
                <option value="Cecilion">Cecilion</option>
                <option value="Chang'e">Chang'e</option>
                <option value="Chou">Chou</option>
                <option value="Clint">Clint</option>
                <option value="Cyclops">Cyclops</option>
                <option value="Diggie">Diggie</option>
                <option value="Dyrroth">Dyrroth</option>
                <option value="Edith">Edith</option>
                <option value="Esmeralda">Esmeralda</option>
                <option value="Estes">Estes</option>
                <option value="Eudora">Eudora</option>
                <option value="Fanny">Fanny</option>
                <option value="Faramis">Faramis</option>
                <option value="Floryn">Floryn</option>
                <option value="Freya">Freya</option>
                <option value="Gatotkaca">Gatotkaca</option>
                <option value="Gloo">Gloo</option>
                <option value="Gord">Gord</option>
                <option value="Granger">Granger</option>
                <option value="Grock">Grock</option>
                <option value="Guinevere">Guinevere</option>
                <option value="Gusion">Gusion</option>
                <option value="Hanabi">Hanabi</option>
                <option value="Hanzo">Hanzo</option>
                <option value="Harith">Harith</option>
                <option value="Harley">Harley</option>
                <option value="Hayabusa">Hayabusa</option>
                <option value="Helcurt">Helcurt</option>
                <option value="Hilda">Hilda</option>
                <option value="Hylos">Hylos</option>
                <option value="Irithel">Irithel</option>
                <option value="Jawhead">Jawhead</option>
                <option value="Johnson">Johnson</option>
                <option value="Joy">Joy</option>
                <option value="Julian">Julian</option>
                <option value="Kadita">Kadita</option>
                <option value="Kagura">Kagura</option>
                <option value="Kaja">Kaja</option>
                <option value="Karina">Karina</option>
                <option value="Karrie">Karrie</option>
                <option value="Khaleed">Khaleed</option>
                <option value="Khufra">Khufra</option>
                <option value="Kimmy">Kimmy</option>
                <option value="Lancelot">Lancelot</option>
                <option value="Lapu-Lapu">Lapu-Lapu</option>
                <option value="Layla">Layla</option>
                <option value="Leomord">Leomord</option>
                <option value="Lesley">Lesley</option>
                <option value="Ling">Ling</option>
                <option value="Lolita">Lolita</option>
                <option value="Lunox">Lunox</option>
                <option value="Luo Yi">Luo Yi</option>
                <option value="Lylia">Lylia</option>
                <option value="Martis">Martis</option>
                <option value="Mathilda">Mathilda</option>
                <option value="Melissa">Melissa</option>
                <option value="Minsitthar">Minsitthar</option>
                <option value="Minotaur">Minotaur</option>
                <option value="Moskov">Moskov</option>
                <option value="Natalia">Natalia</option>
                <option value="Natan">Natan</option>
                <option value="Novaria">Novaria</option>
                <option value="Odette">Odette</option>
                <option value="Paquito">Paquito</option>
                <option value="Pharsa">Pharsa</option>
                <option value="Phoveus">Phoveus</option>
                <option value="Popol and Kupa">Popol and Kupa</option>
                <option value="Rafaela">Rafaela</option>
                <option value="Roger">Roger</option>
                <option value="Ruby">Ruby</option>
                <option value="Saber">Saber</option>
                <option value="Selena">Selena</option>
                <option value="Silvanna">Silvanna</option>
                <option value="Sun">Sun</option>
                <option value="Terizla">Terizla</option>
                <option value="Thamuz">Thamuz</option>
                <option value="Tigreal">Tigreal</option>
                <option value="Vale">Vale</option>
                <option value="Valentina">Valentina</option>
                <option value="Valir">Valir</option>
                <option value="Vexana">Vexana</option>
                <option value="Wanwan">Wanwan</option>
                <option value="X.Borg">X.Borg</option>
                <option value="Xavier">Xavier</option>
                <option value="Yin">Yin</option>
                <option value="Yi Sun-shin">Yi Sun-shin</option>
                <option value="Yve">Yve</option>
                <option value="Yu Zhong">Yu Zhong</option>
                <option value="Zhask">Zhask</option>
                <option value="Zilong">Zilong</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3GameDetails;
