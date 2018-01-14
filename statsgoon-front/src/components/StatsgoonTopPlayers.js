import React from 'react'
import { Loader, Container, Header, Divider, Grid, Button } from 'semantic-ui-react'
import Axios from 'axios'
import { Analytics } from 'aws-amplify'

import Constants from '../Constants.js'
import Actions from '../StatsgoonActions'
import Table from './viz/StatsgoonTopPlayersTable'
import TeamSelector from './statsgoonparams/ParamsTeamSelector.js'

export default class StatsgoonTopPlayers extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      topAllPos: [],
      topGoalies: [],
      topDmen: [],
      topFwd: [],
      selectedTeams: ['all'],
      loaderStatus: 'disabled',
      loaderContent: 'Loading top players'
    }
  }

  componentDidMount () {
    this.loadTopLists()
  }

  getFilter = (season,position,teams) => ({filter: [season,position,teams]})

  loadTopLists = () => {

    this.setState({loaderStatus: 'active'})

    let teams = this.state.selectedTeams[0] === 'all' ? Constants.teams : this.state.selectedTeams

    let paramsArray = [
      this.getFilter("2017-2018",["GOA","DEF","FWD"],teams),
      this.getFilter("2017-2018",["GOA"],teams),
      this.getFilter("2017-2018",["DEF"],teams),
      this.getFilter("2017-2018",["FWD"],teams)
    ]

    Actions.getTopPlayersAll(paramsArray)
      .then(Axios.spread((all,goalie,dmen,fwd) =>  {
        this.setState({topAllPos: all.data, topGoalies: goalie.data, topDmen: dmen.data, topFwd: fwd.data})
        this.setState({loaderStatus: 'disabled'})
      }))
      .catch((error) => error)
  }

  teamChange = (e, { value }) => this.setState({selectedTeams: value})

  createTables = () => {
    return (
      <Container>
        <Header as='h5'>All positions</Header>
        <Table chartData={this.state.topAllPos}/>
        <Header as='h5'>Goalies</Header>
        <Table chartData={this.state.topGoalies}/>
        <Header as='h5'>Defensemen</Header>
        <Table chartData={this.state.topDmen}/>
        <Header as='h5'>Forwards</Header>
        <Table chartData={this.state.topFwd}/>
      </Container>
    )
  }

  refreshList = () => {
    this.loadTopLists()
  }

  getFidgetSpinner = () => <Container><Loader className={this.state.loaderStatus} content={this.state.loaderContent}/></Container>

  showContent = () => this.state.loaderStatus === 'disabled' ? this.createTables() : this.getFidgetSpinner()

  render = () => {
    Analytics.record('topPlayers')
    return (
      <Container>
        <Container>
        <Grid columns={10}>
          <Grid.Row>
            <Grid.Column width={14}>
              <TeamSelector teamChange={this.teamChange} />
            </Grid.Column>
            <Grid.Column width={2}>
              <Button fluid basic color='blue' type='submit' onClick={this.loadTopLists}>Toppen!</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Container>
          <Divider />
        <Container> {this.showContent()} </Container>
      </Container>
    )
  }

}
