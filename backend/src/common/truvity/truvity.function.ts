import { TruvityClient } from '@truvity/sdk';
import { TruvityException } from './truvity.exception';
import { GiftCredential } from './credential.model';
import {
  truvityApiKey,
  truvityEnvironment,
  truvityPrivateKey,
} from 'src/common/constants/app.constant';

const client = new TruvityClient({
  environment: truvityEnvironment,
  apiKey: truvityApiKey,
});

export async function issueAndVerifyVC(data: GiftCredential): Promise<any> {
  try {
    const credentialDecorator = client.createVcDecorator(GiftCredential);

    // Create a draft
    const draft = await credentialDecorator.create({
      claims: {
        giftId: data.giftId,
        price: data.price,
        uuid: data.uuid,
        purchaseNo: data.purchaseNo,
        purchaseDate: data.purchaseDate,
        holderEmail: data.holderEmail,
      },
    });

    // Issue the VC
    const issuedVC = await draft.issue(truvityPrivateKey);
    // console.log('Issued VC:', issuedVC);

    // Verify the VC
    const result = await issuedVC.verify();
    return {
      credentialId: issuedVC.descriptor.id,
      issuedVC,
      verified: result.verified,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new TruvityException(`Failed to create VC: ${error.message}`);
  }
}

export async function deleteVc(id: string): Promise<any> {
  try {
    const vc = await this.client.credentials.credentialLatest(id);
    const etag = vc.etag;

    return await this.client.credentials.credentialDelete(id, {
      ifMatch: etag,
    });
  } catch (error) {
    console.error('Error:', error);
    throw new TruvityException(`Failed to find VCs: ${error.message}`);
  }
}

export async function issueAndVerifyVP(credentialId: string): Promise<any> {
  try {
    // Create a VP using the correct UUID
    const vpDecorator = client.createVpDecorator(); // VpDecorator
    const issuedVP = await vpDecorator.issue([credentialId], truvityPrivateKey); // VerifiablePresentation
    // console.log('Issued VP:', issuedVP);

    // Verify the VP
    const result = await issuedVP.verify();
    return {
      credentialId: issuedVP.descriptor.id,
      issuedVP,
      verified: result.verified,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new TruvityException(`Failed to create VP: ${error.message}`);
  }
}
