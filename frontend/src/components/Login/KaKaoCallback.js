import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LazySpinner from 'components/common/LazySpinner';
const KaKaoCallback = () => {
  const navigate = useNavigate();
  const reduxState = useSelector((state) => state.purchaseInfo);
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY; // 카카오 앱의 REST API 키
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI; // 리디렉션 URI
  const KAKAO_CODE = new URLSearchParams(window.location.search).get('code'); // 카카오에서 전달된 인가 코드

  const [kakaoAccessToken, setKakaoAccessToken] = useState(''); // 카카오 액세스 토큰
  const [userInfo, setUserInfo] = useState({}); // 유저 정보

  // 카카오 토큰 발급 요청 함수
  const getKakaoToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', REST_API_KEY);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code', KAKAO_CODE);

    try {
      const response = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          setKakaoAccessToken(data.access_token);
        }
      } else {
        console.error('카카오 토큰 발급 실패');
      }
    } catch (error) {
      console.error('카카오 토큰 발급 중 오류:', error);
    }
  };

  // 카카오 유저 정보 요청 함수
  const getKakaoUserInfo = async () => {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('useremail', data.kakao_account.email);
        setUserInfo({ email: localStorage.getItem('useremail') });
      } else {
        console.error('카카오 유저 정보 요청 실패');
      }
    } catch (error) {
      console.error('카카오 유저 정보 요청 중 오류:', error);
    }
  };
  const AuthMember = async () => {
    try {
      // 유저 정보를 API로 전송합니다.
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/member`,
        userInfo
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
  useEffect(() => {
    if (KAKAO_CODE) {
      getKakaoToken();
    }
  }, [KAKAO_CODE]);

  useEffect(() => {
    if (kakaoAccessToken) {
      getKakaoUserInfo();
    }
  }, [kakaoAccessToken]);
  useEffect(() => {
    if (userInfo.email) {
      AuthMember();
    }
  }, [userInfo.email]);
  return <LazySpinner />;
};

export default KaKaoCallback;
