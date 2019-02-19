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
  publishedDate?: string;
  previewLink?: string;
  ean13?: string;
  favourite?: boolean;
  // toRead?: boolean;
}
