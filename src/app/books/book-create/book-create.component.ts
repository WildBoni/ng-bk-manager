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
import { Location } from '@angular/common';
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
  // book: Book;
  authorsData = [];
  languagesData = [];
  categoriesData = [];
  bookImg = '';
  bookPreviewLink = '';
  isLoading = false;
  enableEdit = false;
  private mode = 'create';
  // private authStatusSub: Subscription;
  bookForm: FormGroup;
  private bookSub: Subscription;
  bookFav: boolean = false;
  bookId: string;

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
    // private authService: AuthService,
    private location: Location,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.bookSub = this.bookService.getBookUpdateListener()
      .subscribe((book: any) => {
        this.bookFav = book.favourite;
      });

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
      publishedDate: [''],
      previewLink: [''],
      ean13: ['']
    });

    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
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
            publishedDate: bookData.publishedDate,
            previewLink: bookData.previewLink,
            ean13: bookData.ean13,
          });
          this.authorsData = bookData.authors;
          this.getAuthors();
          this.languagesData = bookData.languages;
          this.getLanguages();
          this.categoriesData = bookData.categories;
          this.getCategories();
          this.bookImg = bookData.thumbnail;
          this.bookPreviewLink = bookData.previewLink;
          this.bookFav = bookData.favourite;
          // this.book = bookData;
          // console.log(this.book);
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
        // this.book.favourite = false;
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
        "insert",
        this.bookForm.value.title,
        this.bookForm.value.authors,
        this.bookForm.value.thumbnail,
        this.bookForm.value.languages,
        this.bookForm.value.categories,
        this.bookForm.value.pageCount,
        this.bookForm.value.publisher,
        this.bookForm.value.publishedDate,
        this.bookForm.value.previewLink,
        this.bookForm.value.ean13,
        this.bookFav
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
        this.bookForm.value.publishedDate,
        this.bookForm.value.previewLink,
        this.bookForm.value.ean13,
        this.bookFav
      );
    }
    this.isLoading = false;
  }

  onToggleFav(favBookId: string, favBookFav: boolean) {
    this.bookService.toggleSingleFav(favBookId, !favBookFav);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.bookSub.unsubscribe();
    // this.authStatusSub.unsubscribe();
  }

}
