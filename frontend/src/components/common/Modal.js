import styles from 'styles/components/Modal.module.css';
import ReactModal from 'react-modal';
import Button from './Button';

export default function Modal({ isOpen, onOK, onCancel, children }) {
  const customStyle = {
    overlay: {
      background: 'rgba(34, 34, 34, 0.5)',
      padding: '0px 30px 0px 30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '60px',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    content: {
      inset: 'unset',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexShrink: '0',
      overflow: 'hidden',
      position: 'relative',
    },
  };
  return (
    <>
      {children}
      <ReactModal isOpen={isOpen} style={customStyle}>
        <div className={styles.iconFrame} onClick={onCancel}>
          <img
            className={styles.cancelIcon}
            src="/icons/cancel.png"
            alt="cancelIcon"
          />
        </div>
        <div className={styles.informationFrame}>
          <div className={styles.informationText}>
            환불요청시 선물하기가 취소됩니다.
            <br />
            또한 결제금액에서환불수수료(10%)
            <br />
            제하고 환불됩니다.
          </div>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formTable}>
            <div className={styles.field}>
              <div className={styles.fieldText}>은행</div>
            </div>
            <div className={styles.content}>
              <div className={styles.contentText}>우리은행</div>
            </div>
          </div>
          <div className={styles.formTable}>
            <div className={styles.field}>
              <div className={styles.fieldText}>계좌번호</div>
            </div>
            <div className={styles.content}>
              <div className={styles.contentText}>1002-486-65687</div>
            </div>
          </div>
          <div className={styles.formTable}>
            <div className={styles.field}>
              <div className={styles.fieldText}>예금주</div>
            </div>
            <div className={styles.content}>
              <div className={styles.contentText}>김수니</div>
            </div>
          </div>
        </div>
        <div className={styles.buttonsPair}>
          <Button color="darkGrayBorderWhite" onClick={onCancel}>
            취소
          </Button>
          <Button color="black" onClick={onOK}>
            확인
          </Button>
        </div>
      </ReactModal>
    </>
  );
}
