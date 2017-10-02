import React from 'react'
import Axios from 'axios'
import Constants from '../Constants.js'
import { Dropdown } from 'semantic-ui-react'

class StatsgoonParamsTeamSelector extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      status : 'Loading Teams',
      teamList : []
    }
  }

  componentDidMount () {

    this.loadTeamSelector()

  }

  loadTeamSelector = () => {

    Axios.get(Constants.getConstants('dataApiUrl')+'team/games-left')
      .then((response) =>  {
        let teams = response.data.map(data => ({key: data.team, text: data.team + ' - ' + data.games, value: data.team}))
        this.setState({status: 'Teams'})
        this.setState({teamList: teams})
      })
      .catch((error) => error);
  }

  render() {
    return (
      <Dropdown placeholder={this.state.status} onChange={this.props.teamChange} fluid selection multiple options={this.state.teamList} />
    )
  }
}

export default StatsgoonParamsTeamSelector
