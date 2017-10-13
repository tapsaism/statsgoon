import React from 'react'
import Axios from 'axios'
import { Button, Grid, Dropdown, Container, Divider } from 'semantic-ui-react'

import Constants from '../Constants.js'
import Utils from '../utils/StatsgoonUtils.js'

class StatsgoonPlayerSelector extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      goalies: [],
      dmen: [],
      forwards: [],
      selectedGoalies: [],
      selectedDmen: [],
      selectedForwards: [],
      loading: true
    }
  }

  componentDidMount () {
    this.loadPlayers()
  }

  goalieChange = (e, { value }) => this.setState({selectedGoalies: value})
  dmenChange = (e, { value }) => this.setState({selectedDmen: value})
  forwardChange = (e, { value }) => this.setState({selectedForwards: value})

  getDropdownElement = (player) => ({key: player.name, text: player.team +'-'+ player.name, value: player.name})

  getPlayersByPosition = (data, position) => data.filter(player => player.position === position).map(player => this.getDropdownElement(player))

  loadPlayers = () => {

    Axios.get(Constants.getConstants('dataApiUrl')+'player/all-players')
      .then((response) =>  {
        this.setState({
          goalies: this.getPlayersByPosition(response.data,'GOA').sort(Utils.dynamicSort('text')),
          dmen: this.getPlayersByPosition(response.data,'DEF').sort(Utils.dynamicSort('text')),
          forwards: this.getPlayersByPosition(response.data,'FWD').sort(Utils.dynamicSort('text')),
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

    this.props.drawCharts(params)

  }

  render () {
    return(
     <Container>
       <Grid columns={4} stackable>
         <Grid.Row>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
              loading={this.state.loading}
              placeholder='Goalie'
              onChange={this.goalieChange}
              fluid selection options={this.state.goalies} />
           </Grid.Column>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
              loading={this.state.loading}
              placeholder='Defense'
              onChange={this.dmenChange}
              fluid selection options={this.state.dmen} />
           </Grid.Column>
           <Grid.Column>
            <Dropdown
              search={true}
              multiple={true}
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

export default StatsgoonPlayerSelector
