export interface Book {
  id: string;
  title: string;
  authors: string[];
  creator: string;
  thumbnail?: string;
  languages?: string[];
  categories?: string[];
  pageCount?: number;
  publisher?: string;
  publisherDate?: string;
  previewLink?: string;
}
