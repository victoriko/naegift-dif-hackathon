import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create a Context
const LanguageContext = createContext();

// 2. Create a Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // 로컬 스토리지에서 언어 상태를 불러오거나 기본값으로 'ko'를 설정
    return localStorage.getItem('language') || 'en';
  });

  // 언어 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ko' ? 'en' : 'ko'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Create a custom hook to use the LanguageContext
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};