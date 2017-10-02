import React from 'react'
import { Grid, Button } from 'semantic-ui-react'
import Axios from 'axios'

import Constants from './Constants.js'
import TeamSelector from './statsgoonparams/ParamsTeamSelector.js'
import MeasureSelector from './statsgoonparams/ParamsMeasureSelector.js'
import PosSelector from './statsgoonparams/ParamsPositionSelector.js'
import ValueField from './statsgoonparams/ParamsValueField.js'
import PeriodSelector from './statsgoonparams/ParamsPeriodSelector.js'


class StatsgoonParams extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      measures: Constants.getConstants('measures'),
      teamSelectorStatus: 'Loading teams',
      selectedTeams: [],
      selectedMeasure: null,
      selectedGoalie: Constants.getConstants('positions').goalie,
      selectedDmen: Constants.getConstants('positions').dmen,
      selectedFwd: Constants.getConstants('positions').fwd,
      selectedPeriod: 'alltime',
      paramsTeams: [],
      maxValue: null,

    }
  }

  teamChange = (e, { value }) => this.setState({selectedTeams: value})
  measureChange = (e, { value }) => this.setState({selectedMeasure: value})

  handleChangeGoalies = (e, { value }) => {this.setState({selectedGoalie: value })}
  handleChangeDmen = (e, { value }) => this.setState({selectedDmen: value })
  handleChangeFwd = (e, { value }) => this.setState({selectedFwd: value })
  handleStatPeriodChange = (e, { value }) => this.setState({selectedPeriod: value })

  valueChange = (event) => {this.setState({maxValue: event.target.value})}

  dailyStats = (params) => Axios.post(Constants.getConstants('dataApiUrl')+'player/daily-stats',params)
  latestStats = (params) => Axios.post(Constants.getConstants('dataApiUrl')+'player/all-stats',params)
  gamesLeft = (params) => Axios.post(Constants.getConstants('dataApiUrl')+'player/games-left',params)

  optimize = () => {

    this.props.loaderStatusUpdate('active','Running solver')

    let solverParams = {
          "teams": this.state.selectedTeams,
          "measure":this.state.selectedMeasure,
          "def": this.state.selectedDmen,
          "fwd": this.state.selectedFwd,
          "goalie": this.state.selectedGoalie,
          "value": this.state.maxValue
        }

    Axios.post(Constants.getConstants('solverApiUrl'),solverParams)
    .then(response =>  {
      let players = Object.keys(response.data).map((key, index) => response.data[key] === 1 ? key : '')

      let params = { filter : players.filter(player => player !== '') }

      this.props.loaderStatusUpdate('active','Drawing charts')

      Axios.all([this.dailyStats(params), this.latestStats(params), this.gamesLeft(params)])
      .then(Axios.spread((daily,latest,games) => {
        let dataset = {'dailyStats': daily.data, 'latestStats': latest.data, 'gamesLeft': games.data}
        this.props.chartDataUpdate(dataset)
        this.props.loaderStatusUpdate('disabled')
      }))
      .catch(error =>{
        this.props.loaderStatusUpdate('disabled')
      })

    })
    .catch(error => error)
  }

  render() {
    return (
    <Grid columns={6} stackable>
      <Grid.Row>
        <Grid.Column>
          <TeamSelector
            teamChange={this.teamChange}
          />
        </Grid.Column>
        <Grid.Column>
          <MeasureSelector
            measures={this.state.measures}
            measureChange={this.measureChange}
          />
        </Grid.Column>
        <Grid.Column>
          <PosSelector
            handleChangeGoalies={this.handleChangeGoalies}
            handleChangeDmen={this.handleChangeDmen}
            handleChangeFwd={this.handleChangeFwd}
            goalie = {this.state.selectedGoalie}
            dmen = {this.state.selectedDmen}
            fwd = {this.state.selectedFwd}
          />
        </Grid.Column>
        <Grid.Column>
          <PeriodSelector
          statPeriod = {this.state.selectedPeriod}
          handleStatPeriodChange = {this.handleStatPeriodChange}
          />
        </Grid.Column>
        <Grid.Column>
          <ValueField
            valueChange = {this.valueChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Button fluid basic color='blue' type='submit' onClick={this.optimize}>Optimize!</Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )}
}

export default StatsgoonParams
