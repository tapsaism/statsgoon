import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import * as scheduleActions from '../../actions/scheduleActions'
import StatsgoonScheduleTodayComponent from './StatsgoonScheduleTodayComponent'

class StatsgoonScheduleTodayContainer extends React.Component {

  componentDidMount () {
    if (this.props.schedule.scheduleToday.length === 0) {
      this.props.actions.loadScheduleToday()
    }
  }

  render = () => {
    Analytics.record('schedule_today')
    return (
      <Container>
        <StatsgoonScheduleTodayComponent
          status={this.props.schedule.scheduleLoading}
          scheduleToday={this.props.schedule.scheduleToday}
        />
      </Container>
    )
  }

}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(scheduleActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonScheduleTodayContainer)
