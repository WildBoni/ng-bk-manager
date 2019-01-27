import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Book } from './book.model';

const BACKEND_URL = environment.apiUrl + "/books/";

@Injectable({
  providedIn: 'root'
})

export class BookService {
  private books: Book[] = [];
  private booksUpdated = new Subject<Book[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getBooks() {
    this.http
      .get<{ message: string, books: any }>(
        BACKEND_URL
      )
      .pipe(map((bookData) => {
        return bookData.books.map(book => {
          return {
            title: book.title,
            authors: book.authors,
            id: book._id,
            creator: book.creator
          };
        });
      }))
      .subscribe((transformedBooks) => {
        this.books = transformedBooks;
        this.booksUpdated.next([...this.books]);
      });
  }

  getBookUpdateListener() {
    return this.booksUpdated.asObservable();
  }

  getBook(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      authors: string[],
      creator: string
    }>(
      BACKEND_URL + id
    );
  }

  addBook(title: string, authors: string[]) {
    const book: Book = {
      id: null,
      title: title,
      authors: authors,
      creator: null
    };
    this.http
      .post<{message: string, bookId: string}>(BACKEND_URL, book)
        .subscribe((responseData) => {
          const id = responseData.bookId;
          book.id = id;
          this.books.push(book);
          this.booksUpdated.next([...this.books]);
          this.router.navigate(["/"]);
        });
  }

  updateBook(id: string, title: string, authors: string[]) {
    const book: Book = {
      id: id,
      title: title,
      authors: authors,
      creator: null
    };
    this.http
      .put(BACKEND_URL + id, book)
        .subscribe(response => {
          const updatedBooks = [...this.books];
          const oldBookIndex = updatedBooks.findIndex(book => book.id === book.id);
          updatedBooks[oldBookIndex] = book;
          this.books = updatedBooks;
          this.booksUpdated.next([...this.books]);
          this.router.navigate(["/"]);
        });
  }

  deleteBook(bookId: string) {
    return this.http
      .delete(BACKEND_URL + bookId);
  }

}
