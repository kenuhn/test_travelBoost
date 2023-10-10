export interface DrawDotPropType {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  color: string
}

export type CoordinateType = {
  id: number
  text: string
  color: string
  sx: number
  ex: number
  sy: number
  ey: number
}
// { id=index: 0,  text: 'Walk', color: '#EE3423',  sx: 2500, sy: 50, ex: 2600, ey: 50, },
