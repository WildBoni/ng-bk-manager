import { Component, OnInit } from '@angular/core';

import { BookService } from '../books/book.service';
import { GoogleBookApiService } from '../google-book-api.service';
// import { LocalBookService } from '../local-book.service';

import { Book } from '../books/book.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  book: any[];
  books: any[];

  constructor(
    private googleBookApiService : GoogleBookApiService,
    private bookService: BookService
    // private localBookService : LocalBookService
  ) { }

  ngOnInit() {
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

  //
  // OnAddBook(book) {
  //   console.log(book.volumeInfo.title);
  //   this.book.push(book.volumeInfo.title);
  //   console.log(this.book);
  //   this.localBookService.addBook(book.volumeInfo.title)
  // }

}
