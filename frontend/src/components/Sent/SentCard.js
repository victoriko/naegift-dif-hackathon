import React, { useState } from 'react';
import Item from 'components/common/Item';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations

export default function SentCard({ giftState }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useLanguage(); // Use language state
  const t = translations[language]; // Get the translations for the current language

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${language === 'ko' ? '년' : '/'} ${month}${language === 'ko' ? '월' : '/'} ${day}${language === 'ko' ? '일' : ''}`;
  };

  const parseHours = (timeString) => {
    return timeString.replace('H', ''); // 'H'를 제거하고 숫자만 반환
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
                {/* 유효기간 표시 */}
                {gift.validDttm ? (
                  <div>
                    {t.validityPeriodDate} {formatDate(gift.validDttm)}
                  </div>
                ) : null}

                {/* 지급 조건 표시 */}
                <div>
                  {t.paymentCondition(gift ? parseHours(gift.transferTime) : '')}
                </div>

                {/* 기프트 시리얼 표시 */}
                <div>
                  {t.giftSerial} {gift.giftId}
                </div>

                {/* 상태 표시 */}
                <div>
                  {t.state} {t.stateDesc[gift.stateDesc] || "Not Received"}
                </div>
              </Item>

              {/* 모달을 사용한 환불 요청 버튼 */}
          
              <Modal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
              >
                <Button color="black" onClick={() => setIsModalOpen(true)}>
                  {language === 'ko' ? '환불요청' : 'Request Refund'}
                </Button>
              </Modal>
            </div>
            <div className="line" />
          </div>
        ))}
    </>
  );
}
