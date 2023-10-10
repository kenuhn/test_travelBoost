import React from 'react'
import { cellSize, hourCellSize } from '~/constants'
import { getCurrentTime } from './common'
import { CoordinateType, DrawDotPropType } from './types'

const draw_grid_background = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  segment_size: number,
) => {
  const canvas = canvasRef.current as HTMLCanvasElement
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  for (let x = 0; x < canvas.width; x += segment_size) {
    ctx.fillRect(x, 0, 1, canvas.height)
  }
  for (let y = 0; y < canvas.height; y += segment_size) {
    ctx.fillRect(0, y, canvas.width, 1)
  }
}

const drawDot = ({ ctx, x, y, color = 'grey' }: DrawDotPropType) => {
  ctx.beginPath()
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.arc(x, y, 15, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.closePath()
  ctx.stroke()
}

const drawHorizontalLine = (
  ctx: CanvasRenderingContext2D,
  segment: CoordinateType,
  color = 'blue',
) => {
  const { sx, sy, ex, ey } = segment
  ctx.beginPath()
  ctx.lineWidth = 10
  ctx.strokeStyle = color
  ctx.moveTo(sx, sy)
  ctx.fill()
  ctx.lineTo(ex, ey)
  ctx.closePath()
  ctx.stroke()
}

const drawWholeLine = (
  canvas: HTMLCanvasElement,
  segment: CoordinateType,
  color: string,
  selected_dot?: number | null,
) => {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  drawHorizontalLine(ctx, segment, color)
  const { sx, ex, sy, ey } = segment
  if (Number.isInteger(selected_dot)) {
    // hover this dot by changing color
    Array.from({ length: 2 }).forEach((_, index) => {
      const x = index === 0 ? sx : ex
      const y = index === 0 ? sy : ey
      drawDot({ ctx, x, y, color: index === selected_dot ? 'grey' : color })
    })
  } else {
    drawDot({ ctx, x: sx, y: sy, color })
    drawDot({ ctx, x: ex, y: ey, color })
  }
}

const actualTimeRedLine = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  const time = getCurrentTime()
  let additionalPixels = 0

  if (time.minutes >= 15 && time.minutes < 30) {
    additionalPixels = cellSize
  } else if (time.minutes >= 30 && time.minutes < 45) {
    additionalPixels = cellSize * 2
  } else if (time.minutes >= 45) {
    additionalPixels = cellSize * 3
  }

  const acutalHour = time.hours * hourCellSize + additionalPixels

  ctx.strokeStyle = 'red'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(acutalHour, 0)
  ctx.lineTo(acutalHour, 600)
  ctx.stroke()
}

export const draw_segments = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  segments: CoordinateType[],
  hoveredSegmentIndex: { segment: number; dot: number | null },
  segment_size = 10,
) => {
  const canvas = canvasRef.current as HTMLCanvasElement
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  draw_grid_background(canvasRef, segment_size)

  actualTimeRedLine(canvas)
  setInterval(() => actualTimeRedLine(canvas), 60000)

  for (let s = 0; s < segments.length; s++) {
    const { sy, ey, color } = segments[s]

    let line_color = color ?? 'red'
    const is_selected_segment = sy === ey && s === hoveredSegmentIndex.segment

    // draw dot, line, dot
    drawWholeLine(
      canvas,
      segments[s],
      line_color,
      is_selected_segment ? hoveredSegmentIndex.dot : null,
    )
  }
}
