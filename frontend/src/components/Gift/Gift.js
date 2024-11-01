import Button from 'components/common/Button';
import Item from 'components/common/Item';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPurchaseInfo } from '../../state/actions';
import Swal from 'sweetalert2';
import styles from 'styles/routes/Gift.module.css';
import useAxiosFetch from 'hooks/useAxiosFetch';
import { useLanguage } from '../../hooks/LanguageContext'; // Import useLanguage hook
import translations from '../../utils/translations'; // Import translations
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리를 설치하여 사용 가능

export default function Gift() {
  const navigate = useNavigate();
  const useremail = localStorage.getItem('useremail');
  const { giftNo, storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosFetch(); //로딩의미: api호출중
  const [uniqueKeys, setUniqueKeys] = useState({ paymentKey: '', orderId: '' });
  const [giftData, setGiftData] = useState({
    //input창에 value값에
    gifteeMobile: '',
    gifteeEmail: '',
    memo: '',
  });
  console.log(giftData)
  const purchaseinfo = {
    ...uniqueKeys, // 생성된 paymentKey와 orderId를 추가
    storeNo: giftData.storeNo,
    giftNo: giftNo,
    gifterMobile: '01090113213',
    gifterEmail: useremail,
    gifteeMobile: giftData.gifteeMobile || ' ',
    gifteeEmail: giftData.gifteeEmail || ' ',
    memo: giftData.memo,
    sendMethod: "SM01",
    payMethod: 'PM01',
    pgId: 1,
    pgCode: '5983058359385iodutodt598593IUYUYU',
  };
  console.log(purchaseinfo)
  const payMentSuccessAfter = async () => {
    //결제 승인 완료 후

    try {
      console.log(purchaseinfo)
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

  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(null);

  const { language } = useLanguage(); // Use language state
  const t = translations[language]; // Get the translations for the current language

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === 'copy') {
      setGiftData((prevData) => ({ ...prevData, sendMethod: 'SM01' }));
    } else if (option === 'sms') {
      setGiftData((prevData) => ({ ...prevData, sendMethod: 'SM02' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGiftData((prevData) => ({ ...prevData, [name]: value }));
  };

  const giftDetailRendering = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/gift/${giftNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      setGiftData((prevData) => ({
        ...prevData,
        ...response.data.data,
      }));
      console.log(response);
    } catch (error) {
      console.error('기프트 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  //결제하기 버튼 클릭시
  const onClickPayEventListener = () => {
    // 인풋 내용이 빠진 부분이 있는지 확인
    if (!giftData.memo) {
      Swal.fire({
       icon: 'warning',
       title: 'Input Required',
       text: "Please enter the recipient's Gift Message",
      });
      return; // 결제하기 버튼 클릭이 무효화됨
    }
    if (selectedOption === 'sms') {
      if (!giftData.gifteeMobile || !giftData.gifteeEmail) {
        Swal.fire({
         icon: 'warning',
         title: 'Input Required',
         text: "Please enter the recipient's phone number and email address.",
        });
        return; // 결제하기 버튼 클릭이 무효화됨
      }
    }

    Swal.fire({
      title: 'Are you sure you want to purchase?',
      text: 'To proceed with the payment, please click Confirm.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setPurchaseInfo(purchaseinfo));
        payMentSuccessAfter();
      }
    });
    
    //navigate(`/checkout/${storeNo}/${giftNo}`, { state: { giftData } });
  };

  useEffect(() => {
    giftDetailRendering();
  }, []);
  useEffect(() => {
    // API 호출 시 유일한 값을 설정합니다.
    setUniqueKeys({
      paymentKey: `tgen_${Date.now()}${Math.random().toString(36).substr(2, 6)}`,
      orderId: `MC_${Date.now()}${Math.random().toString(36).substr(2, 6)}`
    });
  }, []); // 빈 배열을 사용해 최초 렌더링 시 한 번만 실행됩니다.
  return (
    <>
      {giftData ? (
        <div className={styles.container}>
          <div className={styles.div4}>
            <div className={styles.itemFrame}>
              <Item
                image={giftData.fileUrl}
                title={giftData.giftName}
                content={giftData.giftDesc}
                cost={
                  giftData.price ? giftData.price.toLocaleString() + t.money : ''
                }
              >
                <div>{t.validityPeriod(3)}</div>
                <div>
                  {t.paymentCondition(1)}
                </div>
                <div>{t.giftSerial} {giftData.giftId}</div>
              </Item>
            </div>
            <div className="line"></div>
            <div className={styles.div10}>
              <div className={styles.div11}>
                <div className={styles.message}>
                  <span>
                    <span className={styles.messageSpan}>{t.giftMessage}</span>
                    <span className={styles.messageSpan2}>{t.within50Chars}</span>
                  </span>
                  <label className={styles.messageLabel}>
                    {giftData.memo.length}/50
                  </label>
                </div>
              </div>
              <div className={styles.div12}>
                <textarea
                  className={styles.textarea}
                  name="memo"
                  value={giftData.memo}
                  onChange={handleChange}
                  maxLength={49}
                />
              </div>
            </div>
            <div className="line" />
      
          </div>
          <div className={styles.div18}>
            <Button color="gray" onClick={() => navigate(`/${storeNo}`)}>
              {t.home}
            </Button>
            <Button color="orange" onClick={onClickPayEventListener}>
              {t.makePayment}
            </Button>
          </div>
          <div className="line"></div>
        </div>
      ) : null}
    </>
  );
}



/*
      <div className={styles.div10}>
              <div className={styles.div11}>
                <div className={styles.div14}>{t.sendGiftAction}</div>
              </div>
              <div className={styles.div15}>
                <div
                  className={styles.option}
                  onClick={() => handleOptionClick('copy')}
                >
                  <img
                    className={
                      selectedOption === 'copy' ? styles.check : styles.check2
                    }
                    src={
                      selectedOption === 'copy'
                        ? '/icons/checked.png'
                        : '/icons/unchecked.png'
                    }
                    alt={selectedOption === 'copy' ? 'checked' : 'unchecked'}
                  />
                  <div className={styles.div16}>
                    {t.copyGiftLink}
                  </div>
                </div>
                <div
                  className={styles.option}
                  onClick={() => handleOptionClick('sms')}
                >
                  <img
                    className={
                      selectedOption === 'sms' ? styles.check : styles.check2
                    }
                    src={
                      selectedOption === 'sms'
                        ? '/icons/checked.png'
                        : '/icons/unchecked.png'
                    }
                    alt={selectedOption === 'sms' ? 'checked' : 'unchecked'}
                  />
                  <div className={styles.sms}>
                    {t.sendGiftLinkInstruction}
                  </div>
                </div>
              </div>
            </div>
            <div className="line"></div>
            {selectedOption === 'sms' && (
              <div className={styles.div10}>
                <div className={styles.div11}>
                  <div className={styles.div14}>{t.recipientPhone}</div>
                </div>
                <div className={styles.div15}>
                  <input
                    placeholder={t.recipientPhone}
                    className={styles.input2}
                    name="gifteeMobile"
                    value={giftData.gifteeMobile}
                    onChange={handleChange}
                  />
                  <input
                    placeholder={t.recipientEmail}
                    className={styles.input2}
                    name="gifteeEmail"
                    value={giftData.gifteeEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

*/