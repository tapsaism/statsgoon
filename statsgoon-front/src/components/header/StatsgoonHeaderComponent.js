import React from 'react'
import { Container, Header, Divider} from 'semantic-ui-react'

const StatsgoonHeader = () => {

  return (
    <Container>
     <Divider hidden />
      <Container textAlign='left'>
       <Header as='h2'>Statsgoon</Header>
      </Container>
     <Divider />
    </Container>
  )
}

export default StatsgoonHeader
