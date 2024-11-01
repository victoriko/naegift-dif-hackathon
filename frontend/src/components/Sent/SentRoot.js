import Navbar from 'components/common/NavBar';
import Submenu from 'components/common/SubMenu';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import SentCard from './SentCard';
import useAxiosFetch from 'hooks/useAxiosFetch';

export default function SentRoot() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('unused');
  const [sentGift, SetSentGift] = useState('');
  const [sentAllGift, SetSentAllGift] = useState('');
  const [sentUsedGift, SetSentUsedGift] = useState('');
  const { storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosFetch(); //로딩의미: api호출중
  const jwtToken = localStorage.getItem('Access_Token');

  const SentGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase?storeNo=${storeNo}&state=GS01`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetSentGift(response.data.data.list);
    } catch (error) {
      console.error('error:', error);
      // 에러 처리
    }
  };

  const SentAllGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase?storeNo=${storeNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetSentAllGift(response.data.data.list);
    } catch (error) {
      console.error('error:', error);
      // 에러 처리
    }
  };

  const SentUsedGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/purchase?storeNo=${storeNo}&state=GS02`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetSentUsedGift(response.data.data.list);
    } catch (error) {
      console.error('error:', error);
      // 에러 처리
    }
  };

  useEffect(() => {
    setStatus(searchParams.get('status'));
    if (searchParams.get('status') === 'unused') {
      SentGift();
    } else if (searchParams.get('status') === 'unavailable') {
      SentUsedGift();
    } else {
      SentAllGift();
    }
  }, [searchParams]);
  console.log(status);
  return (
    <>
      <Navbar />
      <Submenu />
      {status === 'unused' && <SentCard giftState={sentGift} />}
      {status === 'unavailable' && <SentCard giftState={sentUsedGift} />}
      {status === 'all' && <SentCard giftState={sentAllGift} />}
    </>
  );
}
