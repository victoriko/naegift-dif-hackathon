import Navbar from 'components/common/NavBar';
import Submenu from 'components/common/SubMenu';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ReceivedCard from './ReceivedCard';
import useAxiosFetch from 'hooks/useAxiosFetch';

export default function ReceivedRoot() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('unused');
  const [receivedGift, SetReceivedGift] = useState('');
  const [receivedUsedGift, SetReceivedUsedAllGift] = useState('');
  const [receivedAllGift, SetReceivedAllGift] = useState('');
  const { storeNo } = useParams();
  const { fetchData, isLoading } = useAxiosFetch(); //로딩의미: api호출중

  const ReceviedGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift?storeNo=${storeNo}&state=GS01`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetReceivedGift(response.data.data.list);
    } catch (error) {
      console.log(error);
      // 에러 처리
    }
  };
  const ReceviedAllGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift?storeNo=${storeNo}`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetReceivedAllGift(response.data.data.list);
    } catch (error) {
      // 에러 처리
    }
  };
  const ReceviedUsedGift = async () => {
    try {
      const url = `${process.env.REACT_APP_API_SERVER}/member-gift?storeNo=${storeNo}&state=GS02`;
      const response = await fetchData({
        method: 'GET',
        url: url,
      });
      SetReceivedUsedAllGift(response.data.data.list);
    } catch (error) {
      // 에러 처리
    }
  };
  useEffect(() => {
    ReceviedGift();
    ReceviedAllGift();
    ReceviedUsedGift();
    setStatus(searchParams.get('status'));
  }, [searchParams]);
  console.log(receivedAllGift);

  return (
    <>
      <Navbar />
      <Submenu />
      {status === 'unused' && <ReceivedCard giftState={receivedGift} />}
      {status === 'unavailable' && (
        <ReceivedCard giftState={receivedUsedGift} />
      )}
      {status === 'all' && <ReceivedCard giftState={receivedAllGift} />}
    </>
  );
}
