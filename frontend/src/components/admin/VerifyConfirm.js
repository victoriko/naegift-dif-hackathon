import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxiosAdminFetch from 'hooks/useAxiosAdminFetch';

export default function verifyConfirm() {
  const navigate = useNavigate();
  const { memberGiftNo, storeNo } = useParams();
  const [state, setState] = useState('Camera');
  const { fetchData, isLoading } = useAxiosAdminFetch(); //로딩의미: api호출중

  const jwtToken = localStorage.getItem('adminaccess_token');
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const verifyScan = async () => {
    const loadingAlert = Swal.fire({
      title: 'Truvity VP Verification in Progress',
      text: 'Please wait while we verify your request...',
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      },
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift/verify/${memberGiftNo}`;
      const response = await fetchData({
        method: 'POST',
        url: url,
        data: {},
      });
      console.log(response, '데이터 통신후 잘받아와짐');
      if (response.data.data.result) {
        Swal.close();
        navigate(`/admin/verifysuccess/${storeNo}/${memberGiftNo}`, {
          state: response.data,
        });
      } else {
        Swal.close();
        navigate(`/admin/verifyfailure/${storeNo}/${memberGiftNo}`, {
          state: response.data.data.failDesc,
        });
      }
    } catch (error) {
      console.error('error:', error);
      //navigate(`/admin/status/${storeNo}`);
    }
  };

  useEffect(() => {
    verifyScan();
  }, []);

  return <div  style={{ width: '100%', height:"2000px" }}>검증진행중입니다.</div>;
}
