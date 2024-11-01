import styles from 'styles/routes/admin/Verification.module.css';
import Navbar from 'components/common/NavBar';
import { useEffect, useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

export default function Verification() {
  const navigate = useNavigate();
  const { storeNo } = useParams();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState('Camera');
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (searchParams.get('state')) {
      setState(searchParams.get('state'));
    }
  }, [searchParams]);

  const handleResult = (result) => {
    if (result) {
      const parts = result.text.split('/'); // "/"를 기준으로 URL을 분할하여 배열로 반환
      const id = parts[parts.length - 1];
      setQrValue(id); // QR 코드 값 상태 업데이트
      navigate(`/admin/verifyconfirm/${storeNo}/${id}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.cameraContainer}>
        <QrScanner onResult={handleResult} />
        <div>Scanned QR value: {qrValue ? qrValue : ''}</div>
      </div>
    </>
  );
}
