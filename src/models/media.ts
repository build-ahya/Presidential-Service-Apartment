export interface Media {
  url: string;
  alt: string;
  type: 'image' | 'video';
  caption?: string;
  width: number;
  height: number;
}
