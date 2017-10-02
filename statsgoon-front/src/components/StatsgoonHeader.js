import React from 'react'
import { Container, Header, Divider} from 'semantic-ui-react'

class StatsgoonHeader extends React.Component {

  render() {
  return (
    <div>
    <Divider />
    <Container textAlign='center'>
    <Header as='h2'>Statsgoon</Header>
    <Container text>- Optimize your team -</Container>
    </Container>
    <Divider />
    </div>
  )}
}

export default StatsgoonHeader
