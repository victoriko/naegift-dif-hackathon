import { VcClaim, VcContext } from '@truvity/sdk';

@VcContext({
  name: 'GiftCredential',
  namespace: 'ttps://www.w3.org/2018/credentials/v1',
})
export class GiftCredential {
  @VcClaim
  giftId: string;

  @VcClaim
  price: number;

  @VcClaim
  uuid: string;

  @VcClaim
  purchaseNo: string;

  @VcClaim
  purchaseDate: string;

  @VcClaim
  holderEmail: string;
}
