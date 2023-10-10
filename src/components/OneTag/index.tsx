import { FC } from 'react'
import { useDrag } from 'react-dnd'
import { RxCross2 } from 'react-icons/rx'
import styled from 'styled-components'
import { OneTagPropsType } from './types'

export const OneTag: FC<OneTagPropsType> = ({ id, text, color, onDelete }) => {
  const [, drag] = useDrag(() => ({
    type: 'TAG',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const handleDeleteClick = () => {
    onDelete(id) // Appel de la fonction onDelete avec l'ID du tag
  }

  return (
    <>
      <TagContainer ref={drag} color={color}>
        <TextTag>{text}</TextTag>
        <DeleteButton onClick={handleDeleteClick}>
          <RxCross2 />
        </DeleteButton>
      </TagContainer>
    </>
  )
}

const TagContainer = styled.div`
  color: white;
  background-color: ${(props) => props.color};
  font-size: 16px;
  min-width: 50px;
  height: 25px;
  padding: 5px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`

const DeleteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
  margin-left: 5px;
  padding: 5px;
  cursor: pointer;
`

const TextTag = styled.p`
  padding-left: 10px;
`
