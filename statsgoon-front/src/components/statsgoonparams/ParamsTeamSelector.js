import React from 'react'
import Actions from '../../StatsgoonActions'
import Utils from '../../utils/StatsgoonUtils'
import { Dropdown } from 'semantic-ui-react'

export default class StatsgoonParamsTeamSelector extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      teamList: [],
      loading: true
    }
  }

  componentDidMount () {

    Actions.getTeams()
      .then((response) =>  {
        this.setState({
          teamList: Utils.parseTeams(response.data),
          loading: false
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }

  render() {
    return (
      <Dropdown
        loading = {this.state.loading}
        placeholder='Teams'
        onChange={this.props.teamChange}
        fluid selection multiple options={this.state.teamList} />
    )
  }
}
