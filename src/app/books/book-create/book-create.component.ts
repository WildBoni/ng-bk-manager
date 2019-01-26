import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from "../book.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit, OnDestroy {
  enteredAuthors = "";
  enteredTitle = "";
  book: Book;
  isLoading = false;
  private mode = 'create';
  private bookId: string;
  private authStatusSub: Subscription;

  constructor(
    public bookService: BookService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('bookId')) {
        this.mode = 'edit';
        this.bookId = paramMap.get('bookId');
        this.isLoading = true;
        this.bookService.getBook(this.bookId).subscribe(bookData => {
          this.isLoading = false;
          this.book = {
            id: bookData._id,
            title: bookData.title,
            authors: bookData.authors,
            creator: bookData.creator
          }
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
      }
    });
  }

  onSaveBook(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.bookService.addBook(
        form.value.title,
        form.value.authors
      );
    } else {
      this.bookService.updateBook(
        this.bookId,
        form.value.title,
        form.value.authors
      );
    }
    form.resetForm();
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
