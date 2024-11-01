import React from 'react';
import { HashLoader } from 'react-spinners';
import styles from 'styles/components/LazySpinner.module.css';
const LazySpinner = () => {
  return (
    <div className={styles.lazySpinner}>
      <HashLoader color="#8AAAE5" />
    </div>
  );
};

export default LazySpinner;
