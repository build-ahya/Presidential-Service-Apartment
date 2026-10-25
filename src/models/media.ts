export interface Media {
  url: string;
  alt: string;
  type: 'image' | 'video';
  caption?: string;
  width: number;
  height: number;
}

/** A file stored in the media library (Firebase Storage + Firestore record). */
export interface MediaAsset extends Media {
  id: string;
  /** Storage object path, e.g. `presidentialserviceapartments.ng/uploads/photo.jpg` */
  path: string;
  name: string;
  size: number;
  contentType: string;
  folder: string;
  createdAt: string;
  createdBy?: string;
}
