import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LazySpinner from 'components/common/LazySpinner';
import useAxiosFetch from 'hooks/useAxiosFetch';

const PaymentConfirm = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { paymentKey, orderId, amount } = Object.fromEntries(
    urlParams.entries()
  );
  const { storeNo } = useParams();
  const navigate = useNavigate();
  const { fetchData, isLoading } = useAxiosFetch(); //로딩의미: api호출중

  const [checkAmount, setCheckAmount] = useState();

  const email = localStorage.getItem('useremail');
  const reduxPurchase = useSelector((state) => state.purchaseInfo);
  console.log(checkAmount, amount);
  const { giftName, price, ...restPurchaseInfo } = reduxPurchase.purchaseInfo; // toss 위젯에서 필요한 기프트명을 사용하고 해당 컴포넌트에서 기프트명을 제외해서 /purchase api 호출 바디값 생성

  const purchaseinfo = {
    ...restPurchaseInfo,
    paymentKey: paymentKey,
    orderId: orderId,
  };
  console.log(purchaseinfo);

  const payMentSuccessAfter = async () => {
    //결제 승인 완료 후

    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase`;
      const response = await fetchData({
        method: 'POST',
        url: url,
        data: purchaseinfo,
      });
      console.log(response.data.data.purchaseNo);
      navigate(
        `/PaymentSuccessAfter/${storeNo}/${response.data.data.purchaseNo}`
      );
    } catch (error) {
      console.log(error);
      //navigate("/");
    }
  };
  const BeforeConfirmDataCheck = async () => {
    try {
      console.log("프론트에서 금액 비교 ")

      const url = `${process.env.REACT_APP_API_SERVER}/pg/${orderId}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      console.log(response.data.data.amount);
      if (response.data.data.amount == amount) {
        console.log('금액일치');
        TossConfirm();
      } else {
        console.log('금액 불일치');
      }
      setCheckAmount(response.data.data.amount);
    } catch (error) {console.log("프론트에서 api 에러:", error)}
  };

  const TossConfirm = async () => {
    const jwtToken = localStorage.getItem('Access_Token');

    console.log(jwtToken, email, orderId, amount, paymentKey);

    const confirmData = {
      jwtToken: jwtToken,
      email: email,
      orderId: orderId,
      amount: amount,
      paymentKey: paymentKey,
    };

    const url = `${process.env.REACT_APP_API_SERVER}/pg_toss/confirm`;
    const response = await fetchData({
      method: 'POST',
      url: url,
      data: confirmData,
    });
    console.log(response);

    if (response.status === 200) {
      payMentSuccessAfter();
    } else if (response.status === 400) {
      console.log('잘못된 요청입니다');
      alert('잘못된 요청입니다!');
    }
  };

  useEffect(() => {
    const fetchDataBeforeConfirm = async () => {
      await BeforeConfirmDataCheck();
    };
    fetchDataBeforeConfirm();
  }, []);

  /* useEffect(()=>{
    
     if (checkAmount == amount) {
      TossConfirm();
      console.log("금액 일치");
    } else {
      console.log("금액 불일치");
    }
  }, [jwtToken]);
  */
  return (
    <>
      <LazySpinner />
    </>
  );
};
export default PaymentConfirm;
