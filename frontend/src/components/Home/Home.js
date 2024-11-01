import Navbar from 'components/common/NavBar';
import Item from 'components/common/Item';
import Button from 'components/common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosFetch from 'hooks/useAxiosFetch';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function Home() {
  const [giftData, setGiftData] = useState([]);
  const navigate = useNavigate();
  const { storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosFetch(); // 로딩의미: api호출중
  const useremail = localStorage.getItem('useremail');
  const { language } = useLanguage(); // Use language state

  console.log(giftData);
  const onClickUserAuth = (giftnum) => {
    const kakaoAccessToken = localStorage.getItem('Access_Token');
    const googleAccessToken = localStorage.getItem('googleaccess_token');
    const naverAccessToken = localStorage.getItem('com.naver.nid.access_token');
    if (kakaoAccessToken || naverAccessToken || googleAccessToken) {
      navigate(`/gift/${storeNo}/${giftnum}`);
    } else {
      navigate(`/login/${storeNo}`);
    }
  };

  const removeUnit = (value) => {
    // "3m" or "1h"에서 "m" 또는 "h" 제거 후 숫자만 반환
    if(value){
      return parseInt(value.replace(/[^\d]/gi, ''), 10);
    }
  };

  const GiftRendering = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/gift?storeNo=${storeNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      setGiftData(response.data.data.list);
    } catch (error) {
      console.error('기프트 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  useEffect(() => {
    GiftRendering();
  }, []);

  return (
    <>
      <Navbar />
      {giftData &&
        giftData.length > 0 &&
        giftData.map((gift) => (
          <div key={gift.giftNo}>
            <div className="container">
              <Item
                image={gift.fileUrl}
                title={gift.giftName}
                content={gift.giftDesc}
                cost={gift.price.toLocaleString() + translations[language].money} 
              >
                {/* 서버에서 받은 유효기간(months)와 지급 조건(hours)를 전달하여 텍스트를 동적으로 렌더링 */}
                <div>{translations[language].validityPeriod(removeUnit(gift.validity))}</div>
                <div>{translations[language].paymentCondition(removeUnit(gift.transferTime))}</div>
                <div>
                  {translations[language].giftIdLabel}
                  {translations[language].giftSerial + gift.giftId}
                </div>
              </Item>
              <Button
                color="orange"
                icon="gift"
                onClick={(e) => onClickUserAuth(gift.giftNo)}
              >
                {translations[language].sendGift}
              </Button>
            </div>
            <div className="line" />
          </div>
        ))}
    </>
  );
}