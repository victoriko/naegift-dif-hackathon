import Item from 'components/common/Item';
import Navbar from 'components/common/NavBar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosAdminFetch from 'hooks/useAxiosAdminFetch';
import translations from '../../utils/translations'; // 번역 객체 가져오기
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook

export default function Status() {
  const [giftState, setGiftState] = useState();
  const { storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosAdminFetch(); // 로딩의미: api 호출 중
  const { language } = useLanguage(); // 언어 상태 가져오기
  const t = translations[language]; // Translations short-hand

  const GiftStatus = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/gift?storeNo=${storeNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      setGiftState(response.data.data.list);
    } catch (error) {
      console.error('error:', error);
      // 에러 처리
    }
  };

  useEffect(() => {
    GiftStatus();
  }, []);

  return (
    <>
      <Navbar />
      {giftState &&
        giftState.length > 0 &&
        giftState.map((gift) => (
          <div className="container" key={gift.giftId}>
            <Item
              image={gift.fileUrl}
              title={gift.giftName}
              content={gift.giftDesc}
              cost={gift.price.toLocaleString() + t.money}
            >
              <div>{t.validity} {t.validityPeriod(3)}</div>
              <div>{t.giftCondition}</div>
              <div>{t.giftId} : {gift.giftId}</div>
              <div>{t.state} : {t.stateDesc[gift.stateDesc] || gift.stateDesc}</div>
              <div>{t.totalIssued} : {gift.countIssued}</div>
              <div>{t.totalSold} : {gift.countSold}</div>
              <div>
                {t.totalSalesAmount} : {(gift.price * gift.countSold).toLocaleString() + t.money}
              </div>
              <div>{t.registrationDate} : {gift.regDttm}</div>
            </Item>
            <div className="line" />
          </div>
        ))}
    </>
  );
}

