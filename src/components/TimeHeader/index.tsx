import { styled } from 'styled-components'
import { time_stamps } from '~/constants'

export const TimeHeader = () => (
  <MainContainer>
    {time_stamps.time.map((hour, index) => (
      <TimeContainer key={index}>
        <Hour>{hour}</Hour>
        <Minute>15</Minute>
        <Minute>30</Minute>
        <Minute>45</Minute>
      </TimeContainer>
    ))}
  </MainContainer>
)

const MainContainer = styled.div`
  height: 85px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`

const TimeContainer = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-right: 40px;
  margin-bottom: 5px;
`

const Hour = styled.p`
  font-weight: bold;
  font-size: 16px;
`

const Minute = styled.p`
  font-size: 12px;
`
