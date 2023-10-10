import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { MdDragIndicator } from 'react-icons/md'
import styled from 'styled-components'
import { cellSize } from '~/constants'
import { OneCardProps } from './types'

export default function OneCard({
  id,
  text,
  index,
  moveCard,
  textcolor,
}: OneCardProps) {
  const [toIndex, setToIndex] = useState(0)
  const [, ref] = useDrag({
    type: 'TAG',
    item: { id, index },
  })

  const [, drop] = useDrop({
    accept: 'TAG',
    hover: () => {
      setToIndex(index)
    },
    drop: (item: any) => moveCard(item.index, toIndex),
  })

  return (
    <Card ref={(node) => ref(drop(node))}>
      <MdDragIndicator size={26} color="gray" />
      <Title color={textcolor}>{text}</Title>
    </Card>
  )
}

const Card = styled.div`
  height: ${cellSize}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`
const Title = styled.div`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: 18px;
  display: flex;
  text-align: right;
`
