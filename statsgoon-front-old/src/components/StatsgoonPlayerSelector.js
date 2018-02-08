import React from 'react'
import Axios from 'axios'
import { Button, Grid, Dropdown, Container, Divider } from 'semantic-ui-react'
import { Analytics } from 'aws-amplify'

import Constants from '../Constants.js'
import Utils from '../utils/StatsgoonUtils.js'

export default class StatsgoonPlayerSelector extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      goalies: [{key: 'Clear selection', text: 'Clear selection', value: 'Clear selection'}],
      dmen: [{key: 'Clear selection', text: 'Clear selection', value: 'Clear selection'}],
      forwards: [{key: 'Clear selection', text: 'Clear selection', value: 'Clear selection'}],
      selectedGoalies: [],
      selectedDmen: [],
      selectedForwards: [],
      loading: true
    }
  }

  componentDidMount () {
    this.loadPlayers()
  }

  goalieChange = (e, { value }) => {
    if (value[value.length-1] === 'Clear selection')
      this.setState({selectedGoalies: []})
    else {
      this.setState({selectedGoalies: value})
    }

  }

  dmenChange = (e, { value }) => {
    if (value[value.length-1] === 'Clear selection')
      this.setState({selectedDmen: []})
    else {
      this.setState({selectedDmen: value})
    }

  }
  forwardChange = (e, { value }) => {
    if (value[value.length-1] === 'Clear selection')
      this.setState({selectedForwards: []})
    else {
      this.setState({selectedForwards: value})
    }

  }

  getDropdownElement = (player) => ({key: player.team +'-'+ player.name, text: player.team +'-'+ player.name, value: player.name})

  getPlayersByPosition = (data, position) => data.filter(player => player.position === position).map(player => this.getDropdownElement(player))

  loadPlayers = () => {

    Axios.get(Constants.dataApiUrl+'player/all-players')
      .then((response) =>  {
        this.setState({
          goalies: this.state.goalies.concat(this.getPlayersByPosition(response.data,'GOA').sort(Utils.dynamicSort('text'))),
          dmen: this.state.dmen.concat(this.getPlayersByPosition(response.data,'DEF').sort(Utils.dynamicSort('text'))),
          forwards: this.state.forwards.concat(this.getPlayersByPosition(response.data,'FWD').sort(Utils.dynamicSort('text'))),
          loading: false
        })
      })
      .catch((error) => error);

  }

  getPlayerStats = () => {

    let params = {
      filter : [
        this.state.selectedGoalies.concat(this.state.selectedDmen).concat(this.state.selectedForwards),
        '2017-2018'
        ]
    }

    this.props.getCharts(params)

  }

  render () {
    Analytics.record('playerSelect')
    return(
     <Container>
       <Grid columns={4} stackable>
         <Grid.Row>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
              value = {this.state.selectedGoalies}
              loading={this.state.loading}
              placeholder='Goalie'
              onChange={this.goalieChange}
              fluid selection options={this.state.goalies} />
           </Grid.Column>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
              value = {this.state.selectedDmen}
              loading={this.state.loading}
              placeholder='Defense'
              onChange={this.dmenChange}
              fluid selection options={this.state.dmen} />
           </Grid.Column>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
              value = {this.state.selectedForwards}
              loading={this.state.loading}
              placeholder='Forward'
              onChange={this.forwardChange}
              fluid selection options={this.state.forwards} />
           </Grid.Column>
           <Grid.Column>
           <Button fluid basic color='blue' type='submit' onClick={this.getPlayerStats}>Get stats!</Button>
           </Grid.Column>
         </Grid.Row>
        </Grid>
      <Divider hidden />
     </Container>
  )
  }
}
