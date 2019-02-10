import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Book } from './book.model';

import { UIService } from '../shared/ui.service';

const BACKEND_URL = environment.apiUrl + "/books/";

@Injectable({
  providedIn: 'root'
})

export class BookService {
  private books: Book[] = [];
  private booksUpdated = new Subject<Book[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiService: UIService,
    private location: Location
  ) { }

  getBooks() {
    this.http
      .get<{ message: string, books: any }>(
        BACKEND_URL
      )
      .pipe(map((bookData) => {
        return bookData.books.map(book => {
          return {
            id: book._id,
            title: book.title,
            authors: book.authors,
            creator: book.creator,
            thumbnail: book.thumbnail,
            languages: book.languages,
            categories: book.categories,
            pageCount: book.pageCount,
            publisher: book.publisher,
            publishedDate: book.publishedDate,
            previewLink: book.previewLink,
            ean13: book.ean13
          };
        });
      }))
      .subscribe((transformedBooks) => {
        this.books = transformedBooks;
        this.booksUpdated.next([...this.books]);
        this.uiService.showSnackbar('Books fetched succesfully!', null, 3000);
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
      creator: string,
      thumbnail: string,
      languages: string[],
      categories: string[],
      pageCount: number,
      publisher: string,
      publishedDate: string,
      previewLink: string,
      ean13: string
    }>(
      BACKEND_URL + id
    );
  }

  addBook(mode: string, title: string, authors: string[], thumbnail: string,
    languages: string[], categories: string[], pageCount: number,
    publisher: string, publishedDate: string, previewLink: string,
    ean13: string) {
    const book: Book = {
      id: null,
      title: title,
      authors: authors,
      creator: null,
      thumbnail: thumbnail,
      languages: languages,
      categories: categories,
      pageCount: pageCount,
      publisher: publisher,
      publishedDate: publishedDate,
      previewLink: previewLink,
      ean13: ean13
    };
    switch (mode)
    {
       case "scan":
         this.http
         .post<{message: string, bookId: string}>(BACKEND_URL, book)
         .subscribe((responseData) => {
           const id = responseData.bookId;
           book.id = id;
           this.books.push(book);
           this.booksUpdated.next([...this.books]);
           this.uiService.showDialog(
             'Book inserted sucessfully!',
             'What do you want to do now?',
             true,
             false,
             true
           );
         });
         break;
       default:
         this.http
         .post<{message: string, bookId: string}>(BACKEND_URL, book)
         .subscribe((responseData) => {
           const id = responseData.bookId;
           book.id = id;
           this.books.push(book);
           this.booksUpdated.next([...this.books]);
           this.uiService.showDialog(
             'Book inserted sucessfully!',
             'What do you want to do now?',
             true,
             true,
             false
           );
         });
    }
  }

  updateBook(id: string, title: string, authors: string[],
    thumbnail: string, languages: string[], categories: string[],
    pageCount: number, publisher: string, publishedDate: string,
    previewLink: string, ean13: string) {
    const book: Book = {
      id: id,
      title: title,
      authors: authors,
      creator: null,
      thumbnail: thumbnail,
      languages: languages,
      categories: categories,
      pageCount: pageCount,
      publisher: publisher,
      publishedDate: publishedDate,
      previewLink: previewLink,
      ean13: ean13
    };
    this.http
      .put(BACKEND_URL + id, book)
        .subscribe(response => {
          const updatedBooks = [...this.books];
          const oldBookIndex = updatedBooks.findIndex(book => book.id === book.id);
          updatedBooks[oldBookIndex] = book;
          this.books = updatedBooks;
          this.booksUpdated.next([...this.books]);
          this.uiService.showSnackbar('Book edited succesfully!', 'Back to Books', 3000);
          // this.router.navigate(["/"]);
        });
  }

  deleteBook(bookId: string) {
    return this.http
      .delete(BACKEND_URL + bookId);
  }

  goBack(): void {
    this.location.back();
  }

}
