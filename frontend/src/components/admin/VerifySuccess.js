import Item from 'components/common/Item';
import { useEffect, useState } from 'react';
import QR from 'components/common/QR';
import StatusMessage from 'components/common/StatusMessage';
import { useParams } from 'react-router-dom';
import useAxiosAdminFetch from 'hooks/useAxiosAdminFetch';
import Navbar from 'components/common/NavBar';
import translations from '../../utils/translations'; // 번역 객체 가져오기
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook

export default function VerifySuccess() {
  const jwtToken = localStorage.getItem('adminaccess_token');
  const [giftData, setGiftData] = useState();
  const { memberGiftNo } = useParams();
  const { fetchData, isLoading } = useAxiosAdminFetch(); // 로딩의미: api 호출 중
  const { language } = useLanguage(); // 언어 상태 가져오기
  const t = translations[language]; // Translations short-hand

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const GiftRendering = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift/${memberGiftNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      console.log(response);

      setGiftData(response.data.data);
    } catch (error) {
      console.error('기프트 데이터를 가져오는 중 오류가 발생했습니다:', error);
      //navigate(`/admin/status/${storeNo}`);
    }
  };

  useEffect(() => {
    GiftRendering();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <Item
          image={giftData ? giftData.fileUrl : ''}
          title={giftData ? giftData.giftName : ''}
          content={giftData ? giftData.giftDesc : ''}
          cost={giftData ? giftData.price.toLocaleString() + t.money : ''}
        >
          <div>{t.validity} {t.validityPeriod(3)}</div>
          <div>
            {t.giftCondition}
          </div>
          <div>{t.giftSerialNumber} {giftData ? giftData.giftId : ''}</div>
          <div>{t.state} {giftData ? t.stateDesc[giftData.stateDesc] : ''}</div>
        </Item>
        <QR state="success" giftName={giftData ? giftData.giftName : ''}/>
        <StatusMessage situation="verification" status="success" />
      </div>
    </>
  );
}
