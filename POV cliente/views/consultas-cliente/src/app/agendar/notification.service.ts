import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notify(message: string): void {
    alert(message); 
  }
}