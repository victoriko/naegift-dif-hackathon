import { useEffect, useState } from 'react';
import styles from 'styles/routes/admin/Login.module.css';
import Button from 'components/common/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserLogin() {

 const [userId, setUserId] = useState("hcb1999");
 const [password, setPassword] = useState("hcb1004");
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { memberGiftNo, storeNo } = useParams();
  const [autoLogin, setAutoLogin] = useState(
    localStorage.getItem('autologin') === 'true'
  );
  const [saveId, setSaveId] = useState(
    localStorage.getItem('saveId') === 'true'
  );
  const [storeInfo, setStoreInfo] = useState(() => {
    // localStorage에서 store 정보를 가져옴
    return JSON.parse(localStorage.getItem(`store_${storeNo}`)) || {};
  });
  const admintoken = localStorage.getItem('adminaccess_token');

  const handleLogin = async () => {
    if (!userId || !password) {
      setShowWarning(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/getuser`,
        {
          userId: "hcb1999",//userId,
          pwd: "hcb1004" ,//password,
        }
      );
      // 로그인 성공 시 처리
      localStorage.setItem('admin_userid', userId);
      localStorage.setItem('admin_password', password);
      localStorage.setItem('adminaccess_token', response.data.data.accessToken);
      if (memberGiftNo === 'normal') {
        // qr을 카메라를 통해서 들어온 url의 경우 파라미터memberGiftNo값으로 숫자값을 넘겨주고있음 따라서 normal로 되어있는 부분은 일반 로그인, 숫자값으로 받았으면 qr검증하는페이지로 넘어감
        navigate(`/admin/status/${storeNo}`);
      } else {
        navigate(`/admin/verifyconfirm/${storeNo}/${memberGiftNo}`);
      }
    } catch (error) {
      // 로그인 실패 시 처리
      console.error('로그인 실패:', error);
    }
  };

  const handleAutoLoginToggle = () => {
    const newAutoLoginStatus = !autoLogin;
    setAutoLogin(newAutoLoginStatus);
    localStorage.setItem('autologin', newAutoLoginStatus);
  };

  const handleSaveIdToggle = () => {
    const newSaveIdStatus = !saveId;
    setSaveId(newSaveIdStatus);
    localStorage.setItem('saveId', newSaveIdStatus);
  };

  useEffect(() => {
    if (admintoken) {
      if (memberGiftNo === 'normal') {
        // qr을 카메라를 통해서 들어온 url의 경우 파라미터memberGiftNo값으로 숫자값을 넘겨주고있음 따라서 normal로 되어있는 부분은 일반 로그인, 숫자값으로 받았으면 qr검증하는페이지로 넘어감
        navigate(`/admin/status/${storeNo}`);
      } else {
        navigate(`/admin/verifyconfirm/${storeNo}/${memberGiftNo}`);
      }
    } else {
      return;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.logoFrame}>
        <div className={styles.imageFrame}>
        <img
            className={styles.logo}
            //src={storeInfo?.thumbnailUrl || '/images/default-logo.png'}
            src={ 'https://api-dev.naegift.com/store/thumbnail/20240619/1718780450666.jpg'} 
            alt="store logo"
          />
        </div>
        <div className={styles.titleFrame}>
        <div className={styles.title}>{storeInfo?.storeName+" giftshop" || '카페봄봄 기프트샵'}</div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.adminLogin}>Admin Login</div>
        <div className={styles.formFrame}>
          <input
            type="text"
            placeholder="아이디"
            value={"hcb1999"}
           // value={saveId ? userId : null}
            className={styles.input}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className={styles.input}
            value={"hcb1004"}
            //value={saveId ? password : null}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.optionContainer}>
          <div className={styles.optionFrame} onClick={handleSaveIdToggle}>
            <img
              className={styles.checked}
              src={saveId ? '/icons/checked.png' : '/icons/unchecked.png'}
              alt={saveId ? 'checked' : 'unchecked'}
            />
            <div className={styles.optionText}>Save ID</div>
          </div>
          <div className={styles.optionFrame} onClick={handleAutoLoginToggle}>
            <img
              className={styles.checked}
              src={autoLogin ? '/icons/checked.png' : '/icons/unchecked.png'}
              alt={autoLogin ? 'checked' : 'unchecked'}
            />
            <div className={styles.optionText}>Auto Login</div>
          </div>
        </div>
        {showWarning && <div>Please enter both your ID and password.</div>}
        <Button color="orange" onClick={handleLogin}>
          Login
        </Button>
      </div>
      <Button color="grayBorderWhite" icon="home">
        Home
      </Button>
    </div>
  );
}
