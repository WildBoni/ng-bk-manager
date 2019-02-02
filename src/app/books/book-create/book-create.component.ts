import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  languagesData = [];
  categoriesData = [];
  isLoading = false;
  private mode = 'create';
  private bookId: string;
  private authStatusSub: Subscription;
  bookForm: FormGroup;

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
    this.authors.removeAt(i);
  }

  get languages() {
    return this.bookForm.get('languages') as FormArray
  }

  getLanguages() {
    while(this.languages.length < this.languagesData.length) {
      this.languages.push(this.fb.control(''));
    }

    this.bookForm.patchValue({
      languages: this.languagesData
    });
  }

  addLanguage() {
    this.languages.push(this.fb.control(''));
  }

  removeLanguage(i) {
    this.languages.removeAt(i);
  }

  get categories() {
    return this.bookForm.get('categories') as FormArray
  }

  getCategories() {
    while(this.categories.length < this.categoriesData.length) {
      this.categories.push(this.fb.control(''));
    }

    this.bookForm.patchValue({
      categories: this.categoriesData
    });
  }

  addCategory() {
    this.categories.push(this.fb.control(''));
  }

  removeCategory(i) {
    this.categories.removeAt(i);
  }

  constructor(
    public bookService: BookService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      authors: this.fb.array([
        this.fb.control('')
      ]),
      thumbnail: [''],
      languages: this.fb.array([
        this.fb.control('')
      ]),
      categories: this.fb.array([
        this.fb.control('')
      ]),
      pageCount: ['', Validators.pattern("^[0-9]*$")],
      publisher: [''],
      publisherDate: [''],
      previewLink: ['']
    });

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
            title: bookData.title,
            thumbnail: bookData.thumbnail,
            pageCount: bookData.pageCount,
            publisher: bookData.publisher,
            publisherDate: bookData.publisherDate,
            previewLink: bookData.previewLink
          });
          this.authorsData = bookData.authors;
          this.getAuthors();
          this.languagesData = bookData.languages;
          this.getLanguages();
          this.categoriesData = bookData.categories;
          this.getCategories();
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
      }
    });
  }

  onSaveBook(form: NgForm) {
    if (this.bookForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.bookService.addBook(
        this.bookForm.value.title,
        this.bookForm.value.authors,
        this.bookForm.value.thumbnail,
        this.bookForm.value.languages,
        this.bookForm.value.categories,
        this.bookForm.value.pageCount,
        this.bookForm.value.publisher,
        this.bookForm.value.publisherDate,
        this.bookForm.value.previewLink
      );
    form.resetForm();
    } else {
      this.bookService.updateBook(
        this.bookId,
        this.bookForm.value.title,
        this.bookForm.value.authors,
        this.bookForm.value.thumbnail,
        this.bookForm.value.languages,
        this.bookForm.value.categories,
        this.bookForm.value.pageCount,
        this.bookForm.value.publisher,
        this.bookForm.value.publisherDate,
        this.bookForm.value.previewLink
      );
    }
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
