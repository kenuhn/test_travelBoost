export interface OneCardProps {
  id: number
  text: string
  index: number
  moveCard: (fromIndex: number, toIndex: number) => void
  textcolor: string
}
