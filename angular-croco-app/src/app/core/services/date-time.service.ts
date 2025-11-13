import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }
}
