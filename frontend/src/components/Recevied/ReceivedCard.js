import Item from 'components/common/Item';
import QR from 'components/common/QR';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function ReceivedCard({ giftState }) {
  const { storeNo } = useParams();
  const { language } = useLanguage(); // Use language state
  const t = translations[language]; // Translations short-hand

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${language === 'ko' ? '년' : '/'} ${month}${language === 'ko' ? '월' : '/'} ${day}${language === 'ko' ? '일' : ''}`;
  };

  return (
    <>
      {giftState &&
        giftState.length > 0 &&
        giftState.map((gift, index) => (
          <div key={index}>
            <div className="container">
              <Item
                image={gift.fileUrl}
                title={gift.giftName}
                content={gift.giftDesc}
                cost={gift.price.toLocaleString() + t.money} 
              >
                <div>
                  {t.validityPeriodDate} {formatDate(gift.validDttm)}
                </div>
                <div>{t.paymentCondition}</div>
                <div>
                  {t.giftSerial} {gift.giftId}
                </div>
                <div>
                  {t.state} {t.stateDesc[gift.stateDesc] || gift.stateDesc} {/* 상태 값을 바로 매핑 */}
                </div>
                <div>
                  {t.sender} {gift.gifterName}
                </div>
                <div>
                  {t.senderPhone} {gift.gifterMobile}
                </div>
                <div>
                  {t.senderEmail} {gift.gifterEmail}
                </div>
                <div>
                  {t.giftMessage} {gift.memo}
                </div>
              </Item>
              <QR
                storeNo={storeNo}
                memberGiftNo={gift.memberGiftNo}
                giftName ={gift.giftName}
              />
            </div>
            <div className="line" />
          </div>
        ))}
    </>
  );
}
