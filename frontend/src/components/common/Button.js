import styles from 'styles/components/Button.module.css';

export default function Button({ color, icon, onClick, children }) {
  // 가능한 배경 색상 목록
  const validColors = [
    'orange',
    'yellow',
    'green',
    'grayBorderWhite',
    'darkGrayBorderWhite',
    'gray',
    'darkGray',
    'black',
  ];

  // color prop이 유효한 색상인지 확인
  const isValidColor = validColors.includes(color);

  // 유효한 색상이 아니면 기본값으로 흰색 배경, 검은색 글씨를 사용
  const colorClass = isValidColor ? styles[color] : styles.grayBorderWhite;

  // icon prop에 따라 다른 이미지 선택
  let iconSrc = null;

  switch (icon) {
    case 'gift':
      iconSrc = '/icons/gift.png';
      break;
    case 'kakao':
      iconSrc = '/images/kakao_logo.png';
      break;
    case 'naver':
      iconSrc = '/images/naver_logo.png';
      break;
    case 'google':
      iconSrc = '/images/google_logo.png';
      break;
    case 'home':
      iconSrc = '/icons/home.png';
      break;
    default:
      iconSrc = null;
  }

  return (
    <div className={`${styles.button} ${colorClass}`} onClick={onClick}>
      {iconSrc && <img className={styles.Icon} src={iconSrc} alt="Icon" />}
      <div className={styles.text}>{children}</div>
    </div>
  );
}
