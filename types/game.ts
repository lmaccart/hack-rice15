export interface Hotspot {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  displayName: string;
}

export type OverlayType =
  | 'credituniversity'
  | 'bank'
  | 'townhall'
  | 'shop'
  | 'bistro'
  | 'policestation'
  | null;

export interface PlayerAnimation {
  key: string;
  idleFrame: string;
}
