import dotenv from 'dotenv';
import admin, { ServiceAccount } from 'firebase-admin';
dotenv.config();

import serviceAccount from './tukanggoapp-firebase-adminsdk-p9zcd-5005ed3852.json';

// console.log('HERERERERERHERERERERERER', serviceAccount);

// const adminConfig: ServiceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});
