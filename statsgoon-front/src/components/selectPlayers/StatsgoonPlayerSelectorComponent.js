import React from 'react'
import { Button, Grid, Dropdown, Container, Divider } from 'semantic-ui-react'

const StatsgoonPlayerSelectComponent = (props) => {
  return(
   <Container>
     <Grid columns={4} stackable>
       <Grid.Row>
         <Grid.Column>
          <Dropdown
            search={true}
            multiple={true}
            value = {props.selectedGoalies}
            loading={props.loading}
            placeholder='Goalie'
            onChange={props.goalieChange}
            fluid selection options={props.goalies} />
         </Grid.Column>
         <Grid.Column>
          <Dropdown
            search={true}
            multiple={true}
            value = {props.selectedDmen}
            loading={props.loading}
            placeholder='Defense'
            onChange={props.dmenChange}
            fluid selection options={props.dmen} />
         </Grid.Column>
         <Grid.Column>
          <Dropdown
            search={true}
            multiple={true}
            value = {props.selectedForwards}
            loading={props.loading}
            placeholder='Forward'
            onChange={props.forwardChange}
            fluid selection options={props.forwards} />
         </Grid.Column>
         <Grid.Column>
         <Button fluid basic color='blue' type='submit' onClick={props.getPlayerStats}>Get stats!</Button>
         </Grid.Column>
       </Grid.Row>
      </Grid>
    <Divider hidden />
   </Container>
)
}

export default StatsgoonPlayerSelectComponent
