import styles from 'styles/routes/Login.module.css';
import Button from 'components/common/Button';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setStoreNoInfo } from 'state/actions';

export default function Login() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState();
  const { storeNo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 디스패치 함수
  const reduxState = useSelector((state) => state.purchaseInfo);
  const [storeInfo, setStoreInfo] = useState(() => {
    // localStorage에서 store 정보를 가져옴
    return JSON.parse(localStorage.getItem(`store_${storeNo}`)) || {};
  });

  const naverRef = useRef();
  useEffect(() => {
    const kakaoaccess_token = localStorage.getItem('Access_Token');
    const googleaccess_token = localStorage.getItem('googleaccess_token');
    const naveraccess_token = localStorage.getItem(
      'com.naver.nid.access_token'
    );
    if (naveraccess_token) {
      //navigate("/");
    } else if (googleaccess_token) {
      //navigate("/");
    } else if (kakaoaccess_token) {
      //navigate("/");
    } else {
      dispatch(setStoreNoInfo(storeNo));
      navigate(`/login/${storeNo}`);
    }
  }, []);
  const AuthMember = async () => {
    try {
      // 유저 정보를 API로 전송합니다.
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/member`,
        {email: "hcbtest1999@kakao.com"}
      );

      // 응답을 확인하고 필요한 작업을 수행합니다.

      localStorage.setItem('Access_Token', response.data.data.accessToken);
      navigate(`/${reduxState.storeNo}`);
    } catch (error) {
      // 오류 처리
      console.error('유저 정보를 API로 보내는 중 오류가 발생했습니다:', error);
      throw error; // 오류를 다시 던져서 호출자에게 전달합니다.
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );

      localStorage.setItem('googleaccess_token', tokenResponse.access_token);

      navigate('/');
    },
    onError: (errorResponse) => alert(errorResponse),
  });
  const handleNaverClick = () => {
    naverRef.current.children[0].click();
  };

  useEffect(() => {
    const initializeNaverLogin = () => {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_KEY,
        callbackUrl: process.env.REACT_APP_NAVER_REDIRECT_URI,
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 58 },
        callbackHandle: true,
      });

      naverLogin.init();

      naverLogin.getLoginStatus((status) => {
        if (status) {
          // 네이버 사용자 정보 가져오기
          const userProfile = naverLogin.user;

          // 가져온 사용자 정보를 활용하여 원하는 작업 수행
          console.log('User Profile:', userProfile);
        } else {
          console.log('Naver login failed');
        }
      });
    };

    initializeNaverLogin();
  }, []);
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
      <div className={styles.buttonContainer}>
       
      
        <div ref={naverRef} id="naverIdLogin" style={{ display: 'none' }} />
       
        <Button color="grayBorderWhite"  onClick={AuthMember}>
          Login
        </Button>
      </div>
      <Button
        color="grayBorderWhite"
        icon="home"
        onClick={() => navigate(`/${storeNo}`)}
      >
        Home
      </Button>
    </div>
  );
}
