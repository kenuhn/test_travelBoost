export interface OneTagPropsType {
  id: number
  text: string
  color: string
  onDelete: (id: number) => void
}
