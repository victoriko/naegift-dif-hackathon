import styles from 'styles/routes/Claim.module.css';
import Item from 'components/common/Item';
import { useState, useEffect } from 'react';
import QR from 'components/common/QR';
import StatusMessage from 'components/common/StatusMessage';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStoreNoInfo } from '../../state/actions';
import useAxiosFetch from 'hooks/useAxiosFetch';
import translations from '../../utils/translations'; // 번역 객체 가져오기
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import Swal from 'sweetalert2';

export default function Claim() {
  const [state, setState] = useState('receive');
  const { fetchData, isLoading } = useAxiosFetch(); // 로딩의미: api 호출 중
  const { language } = useLanguage(); // 언어 상태 가져오기
  const t = translations[language]; // Translations short-hand

  const [claimDetail, setClaimDetail] = useState();
  const { uuid, purchaseNo } = useParams();
  const dispatch = useDispatch();

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // 유효기간 포맷팅 함수
  const formatValidity = (validityString) => {
    const unit = validityString.slice(-1); // 'M' 또는 'D' 추출
    const value = validityString.slice(0, -1); // 숫자 부분 추출

    if (unit === 'M') {
      return `${t.afterReceivingGift} ${value}${t.month}`;
    } else if (unit === 'D') {
      return `${t.afterReceivingGift} ${value}${t.day}`;
    } else {
      return t.noValidityInfo;
    }
  };

  console.log(claimDetail);
  
  const GiftDetailRendering = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase/${purchaseNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      setClaimDetail(response.data.data);
    } catch (error) {
      console.log(error);
      // 에러 처리
    }
  };

  const ReceivedGift = async () => {
    // Show loading alert
    const loadingAlert = Swal.fire({
      title: 'Issuing Truvity VC', // Change to English message
      text: 'Please wait while we process your request...', // Optional: customize the loading text
      didOpen: () => {
        Swal.showLoading(); // Show the loading spinner
      },
      showConfirmButton: false,
      allowOutsideClick: false,
    });

    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift`;
      const response = await fetchData({
        method: 'POST',
        url: url,
        data: { uuid },
      });

      // Close the loading alert
      Swal.close();
console.log(response)
      if (response.data.statusCode === 400) {
        // Show failure alert
        Swal.fire({
          icon: 'error',
          title: t.giftReceiveFailure,
          text: t.giftReceiveFailureMessage, // Optional: add a detailed message
        });
        setState('failure');
      } else {
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: t.giftReceiveSuccess,
          text: t.giftReceiveSuccessMessage, // Optional: add a detailed message
        });
        setState('success');
      }
    } catch (error) {
      // Close the loading alert if there's an error
      Swal.close();
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: t.errorOccurred,
        text: t.errorMessage, // Optional: add a message about the error
      });
    }
  };


  useEffect(() => {
    GiftDetailRendering();
    if (claimDetail) {
      dispatch(setStoreNoInfo(claimDetail.storeNo));
      console.log(claimDetail); 
    }
    
  }, [dispatch]);

  const Receive = () => {
    return (
      <>
        <div className="container">
          <span className={styles.instructionContainer}>
            <span className={styles.instruction}>
              {t.receiveGiftInstructions}
              <br />
            </span>
            <span className={styles.highlight}>{t.clickLink}</span>
          </span>
          <Item
            image={claimDetail ? claimDetail.fileUrl : ''}
            title={claimDetail ? claimDetail.giftName : ''}
            content={claimDetail ? claimDetail.giftDesc : ''}
            cost={claimDetail ? claimDetail.price.toLocaleString() + t.money : ''}
          >
            <div>
              {t.validity} {claimDetail ? formatValidity(claimDetail.validity) : null}
            </div> 
            <div>
              {t.giftCondition}
            </div>
            <div>{t.giftSerialNumber}{claimDetail ? claimDetail.giftId : ''}</div>
          </Item>
          <QR state="success" giftName={claimDetail? claimDetail.giftName: ""} />
        </div>
        <div className={styles.sentDiv4}>
          {state === 'success' ? (
            <StatusMessage situation="claim" status="success" />
          ) : state === 'failure' ? (
            <StatusMessage situation="claim" status="failure" />
          ) : null}
        
          <div className={styles.list}>
            <div className={styles.div16}>{t.senderPhoneNumber}</div>
            <div className={styles.phoneEmail}>
              {claimDetail ? claimDetail.gifterMobile : ''}
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.div16}>{t.senderEmail}</div>
            <div className={styles.phoneEmail}>
              {claimDetail ? claimDetail.gifterEmail : ''}
            </div>
          </div>
          <div className={styles.list2}>
            <div className={styles.messageInfo}>{t.giftMessageText}</div>
            <div className={styles.message2}>
              {claimDetail ? claimDetail.memo : ''}
            </div>
          </div>
          <div className={styles.list2}>
            <div className={styles.linkDiv}>{t.giftReceiveLinkText}</div>
            {/* https://www.naegift.com/ 이부분은 한영 반영하면 안됨 */}
            <div onClick={ReceivedGift} className={styles.link}>
              https://www.naegift.com/
              <br />
              {uuid}
            </div>
          </div>
        </div>
      </>
    );
  };
  return <>{<Receive />}</>;
}

/*
  <div className={styles.list}>
            <div className={styles.div16}>{t.sender}</div>
            <div className={styles.phoneEmail}>
              {claimDetail ? claimDetail.gifteeEmail : ''}
            </div>
          </div>
           */