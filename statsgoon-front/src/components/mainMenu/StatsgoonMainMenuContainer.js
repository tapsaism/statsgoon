import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, Button, Divider} from 'semantic-ui-react'

import * as menuActions from '../../actions/menuActions'

class StatsgoonMainMenuContainer extends React.Component {

 render() {
  return (
    <Container>
    <Button.Group>
      <Button basic onClick={() => this.props.actions.updateSelectedContent('solver')}>Solver</Button>
      <Button basic onClick={() => this.props.actions.updateSelectedContent('schedule')}>Schedule</Button>
      <Button basic onClick={() => this.props.actions.updateSelectedContent('players')}>Choose players</Button>
      <Button basic onClick={() => this.props.actions.updateSelectedContent('top')}>Top players</Button>
      <Button basic onClick={() => this.props.actions.updateSelectedContent('teams')}>Teams</Button>
    </Button.Group>
    <Divider />
    </Container>
 )}
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(menuActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonMainMenuContainer)
