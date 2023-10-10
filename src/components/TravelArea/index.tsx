import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { cellSize } from '~/constants'
import { draw_segments, find_covered_segment_index } from '~/tools'
import { CoordinateType } from '~/tools/types'
import { TravelAreaProps } from './types'

export const TravelArea: FC<TravelAreaProps> = ({ segments, set_segments }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState<{
    segment: number
    dot: number | null
  }>({ segment: -1, dot: null })
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<{
    segment: number
    dot: number | null
  }>({ segment: -1, dot: null })
  const [initialOffset, setInitialOffset] = useState<number>(-1)

  const segment_size = cellSize

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = (
      canvasRef.current as HTMLCanvasElement
    ).getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const new_segments = [
      ...segments.map((item: CoordinateType) => ({ ...item })),
    ]
    const covered = find_covered_segment_index(new_segments, offsetX, offsetY)

    if (hoveredSegmentIndex.segment !== covered.segment) {
      setHoveredSegmentIndex(covered)
    }

    if (selectedSegmentIndex.segment === -1) {
      return
    }

    const roundedOffsetX = Math.round(offsetX / segment_size) * segment_size
    if (initialOffset === -1) {
      setInitialOffset(roundedOffsetX)
    }
    const deltaX =
      roundedOffsetX - new_segments[selectedSegmentIndex.segment].sx

    // if (deltaX % 50 !== 0) {
    //   return
    // }

    const is_first_dot = selectedSegmentIndex.dot === 0

    // updated
    // first dot:
    // can move only to the right
    // but should following prev mode second dot

    // second dot:
    // shouldn't following first dot of next mode

    if (is_first_dot) {
      // const moving_left = roundedOffsetX < initialOffset
      // if (moving_left) {
      //   return
      // }

      if (selectedSegmentIndex.segment - 1 >= 0) {
        // prev line endx follow to the current line startx
        new_segments[selectedSegmentIndex.segment - 1].ex = roundedOffsetX
        for (let i = 0; i < new_segments.length; i++) {
          new_segments[i].sx += deltaX
          new_segments[i].ex += deltaX
        }
      }
    } else {
      new_segments[selectedSegmentIndex.segment].ex = roundedOffsetX
      for (
        let i = selectedSegmentIndex.segment + 1;
        i < new_segments.length;
        i++
      ) {
        if (segments[i].sx === segments[i - 1].ex) {
          new_segments[i].sx = new_segments[i - 1].ex
          new_segments[i].ex =
            new_segments[i - 1].ex + (segments[i].ex - segments[i].sx)
        }
      }
    }

    set_segments(new_segments)
  }

  const handleMouseLeave = () => {
    // console.info('MOUSE LEAVE')
    setHoveredSegmentIndex({ segment: -1, dot: null })
  }

  const handleMouseUp = () => {
    // console.info('MOUSE UP')
    setSelectedSegmentIndex({ segment: -1, dot: null })
    setInitialOffset(-1)
  }

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (hoveredSegmentIndex.segment === -1) {
      return
    }

    const rect = (
      canvasRef.current as HTMLCanvasElement
    ).getBoundingClientRect()

    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    setSelectedSegmentIndex(
      find_covered_segment_index(segments, offsetX, offsetY),
    )
  }

  const canvasScroll = () => {
    const right_zone = document.getElementById('right_zone')
    if (right_zone) {
      right_zone.scrollTo(2000, 0)
    }
  }

  useEffect(canvasScroll, [])

  useEffect(() => {
    // console.info('===== REDRAWWING =====')
    draw_segments(canvasRef, segments, hoveredSegmentIndex, segment_size)
  }, [hoveredSegmentIndex, segments])

  return (
    <canvas
      ref={canvasRef}
      width={5700}
      height={600}
      style={{ marginLeft: '15px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    />
  )
}
