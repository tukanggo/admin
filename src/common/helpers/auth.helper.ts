import * as Randtoken from 'rand-token';

export const generateOTP = () => Randtoken.generate(6, '543216789');
