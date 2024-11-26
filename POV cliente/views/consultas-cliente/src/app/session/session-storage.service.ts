import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  // Limpar todo o sessionStorage
  clearSessionStorage(): void {
    sessionStorage.clear();  // Limpa todo o sessionStorage
  }

  // Remover um item específico do sessionStorage
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
