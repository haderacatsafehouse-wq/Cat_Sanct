
export interface MediaItem {
  type: 'image' | 'video';
  // content can be a URL string (for initial data/youtube) or a File object for uploads
  content: string | File;
}

export interface Cat {
  id: string;
  name: string;
  locationId: string;
  description: {
    shelterEntryYear: number;
    about: string;
  };
  media: MediaItem[];
}

export interface Location {
  id:string;
  name: string;
}
