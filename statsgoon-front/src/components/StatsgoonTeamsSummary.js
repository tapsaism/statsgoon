import React from 'react'
import { Loader, Container, Header } from 'semantic-ui-react'
import Axios from 'axios'
import { Analytics } from 'aws-amplify'

import Constants from '../Constants.js'
import Actions from '../StatsgoonActions'
import Table from './viz/StatsgoonTeamsPointsTable'

export default class StatsgoonTeamsSummary extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      topAllPos: [],
      topGoalies: [],
      topDmen: [],
      topFwd:[],
      loaderStatus: 'disabled',
      loaderContent: 'Loading team stats'
    }
  }

  componentDidMount () {
    this.loadTopLists()
  }

  getFilter = (season,position,teams) => ({filter: [season,position,teams]})

  loadTopLists = () => {

    this.setState({loaderStatus: 'active'})

    let paramsArray = [
      this.getFilter("2017-2018",["GOA","DEF","FWD"]),
      this.getFilter("2017-2018",["GOA"]),
      this.getFilter("2017-2018",["DEF"]),
      this.getFilter("2017-2018",["FWD"])
    ]

    Actions.getPointsByTeamAll(paramsArray)
      .then(Axios.spread((all,goalie,dmen,fwd) =>  {
        this.setState({topAllPos: all.data, topGoalies: goalie.data, topDmen: dmen.data, topFwd: fwd.data})
        this.setState({loaderStatus: 'disabled'})
      }))
      .catch((error) => error)
  }

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

  getFidgetSpinner = () => <Container><Loader className={this.state.loaderStatus} content={this.state.loaderContent}/></Container>

  showContent = () => this.state.loaderStatus === 'disabled' ? this.createTables() : this.getFidgetSpinner()

  render = () => {
    Analytics.record('teamPoints')
    return (
      <Container>
      {this.showContent()}
      </Container>
    )
  }

}
