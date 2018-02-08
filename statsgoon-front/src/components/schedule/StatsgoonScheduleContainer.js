import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import * as scheduleActions from '../../actions/scheduleActions'
import StatsgoonScheduleComponent from './StatsgoonScheduleComponent'
import StatsgoonScheduleParamsComponent from './StatsgoonScheduleParamsComponent'

class StatsgoonScheduleContainer extends React.Component {

  componentDidMount () {

    if (this.props.schedule.teamSchedules.length === 0)
      this.props.actions.loadSchedule()
  }

  render = () => {
    Analytics.record('schedule')
    return (
      <Container>
      <Divider hidden/>
        <StatsgoonScheduleParamsComponent
          updateSchedule={this.props.actions.loadScheduleWithParams}
          rangeDefaultValue={this.props.schedule.rangeDefaultValue}
        />
      <Divider />
      <Container>
        <StatsgoonScheduleComponent
          status={this.props.schedule.scheduleLoading}
          schedule={this.props.schedule.teamSchedules}
        />
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonScheduleContainer)
