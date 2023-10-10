import { cellSize, hourCellSize, interval } from '~/constants'
import { CoordinateType } from './types'

export const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return { hours, minutes }
}

export const find_covered_segment_index = (
  segments: CoordinateType[],
  offsetX: number,
  offsetY: number,
) => {
  let hoveredIndex = -1

  for (let i = 0; i < segments.length; i++) {
    const { sx, sy, ex, ey } = segments[i]

    const isNearStartDot =
      Math.sqrt(Math.pow(offsetX - sx, 2) + Math.pow(offsetY - sy, 2)) <= 20
    const isNearEndDot =
      Math.sqrt(Math.pow(offsetX - ex, 2) + Math.pow(offsetY - ey, 2)) <= 20

    if (isNearStartDot && isNearEndDot) {
      return { segment: i, dot: -1 }
    }

    if (isNearStartDot) {
      return { segment: i, dot: 0 }
    }

    if (isNearEndDot) {
      return { segment: i, dot: 1 }
    }

    const isWithinXRange =
      offsetX >= Math.min(sx, ex) && offsetX <= Math.max(sx, ex)
    const isWithinYRange =
      offsetY >= Math.min(sy, ey) && offsetY <= Math.max(sy, ey)

    if (isWithinXRange && isWithinYRange) {
      hoveredIndex = i
      break
    }

    if (sx === ex && Math.abs(offsetX - sx) <= 10 && isWithinYRange) {
      hoveredIndex = i
      break
    }
  }

  return { segment: hoveredIndex, dot: null }
}

export const is_vertical_segment = (segment: CoordinateType) => {
  const { sx, ex } = segment
  return sx === ex
}

export const generate_time_sections = (min_separator = 30) => {
  const time_sections = []
  const time = (h: number, m?: number) =>
    `${h.toString().padStart(2, '0')}:${
      m ? m.toString().padStart(2, '0') : '00'
    }`
  for (let hour = 0; hour < 24; hour++) {
    if (min_separator === 0) {
      time_sections.push(time(hour))
    } else {
      for (let minute = 0; minute < 60; minute += min_separator) {
        time_sections.push(time(hour, minute))
      }
    }
  }
  return time_sections
}

type TransformDataToCoordinatesType = (data: object[]) => CoordinateType[]
export const transformDataToCoordinates: TransformDataToCoordinatesType = (
  data,
) => {
  const minutePixelRatio = cellSize / interval //pixels
  const sortedData = data.sort((a, b) => {
    const startTimeA = new Date(a.start_time).getTime()
    const startTimeB = new Date(b.start_time).getTime()
    return startTimeA - startTimeB
  })
  const segmentMode = sortedData.map((item, index) => {
    const startTime = new Date(item.start_time)
    const endTime = new Date(item.end_time)
    const startX =
      startTime.getHours() * hourCellSize +
      startTime.getMinutes() * minutePixelRatio
    const endX =
      endTime.getHours() * hourCellSize +
      endTime.getMinutes() * minutePixelRatio
    const y = (index + 1) * cellSize
    const color = item.color
    const text = item.place
    return {
      id: index,
      text,
      color,
      sx: startX,
      sy: y,
      ex: endX,
      ey: y,
    }
  })
  return segmentMode
}
