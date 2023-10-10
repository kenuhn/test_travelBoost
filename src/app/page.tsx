'use client'

import OneCard from '$components/OneCard'
import { OneTag } from '$components/OneTag'
import { TimeHeader } from '$components/TimeHeader'
import { TravelArea } from '$components/TravelArea'
import { useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { cellSize } from '~/constants'
import { transformDataToCoordinates } from '~/tools/common'
import { CoordinateType } from '~/tools/types'
import data from '../data/data.json'

const Home = () => {
  const defaultCards = transformDataToCoordinates(data)

  // const calculate_segments_position = (from: number, to: number) => {
  //   const new_segments = [...cards.map((item: CoordinateType) => ({ ...item }))]
  //   new_segments[from].color = cards[to].color
  //   new_segments[to].color = cards[from].color
  //   setCards(new_segments)
  // }

  const [cards, setCards] = useState(defaultCards)

  const [tags, setTags] = useState([
    { id: 7, text: 'Train', color: '#244690' },
    { id: 8, text: 'Taxi', color: '#098C37' },
    { id: 9, text: 'Bike', color: '#FFD305' },
  ])

  // Managing drag and drop actions for Cards
  const [, dropCards] = useDrop(() => ({
    accept: 'TAG',
    drop: (item: any) => moveTagToCards(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  // Managing drag and drop actions for Tags
  const [, dropTags] = useDrop(() => ({
    accept: 'TAG',
    drop: (item: any) => moveCardToTags(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const moveTagToCards = (id: number) => {
    const tagToMove = tags.find((item) => item.id === id)
    console.info(tagToMove)
    if (!tagToMove) {
      return
    }
    setCards((prevCards: any) => {
      console.info(prevCards)
      const isExist = prevCards.find((item: any) => item.id === id)
      console.info(isExist)
      if (!isExist) {
        return [...prevCards, tagToMove]
      } else {
        return prevCards
      }
    })
    setTags((existingTags) => existingTags.filter((tag) => tag.id !== id))
  }

  const moveCardToTags = (id: number) => {
    const cardToMove = cards.find((item) => item.id === id)
    if (cardToMove) {
      setTags((prevTags: any) => {
        const isExist = prevTags.find((item: any) => item.id === id)
        if (!isExist) {
          return [...prevTags, cardToMove]
        } else {
          return prevTags
        }
      })
      setCards((existingCards) =>
        existingCards.filter((card) => card.id !== id),
      )
    }
  }

  const moveCard = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || !cards[fromIndex] || !cards[toIndex]) {
      return
    }
    const result = cards.reduce(
      (acc, card, index) =>
        index === toIndex
          ? [...acc, cards[fromIndex], card]
          : index === fromIndex
          ? acc
          : [...acc, card],
      [] as CoordinateType[],
    )
    setCards(result)
    console.info({ result })
  }

  const handleTagDelete = (id: number) => {
    const updatedTags = tags.filter((tag) => tag.id !== id)
    setTags(updatedTags)
  }

  return (
    <Container>
      <TopZone>
        <LeftZone>
          <LeftWhiteSpace />
          <CardContainer ref={dropCards}>
            {cards.map((card, index) => (
              <OneCard
                key={card.id}
                id={card.id}
                text={card.text}
                index={index}
                moveCard={moveCard}
                textcolor={card.color}
              />
            ))}
          </CardContainer>
        </LeftZone>
        <RightZone id="right_zone">
          <TimeHeader />
          <TravelArea segments={cards} set_segments={setCards} />
        </RightZone>
      </TopZone>
      <BottomZone>
        <Tags ref={dropTags}>
          {tags.map((oneTag) => (
            <OneTag
              key={oneTag.id}
              id={oneTag.id}
              text={oneTag.text}
              color={oneTag.color}
              onDelete={handleTagDelete}
            />
          ))}
          <button onClick={() => console.info(cards, tags)}>show list</button>
        </Tags>
      </BottomZone>
    </Container>
  )
}

export default Home

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const TopZone = styled.div`
  display: flex;
  flex-direction: row;
`
const BottomZone = styled.div`
  height: 20vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LeftZone = styled.div`
  width: 20%;
  background-color: white;
  height: 80vh;
  @media (min-width: 1100px) {
    width: 10%;
    height: auto;
  }
`
const RightZone = styled.div`
  width: 80%;
  background-color: white;
  height: 80vh;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /*Firefox */
  -ms-overflow-style: none; /*IE/Edge*/
  /* (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 0;
  }
  @media (min-width: 1100px) {
    width: 90%;
  }
`

const LeftWhiteSpace = styled.div`
  height: 85px;
  background-color: white;
  margin-bottom: ${cellSize / 2}px;
`
const CardContainer = styled.div`
  height: auto;
  background-color: white;
`
const Tags = styled.div`
  display: flex;
  background-color: white;
  width: 75vw;
  height: 15vh;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`
