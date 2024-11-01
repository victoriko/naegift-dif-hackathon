import {
  createBrowserRouter,
  createRoutes,
  importMatch,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LazySpinner from 'components/common/LazySpinner';

const CommonRouter = lazy(() => import('Main'));
const ErrorPage = lazy(() => import('error-page'));
const AdminLogin = lazy(() => import('./components/admin/Login'));
const UserHome = lazy(() => import('./components/Home/Home'));
const UserLogin = lazy(() => import('./components/Login/Login'));
const Gift = lazy(() => import('./components/Gift/Gift'));
const ReceivedRoot = lazy(() => import('./components/Recevied/ReceivedRoot'));
const Status = lazy(() => import('./components/admin/Status'));
const Verification = lazy(() => import('./components/admin/Verification'));
const VerifyConfirm = lazy(() => import('./components/admin/VerifyConfirm'));
const VerifySuccess = lazy(() => import('./components/admin/VerifySuccess'));
const VerifyFailure = lazy(() => import('./components/admin/VerifyFailure'));
const Claim = lazy(() => import('./components/Claim/Claim'));
const Checkout = lazy(() => import('./components/Checkout/Checkout'));
const QRCode = lazy(() => import('./components/QRCode'));
const KaKaoCallback = lazy(() => import('./components/Login/KaKaoCallback'));
const NaverCallback = lazy(() => import('./components/Login/NaverCallback'));
const PaymentSuccessAfter = lazy(
  () => import('./components/TossPayment/PaymentSuccessAfter')
);
const PaymentConfirm = lazy(
  () => import('./components/TossPayment/PaymentConfirm')
);
const PaymentFail = lazy(() => import('./components/TossPayment/PaymentFail'));

const SentRoot = lazy(() => import('./components/Sent/SentRoot'));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<LazySpinner />}>
        <CommonRouter />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LazySpinner />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        children: [
          {
            path: '/:storeNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <UserHome />
              </Suspense>
            ),
          },
          {
            path: '/login/oauth2/code/kakao',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <KaKaoCallback />
              </Suspense>
            ),
          },
          {
            path: '/login/oauth2/code/naver',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <NaverCallback />
              </Suspense>
            ),
          },
          {
            path: '/login/:storeNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <UserLogin />
              </Suspense>
            ),
          },
          {
            path: '/gift/:storeNo/:giftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <Gift />
              </Suspense>
            ),
          },
          {
            path: '/PaymentConfirm/:storeNo/:giftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <PaymentConfirm />
              </Suspense>
            ),
          },
          {
            path: '/PaymentSuccessAfter/:storeNo/:purshaseNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <PaymentSuccessAfter />
              </Suspense>
            ),
          },
          {
            path: '/paymentfail/:storeNo/:purshaseNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <PaymentFail />
              </Suspense>
            ),
          },

          {
            path: '/:storeNo/received',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <ReceivedRoot />
              </Suspense>
            ),
          },
          {
            path: '/:storeNo/sent',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <SentRoot />
              </Suspense>
            ),
          },
          {
            path: 'claim/:storeNo/:purchaseNo/:uuid',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <Claim />
              </Suspense>
            ),
          },
          {
            path: 'checkout/:storeNo/:giftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <Checkout />
              </Suspense>
            ),
          },
          {
            path: 'qrcode',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <QRCode />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/admin',
        children: [
          {
            path: 'login/:storeNo/:memberGiftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <AdminLogin />
              </Suspense>
            ),
          },
          {
            path: 'status/:storeNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <Status />
              </Suspense>
            ),
          },
          {
            path: 'verification/:storeNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <Verification />
              </Suspense>
            ),
          },
          {
            path: 'verifyconfirm/:storeNo/:memberGiftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <VerifyConfirm />
              </Suspense>
            ),
          },
          {
            path: 'verifysuccess/:storeNo/:memberGiftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <VerifySuccess />
              </Suspense>
            ),
          },
          {
            path: 'verifyfailure/:storeNo/:memberGiftNo',
            element: (
              <Suspense fallback={<LazySpinner />}>
                <VerifyFailure />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/giftshop-kor-demo',
        element: (
          <Suspense fallback={<LazySpinner />}>
            <UserHome />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
