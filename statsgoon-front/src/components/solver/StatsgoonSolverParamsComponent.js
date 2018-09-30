import React from 'react'
import { Grid, Button, Container, Divider } from 'semantic-ui-react'

import TeamSelector from '../params/ParamsTeamSelector.js'
import MeasureSelector from '../params/ParamsMeasureSelector.js'
import PosSelector from '../params/ParamsPositionSelector.js'
import ValueField from '../params/ParamsValueField.js'
import SeasonSelector from '../params/ParamsSeasonSelector.js'
import ExcludeField from '../params/ParamsExcludePlayerField.js'

const StatsgoonSolverParamsComponent = (props) => {
  return (
    <Container>
      <Grid columns={8} stackable>
        <Grid.Row>
          <Grid.Column width={2}>
            <SeasonSelector/>
          </Grid.Column>
          <Grid.Column width={3}>
            <TeamSelector />
          </Grid.Column>
          <Grid.Column width={2}>
            <MeasureSelector />
          </Grid.Column>
          <Grid.Column width={2}>
            <PosSelector />
          </Grid.Column>
          <Grid.Column width={2}>
            <ValueField />
          </Grid.Column>
          <Grid.Column width={3}>
            <ExcludeField />
          </Grid.Column>
          <Grid.Column width={2}>
            <Button fluid basic color='blue' type='submit' onClick={props.runSolver}>Optimize!</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    <Divider hidden />
    </Container>
  )
}

export default StatsgoonSolverParamsComponent
