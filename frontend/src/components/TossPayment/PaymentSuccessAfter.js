import Button from 'components/common/Button';
import Item from 'components/common/Item';
import StatusMessage from 'components/common/StatusMessage';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from 'styles/routes/Gift.module.css';
import useAxiosFetch from 'hooks/useAxiosFetch';
import translations from '../../utils/translations'; // 번역 객체 가져오기
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import Swal from 'sweetalert2';

const PaymentSuccessAfter = () => {
  const [giftDetail, setGiftDetail] = useState('');
  const { language } = useLanguage(); // Use language state
  const navigate = useNavigate();
  const { purshaseNo, storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosFetch(); //로딩의미: api호출중

  console.log(giftDetail);

  // 유효기간 포맷팅 함수
  const formatValidity = (validityString) => {
    const unit = validityString.slice(-1); // 'M' 또는 'D' 추출
    const value = validityString.slice(0, -1); // 숫자 부분 추출

    if (unit === 'M') {
      return `${translations[language].afterReceivingGift} ${value}${translations[language].month}`;
    } else if (unit === 'D') {
      return `${translations[language].afterReceivingGift} ${value}${translations[language].day}`;
    } else {
      return translations[language].noValidityInfo;
    }
  };

  const GiftDetailRendering = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase/${purshaseNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      setGiftDetail(response.data.data);
    } catch (error) {
      console.error('error:', error);
      // 에러 처리
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.REACT_APP_FRONT_DOMAIN}/claim/${storeNo}/${purshaseNo}/${giftDetail.uuid}`
      );
      Swal.fire({
        icon: 'success',
        title: 'Copied to Clipboard',
        text: 'The URL has been successfully copied to your clipboard.',
      });
    } catch (e) {}
  };

  useEffect(() => {
    GiftDetailRendering();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.div4}>
        <div className={styles.itemFrame}>
          <div className={styles.div6}>{translations[language].giftDetails}</div>
          <Item
            image={giftDetail ? giftDetail.fileUrl : ''}
            title={giftDetail ? giftDetail.giftName : ''}
            content={giftDetail ? giftDetail.giftDesc : ''}
            cost={giftDetail ? giftDetail.price.toLocaleString() + translations[language].money : ''}
          >
            <div>
              {translations[language].validityPeriodDate} {giftDetail ? formatValidity(giftDetail.validity) : null}
            </div>
            <div>
              {translations[language].paymentCondition(1)}
            </div>
            <div>{translations[language].giftSerial}{giftDetail ? giftDetail.giftId : ''}</div>
            <div>{translations[language].state} {translations[language].giftState}</div>
          </Item>
        </div>
        <div className="line" />
        <div className={styles.sentDiv4}>
          <StatusMessage situation="gift" status="success" />
          <div className={styles.list}>
            <div className={styles.div16}>{translations[language].recipientPhone}</div>
            <div className={styles.phoneEmail}>
              {giftDetail ? giftDetail.gifteeMobile : ''}
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.div16}>{translations[language].recipientEmail}</div>
            <div className={styles.phoneEmail}>
              {giftDetail ? giftDetail.gifteeEmail : ''}
            </div>
          </div>
          <div className={styles.list2}>
            <div className={styles.messageInfo}>
              {translations[language].giftNote}
              <br />
              {translations[language].within50Chars}
            </div>
            <div className={styles.message2}>
              {giftDetail ? giftDetail.memo : ''}
            </div>
          </div>
          <div className={styles.list2}>
            <div className={styles.div16}>{translations[language].giftReceiveLink}</div>
            <div className={styles.link}>
            {process.env.REACT_APP_FRONT_DOMAIN}/claim/{storeNo}/{purshaseNo}/
              {giftDetail.uuid}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.div18}>
        <Button color="gray" onClick={() => navigate(`/${storeNo}`)}>
          {translations[language].home}
        </Button>
        <Button color="black" onClick={copyUrl}>
          {translations[language].copyLink}
        </Button>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default PaymentSuccessAfter;
