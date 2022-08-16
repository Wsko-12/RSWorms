export type x = { type: number; xStart: number; xEnd: number; width: number };
export type xy = { y: number; x: x[] };

export type Line = { start: number; end: number; width?: number; height?: number };
export type Place = { y: number; x: Line };
