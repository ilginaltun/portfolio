export type BookStatus = 'All' | 'Read' | 'Currently Reading' | 'Want to Read' | 'Discarded';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: BookStatus;
  review?: string;
  dateFinished?: string;
  featuredInWrapUp?: boolean;
  rating?: number;
}
