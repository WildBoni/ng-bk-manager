import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalBookService {


  constructor() { }

  addBook(title) {
    console.log(title);
  }
}
