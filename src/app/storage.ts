import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  key: string = 'ProjekteRankingSecretKey';

  constructor() { }

  public saveAuthkey(authkey: string): void {
    localStorage.setItem('authkey', this.encrypt(authkey));
  }

  public getAuthkey(): string | null {
    const encryptedAuthkey = localStorage.getItem('authkey');
    return encryptedAuthkey ? this.decrypt(encryptedAuthkey) : null;
  }

  public clearAuthkey(): void {
    localStorage.removeItem('authkey');
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
