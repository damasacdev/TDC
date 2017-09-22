import { Injectable } from '@angular/core';
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'NuttaphonChanpan';

@Injectable()
export class EncriptService {
  encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}
