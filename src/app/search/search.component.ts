import { Component, OnInit, OnDestroy } from '@angular/core';

import { BookService } from '../books/book.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { LocalBookService } from '../local-book.service';

import { Book } from '../books/book.model';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  book: any[];
  books: any[];
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(
    private googleBookApiService : GoogleBookApiService,
    private bookService: BookService,
    // private localBookService : LocalBookService
  ) { }

  ngOnInit() {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((value) => {
        this.OnSearch(value);
      });
  }

  inputChanged(value) {
    this.modelChanged.next(value);
  }

  OnSearch(s) {
    this.googleBookApiService.searchBooks(s)
      .subscribe((data) => {
        this.books = data.items;
      })
  }

  onAddBook(title: string, authors: string[], id: string) {
    this.bookService.addBook(title, authors);
    const updatedBooks = this.books.filter(book => book.id !== id);
    this.books = updatedBooks;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //
  // OnAddBook(book) {
  //   console.log(book.volumeInfo.title);
  //   this.book.push(book.volumeInfo.title);
  //   console.log(this.book);
  //   this.localBookService.addBook(book.volumeInfo.title)
  // }

}
