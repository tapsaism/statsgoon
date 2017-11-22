import React from 'react'
import { Grid, Button, Container, Divider } from 'semantic-ui-react'
import { Analytics } from 'aws-amplify'

import TeamSelector from './statsgoonparams/ParamsTeamSelector.js'
import MeasureSelector from './statsgoonparams/ParamsMeasureSelector.js'
import PosSelector from './statsgoonparams/ParamsPositionSelector.js'
import ValueField from './statsgoonparams/ParamsValueField.js'
import PeriodSelector from './statsgoonparams/ParamsPeriodSelector.js'
import Constants from '../Constants.js'

class StatsgoonParams extends React.Component {

  constructor (props) {

    super(props)

    this.state = {
      measures: Constants.measures,
      teamSelectorStatus: 'Loading teams',
      selectedTeams: [],
      selectedMeasure: null,
      selectedGoalie: Constants.positions.goalie,
      selectedDmen: Constants.positions.dmen,
      selectedFwd: Constants.positions.fwd,
      selectedSeason: '',
      paramsTeams: [],
      maxValue: null,

    }
  }

  teamChange = (e, { value }) => this.setState({selectedTeams: value})
  measureChange = (e, { value }) => this.setState({selectedMeasure: value})

  handleChangeGoalie = (value) => this.setState({selectedGoalie: value.value })
  handleChangeDmen = (value) => this.setState({selectedDmen: value.value })
  handleChangeFwd = (value) => this.setState({selectedFwd: value.value })
  seasonChange = (e, {value}) => this.setState({selectedSeason: value })

  valueChange = (event) => this.setState({maxValue: event.target.value})

  runSolver = () => {

    let solverParams = {
          "teams": this.state.selectedTeams,
          "measure":this.state.selectedMeasure,
          "def": this.state.selectedDmen,
          "fwd": this.state.selectedFwd,
          "goalie": this.state.selectedGoalie,
          "value": this.state.maxValue.replace(/\s/g,''),
          "season": this.state.selectedSeason
    }
    this.props.optimize(solverParams)

    Analytics.record('runSolver')

  }

  render() {
    Analytics.record('solver')
    return (
    <Container>
      <Grid columns={6} stackable>
        <Grid.Row>
          <Grid.Column>
            <PeriodSelector
            seasonChange = {this.seasonChange}
            />
          </Grid.Column>
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
              handleChangeGoalie={this.handleChangeGoalie}
              handleChangeDmen={this.handleChangeDmen}
              handleChangeFwd={this.handleChangeFwd}
              goalie = {this.state.selectedGoalie}
              dmen = {this.state.selectedDmen}
              fwd = {this.state.selectedFwd}
            />
          </Grid.Column>
          <Grid.Column>
            <ValueField
              valueChange = {this.valueChange}
            />
          </Grid.Column>
          <Grid.Column>
            <Button fluid basic color='blue' type='submit' onClick={this.runSolver}>Optimize!</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    <Divider hidden />
    </Container>
  )}
}

export default StatsgoonParams
