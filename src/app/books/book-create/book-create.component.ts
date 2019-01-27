import { Component, OnInit, OnDestroy } from '@angular/core';
// import { NgForm } from '@angular/forms';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
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
  book: Book;
  authorsData = [];
  isLoading = false;
  private mode = 'create';
  private bookId: string;
  private authStatusSub: Subscription;

  bookForm = this.fb.group({
    title: ['', Validators.required],
    authors: this.fb.array([
      this.fb.control('')
    ])
  });

  get authors() {
    return this.bookForm.get('authors') as FormArray
  }

  getAuthors() {
    while(this.authors.length < this.authorsData.length) {
      this.authors.push(this.fb.control(''));
    }

    this.bookForm.patchValue({
      authors: this.authorsData
    });
  }

  addAuthor() {
    this.authors.push(this.fb.control(''));
  }

  removeAuthor(i) {
    console.log(i);
    this.authors.removeAt(i);
    console.log(this.authors);
  }

  constructor(
    public bookService: BookService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
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
          this.bookForm.patchValue({
            title: bookData.title
          });
          this.authorsData = bookData.authors;
          console.log(this.authorsData);
          this.getAuthors();
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
      }
    });
  }

  onSaveBook() {
    if (this.bookForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.bookService.addBook(
        this.bookForm.value.title,
        this.bookForm.value.authors
      );
    } else {
      this.bookService.updateBook(
        this.bookId,
        this.bookForm.value.title,
        this.bookForm.value.authors
      );
    }
    this.bookForm.reset();
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
