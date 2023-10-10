import { CoordinateType } from '~/tools/types'

export interface TravelAreaProps {
  segments: CoordinateType[]
  set_segments: (segments: CoordinateType[]) => void
}
