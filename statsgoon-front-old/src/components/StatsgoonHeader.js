import React from 'react'
import { Container, Header, Divider} from 'semantic-ui-react'

 export default class StatsgoonHeader extends React.Component {

  render() {
  return (
    <div>
    <Divider hidden />
    <Container textAlign='left'>
    <Header as='h2'>Statsgoon</Header>
    </Container>
    <Divider />
    </div>
  )}
}
