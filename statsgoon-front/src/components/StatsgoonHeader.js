import React from 'react'
import { Container, Header, Divider} from 'semantic-ui-react'

class StatsgoonHeader extends React.Component {

  render() {
  return (
    <div>
    <Divider hidden />
    <Container textAlign='center'>
    <Header as='h2'>Statsgoon</Header>
    <Container text>- Optimize your team -</Container>
    </Container>
    <Divider hidden />
    </div>
  )}
}

export default StatsgoonHeader
