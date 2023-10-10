import { styled } from 'styled-components'
import { time_stamps } from '~/constants'

export const AreaHeader = () => (
  <TableHeader>
    {time_stamps.by_thirty_mins.map((time, index) => (
      <HeaderText key={index}>{time}</HeaderText>
    ))}
  </TableHeader>
)

const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid black;
  padding: 10px 0;
`

const HeaderText = styled.div`
  text-align: center;
  border-right: 1px solid gray;
  font-size: 13px;
  padding: 0 2px;
`
