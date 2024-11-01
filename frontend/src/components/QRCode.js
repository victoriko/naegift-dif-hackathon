import QRCode from 'react-qr-code';
import style from 'styles/routes/QRCode.module.css';

export default function QRCodePage() {
  return (
    <div className="container">
      <h1>성공</h1>
      <div>
        <QRCode
          size={100}
          // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={'/admin/verification?state=success'}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className={style.line} />
      <h1 className={style.title}>실패</h1>
      <div>
        <QRCode
          size={16}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={'/admin/verification?state=failure'}
          viewBox={`0 0 16 16`}
        />
      </div>
      <div className={style.line} />
    </div>
  );
}
