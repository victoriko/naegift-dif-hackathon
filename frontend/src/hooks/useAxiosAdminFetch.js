import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAxiosAdminFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { storeNo, memberGiftNo } = useParams();

  const autologin = localStorage.getItem('autologin');
  const jwtToken = localStorage.getItem('Access_Token');
  console.log(jwtToken);
  const useremail = localStorage.getItem('useremail');

  const refetchJwt = async (configParams) => {
    const userId = localStorage.getItem('admin_userid');
    const pwd = localStorage.getItem('admin_password');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/getuser`,
        {
          userId: userId,
          pwd: pwd,
        }
      );

      console.log('jwt재발급: ', response.data.data.accessToken);
      localStorage.setItem('adminaccess_token', response.data.data.accessToken);
      const jwtToken = response.data.data.accessToken;
      console.log(configParams);
      return await fetchData(configParams, jwtToken);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async (configParams, newtoken) => {
    const jwtToken = localStorage.getItem('adminaccess_token');
    console.log('기존토큰', jwtToken);
    console.log('새토큰', newtoken);
    // axios 인스턴스 생성
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_SERVER,
      headers: {
        Authorization: `Bearer ${newtoken ? newtoken : jwtToken}`,
      },
    });
    console.log(configParams);
    setIsLoading(true);
    try {
      // axios 인스턴스를 사용하여 요청 보내기
      const response = await axiosInstance(configParams);
      console.log(response);
      return response;
    } catch (error) {
      if (error.request.status === 401) {
        console.log(autologin);
        if (!jwtToken || !autologin) {
          //로그아웃 상태거나 자동로그인 체크를 안한상태
          Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'You need to log in. Would you like to go to the login page?',
            confirmButtonText: 'Confirm',
          }).then((result) => {
            localStorage.removeItem('adminaccess_token');
            if (result.isConfirmed) {
              console.log(memberGiftNo);
              if (memberGiftNo) {
                navigate(`/admin/login/${storeNo}/${memberGiftNo}`);
              } else {
                navigate(`/admin/login/${storeNo}/normal`);
              }
            }
          });
          console.log(autologin == 'true');
        } else if (autologin == 'true') {
          //자동로그인 상태
          return await refetchJwt(configParams);
          //fetchData(configParams);
          //setTimeout(fetchData(configParams), 3000);
          //logAfterDelay();
        } else {
          console.log(error);
          Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'You need to log in. Would you like to go to the login page?',
            confirmButtonText: 'Confirm',
          }).then((result) => {
            localStorage.removeItem('adminaccess_token');
            if (result.isConfirmed) {
              navigate(`/admin/login/${storeNo}/normal`);
            }
          });
          return { error };
        }
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, fetchData };
};

export default useAxiosAdminFetch;
