import * as dotenv from 'dotenv';
dotenv.config();

export const logDir = process.env.LOG_DIR || require('app-root-path') + '/logs';
// export const ImageDir =
//   process.env.IMAGE_DIR || require('app-root-path') + '/public';
export const connectionString = process.env.CONNECTION_STRING || '';
export const POLLER_WAIT_TIME =
  parseInt(process.env.POLLER_WAIT_TIME, 10) || 10;
export const IMAGE_PATH = process.env.IMAGE_PATH || '';
export const ncAccessKey = process.env.NC_ACCESS_KEY || '';
export const ncSecretKey = process.env.NC_SECRET_KEY || '';
export const ncServiceId = process.env.NC_SERVICE_ID || '';
export const ncSender = process.env.NC_SENDER || '';
export const ncUrl = process.env.NC_URL || '';
export const ncUri = process.env.NC_URI || '';

export const jwtConstants = {
  SECRET_KEY: process.env.JWT_SECRET_KEY || '',
  EXPIRATION_TIME: parseInt(process.env.JWT_EXPIRATION_TIME, 10) || 120,
};

export const tossSecretKey = process.env.TOSS_SECRET_KEY || '';
export const tossConfirmUrl = process.env.TOSS_CONFIRM_URL || '';
export const truvityEnvironment = process.env.TRUVITY_ENVIRONMENT || '';
export const truvityApiKey = process.env.TRUVITY_API_KEY || '';
export const truvityKeyType = process.env.TRUVITY_KEY_TYPE || '';
export const truvityPrivateKey = process.env.TRUVITY_PRIVATE_KEY || '';
export const truvityTenantDid = process.env.TRUVITY_TENANT_DID || '';
