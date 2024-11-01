import { PhotoProvider, PhotoView } from 'react-photo-view';
import styles from 'styles/components/Item.module.css';
import React from 'react';

export default function Item({ image, title, content, cost, children }) {
  const noImageSrc = '/images/no-image.png';
  const displayImage =
    image === 'https://api-dev.naegift.com/' ? noImageSrc : image;

  console.log('Image URL:', image);
  console.log('Display Image URL:', displayImage);

  return (
    <section>
      <div className={styles.product}>
        <div className={styles.imageFrame}>
          <PhotoProvider>
            <PhotoView src={displayImage}>
              <img className={styles.image} src={displayImage} alt={title} />
            </PhotoView>
          </PhotoProvider>
        </div>
        <div className={styles.introduction}>
          <div className={styles.titleContentFrame}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{content}</div>
          </div>
          <div className={styles.cost}>{cost}</div>
        </div>
      </div>
      <div className={styles.information}>{children}</div>
    </section>
  );
}
