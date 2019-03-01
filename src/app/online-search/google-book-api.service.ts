import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleBookApiService {

  constructor(private http: Http) { }

  searchBooks(search) {
    const encodedURI = encodeURI("https://www.googleapis.com/books/v1/volumes?q="+ search +"&maxResults=12");
    return this.http.get(encodedURI)
      .pipe(
        map((response: Response) => response.json())
      );
  }

  searchBooksByEan(search) {
    const encodedURI = encodeURI("https://www.googleapis.com/books/v1/volumes?q="+ search +"&maxResults=12");
    return this.http.get(encodedURI)
      .pipe(
        map((response: Response) => response.json()),
        map(response => response.items.filter(item => item.volumeInfo.industryIdentifiers.find(f => f.identifier === search)) ),
      );
  }
}
