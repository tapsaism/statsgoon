import React from 'react'
import { Container, Button, Divider} from 'semantic-ui-react'

class StatsgoonMenuButtons extends React.Component {

  handleClick = (value) => {
    this.props.setVisibleContent(value)
  }

  render() {
  return (
    <Container>
    <Button.Group>
      <Button basic onClick={() => this.handleClick('solver')}>Solver</Button>
      <Button basic onClick={() => this.handleClick('schedule')}>Schedule</Button>
      <Button basic onClick={() => this.handleClick('players')}>Choose players</Button>
      <Button basic onClick={() => this.handleClick('top')}>Top players</Button>
      <Button basic onClick={() => this.handleClick('teams')}>Teams</Button>
    </Button.Group>
    <Divider />
    </Container>
  )}
}

export default StatsgoonMenuButtons
