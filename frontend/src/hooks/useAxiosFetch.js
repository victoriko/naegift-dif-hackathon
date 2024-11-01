import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAxiosFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { storeNo } = useParams();

  let jwtToken = localStorage.getItem('Access_Token');
  const useremail = localStorage.getItem('useremail');

  const refetchJwt = async (configParams) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/getmember`,
        {
          email: useremail,
        }
      );

      const newToken = response.data.data.accessToken;
      localStorage.setItem('Access_Token', newToken);
      console.log(newToken);
      console.log(localStorage.getItem('Access_Token'));
      console.log('jwt 재발급:', newToken);

      // 새 토큰을 사용하여 다시 fetchData 호출

      return await fetchData(configParams);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async (configParams) => {
    console.log(localStorage.getItem('Access_Token'));
    const currentToken = localStorage.getItem('Access_Token');

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_SERVER,
      headers: currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {}, // 토큰이 없을 때 Authorization 헤더 생략
    });

    setIsLoading(true);
    try {
      const response = await axiosInstance(configParams);
   
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (!jwtToken) {
          Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'You need to log in. Would you like to go to the login page?',
            confirmButtonText: 'Confirm',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/login/${storeNo}`);
            }
          });
        } else {
          return await refetchJwt(configParams);
        }
      } else {
        console.log(error);
        return error.response;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchData };
};

export default useAxiosFetch;
