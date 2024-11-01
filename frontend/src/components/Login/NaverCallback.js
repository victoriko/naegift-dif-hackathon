import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NaverCallback = () => {
  const token = window.location.href.split('=')[1].split('&')[0];
  const [user, setUser] = useState('');
  const [userInfo, setUserInfo] = useState({}); // 유저 정보

  const navigate = useNavigate();

  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: process.env.REACT_APP_NAVER_CLIENT_KEY,
    callbackUrl: process.env.REACT_APP_NAVER_REDIRECT_URI,
    isPopup: false,
    loginButton: { color: 'green', type: 1, height: 60 },
    callbackHandle: true,
  });

  const AuthMember = async () => {
    try {
      // 유저 정보를 API로 전송합니다.
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/member`,
        userInfo
      );

      // 응답을 확인하고 필요한 작업을 수행합니다.

      localStorage.setItem('Access_Token', response.data.data.accessToken);
      navigate(`/41`);
    } catch (error) {
      // 오류 처리
      console.error('유저 정보를 API로 보내는 중 오류가 발생했습니다:', error);

      throw error; // 오류를 다시 던져서 호출자에게 전달합니다.
    }
  };

  useEffect(() => {
    const initializeNaverLogin = () => {
      naverLogin.getLoginStatus((status) => {
        if (status) {
          // 네이버 사용자 정보 가져오기
          const userProfile = naverLogin.user;
          localStorage.setItem('useremail', userProfile.email);
          setUserInfo({ email: localStorage.getItem('useremail') });
          // 가져온 사용자 정보를 활용하여 원하는 작업 수행
          console.log('User Profile:', userProfile.email);
        } else {
          console.log('Naver login failed');
        }
      });
    };
    initializeNaverLogin();
  }, []);
  useEffect(() => {
    naverLogin.init();
  }, []);
  useEffect(() => {
    if (userInfo.email) {
      AuthMember();
      navigate('/');
    }
  }, [userInfo.email]);

  return (
    <div>
      네이버 로그인 중!
      <div id="naverIdLogin"></div>
      {user && (
        <div>
          <h1>{user.response.name}</h1>
          <p>{user.response.email}</p>
        </div>
      )}
    </div>
  );
};

export default NaverCallback;
