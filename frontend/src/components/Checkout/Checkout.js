import { useEffect, useRef } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import Button from 'components/common/Button';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useAxiosFetch from 'hooks/useAxiosFetch';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = generateRandomString();

const orderId = generateRandomString();

export default function Checkout() {
  const { giftNo, storeNo } = useParams();
  const purchaseInfod = useSelector((state) => state.purchaseInfo);
  const navigate = useNavigate();
  const { fetchData, isLoading } = useAxiosFetch();
  const paymentWidgetRef = useRef(null);
  const { language } = useLanguage(); // Use language state
  const jwtToken = localStorage.getItem('Access_Token');
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const payinfo = {
    orderId: orderId,
    amount: purchaseInfod.purchaseInfo.price,
  };
  const BeforePayRequest = async () => {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/pg`;
      const response = await fetchData({
        method: 'POST',
        url: url,
        data: payinfo,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      if (paymentWidgetRef.current == null) {
        paymentWidgetRef.current = paymentWidget;
      }

      paymentWidget.renderPaymentMethods(
        '#payment-widget',
        purchaseInfod.purchaseInfo.price
      );

      paymentWidgetRef.current = paymentWidget;
    })();
  }, []);

  const handlePaymentRequest = async () => {
    //결제 요청
    const paymentWidget = paymentWidgetRef.current;
    try {
      await paymentWidget?.requestPayment({
        orderId: orderId,
        orderName: purchaseInfod.purchaseInfo.giftName,
        customerName: '함창범테스트', // 로컬저장소에서 가져와야됨
        customerEmail: purchaseInfod.purchaseInfo.gifterEmail,
        customerMobilePhone: purchaseInfod.purchaseInfo.gifterMobile,
        successUrl: `${process.env.REACT_APP_FRONT_DOMAIN}/PaymentConfirm/${storeNo}/${giftNo}`,
        failUrl: `${process.env.REACT_APP_FRONT_DOMAIN}/paymentfail/${storeNo}/${giftNo}`,
      });
    } catch (error) {
      console.error('Error requesting payment:', error);
      alert('새로고침 해주세요');
      navigate(`/checkout/${storeNo}/${giftNo}`);
    }
  };
  return (
    <div className="container">
      <h1>{translations[language].orderForm}</h1>
      <div id="payment-widget" />
      <Button
        onClick={() => {
          try {
            BeforePayRequest();
            handlePaymentRequest();
          } catch (err) {}
        }}
      >
        {translations[language].makePayment}
      </Button>

    </div>
  );
}
