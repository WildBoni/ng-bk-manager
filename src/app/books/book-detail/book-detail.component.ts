import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from "../book.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book;

  isLoading = false;
  // private authStatusSub: Subscription;
  private bookSub: Subscription;
  bookFav: boolean = false;
  bookId: string;

  constructor(
    public bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    // private authService: AuthService,
  ) { }

  ngOnInit() {
    this.bookSub = this.bookService.getBookUpdateListener()
      .subscribe((book: any) => {
        this.book.favourite = book.favourite;
      });

    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );

    this.bookId = this.route.snapshot.paramMap.get('bookId');
    this.isLoading = true;
    this.bookService.getBook(this.bookId)
      .subscribe(bookData => {
        this.isLoading = false;
        let fetchedBookData: any = bookData;
        fetchedBookData.id = bookData._id;
        delete fetchedBookData._id;
        this.book = fetchedBookData;
        console.log(this.book);
      });
  }

  goBack() {
    this.location.back();
  }

  onToggleFav(favBookId: string, favBookFav: boolean) {
    this.bookService.toggleSingleFav(favBookId, !favBookFav);
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
    // this.authStatusSub.unsubscribe();
  }
}
