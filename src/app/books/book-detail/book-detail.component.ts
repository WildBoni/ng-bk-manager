import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) { }

  ngOnInit(): void {
    // this.getBook();
  }

// TODO: get details of a single book
  // getBook(): void {
  //   const id = +this.route.snapshot.paramMap.get('id');
  //   this.bookService.getBook(id)
  //     .subscribe(book => this.book = book);
  // }

  goBack(): void {
    this.location.back();
  }

  // save(): void {
  //   this.bookService.updateBook(this.book)
  //     .subscribe(() => this.goBack());
  // }
}
