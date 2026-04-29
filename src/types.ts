export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
