import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'

import StatsgoonHeader from '../header/StatsgoonHeaderComponent'
import StatsgoonMenuButtons from '../mainMenu/StatsgoonMainMenuContainer'
import StatsgoonMainComponent from './StatsgoonMainComponent'

class StatsgoonMainContainer extends Component {

  render() {
  return(
    <Container>
      <StatsgoonHeader />
      <StatsgoonMenuButtons />
      <StatsgoonMainComponent
        selectedContent={this.props.menu.selectedContent}
      />
    </Container>
)}
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps)(StatsgoonMainContainer)
