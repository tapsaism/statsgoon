import React from 'react'
import { Table, Loader, Container, Divider } from 'semantic-ui-react'
import Slider, { Handle } from 'rc-slider'
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import { Analytics } from 'aws-amplify'


import Constants from '../Constants.js'
import Utils from '../utils/StatsgoonUtils'
import Actions from '../StatsgoonActions'


export default class StatsgoonSchedule extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      scheduleData : [],
      teams : [],
      loaderStatus: 'active'
    }
  }

  componentDidMount () {

    if (this.state.scheduleData.length === 0)
      this.loadSchedule()
  }

  loadSchedule = () => {

    Actions.getDefaultSchedule()
      .then((response) =>  {
        this.setState({scheduleData: response.data, loaderStatus: 'disabled'})
        this.getTableData(response.data,this.getTeams(response.data))
      })
      .catch((error) => error)
  }

  getDates = (data) => {

    let dates = [...new Set(data.map(game => game.date))];

    return dates.map(date => <Table.HeaderCell singleLine={true} width={1} key={date}>{date.substr(8,2)}</Table.HeaderCell>)
  }

  getTableHeader = (data) => {
      return (
        <Table.Row>
          <Table.HeaderCell key='team_header'>Team</Table.HeaderCell>
          <Table.HeaderCell key='game_header'>Games</Table.HeaderCell>
          {this.getDates(data)}
        </Table.Row>
      )
  }

  getTableRows = (scheduleData) => {

    let teams = [...new Set(scheduleData.map(game => game.team_acrm))];

    return(
      teams.map(team => {

        let teamData = scheduleData.filter(game => game.team_acrm === team)

        return (
          <Table.Row key={team}>
          <Table.Cell warning={true}>{team}</Table.Cell>
          <Table.Cell warning={true}>{teamData[0].games_total}</Table.Cell>
          {teamData.map(game => <Table.Cell key={game.date + game.team + game.opponent} negative={game.awaygame === 1 ? true : false} positive={game.homegame === 1 ? true : false}>{game.opponent_acrm}</Table.Cell>)}
          </Table.Row>
        )
      })
    )
  }

  getFidgetSpinner = () => <Loader className={this.state.loaderStatus} content='Loading schedule'/>

  getSchedule = () => {
    return (
    <div style={{overflowX: 'auto'}}>
    <Table size='small' unstackable selectable>
      <Table.Header>
        {this.getTableHeader(this.state.scheduleData)}
      </Table.Header>
      <Table.Body>
        {this.getTableRows(this.state.scheduleData)}
      </Table.Body>
    </Table>
    </div>
    )
  }

  updateSchedule = (value) => {

    this.setState({loaderStatus: 'active'})

    let params = {
      filter: [
        Utils.addDays(value[0]),
        Utils.addDays(value[1])
      ]
    }

    Actions.getScheduleWithParams(params)
    .then(response =>  {
      this.setState({scheduleData: response.data, loaderStatus: 'disabled'})
      this.getTableData(response.data,this.getTeams(response.data))
    })
    .catch(error => {
      console.log(error)
    })
  }

  createSliderWithTooltip = Slider.createSliderWithTooltip
  Range = this.createSliderWithTooltip(Slider.Range)
  Handle = Slider.Handle

  handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={Utils.addDays(value)}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  )
 }

  marks = {

  }

  showParams = () => {
    return (
      <div>
        <this.Range
          step={1}
          min={1}
          max={185}
          marks={Constants.marks}
          defaultValue={[Utils.dateDiff(new Date('2017-10-04'), new Date()), Utils.periodEnd()]}
          onAfterChange = {this.updateSchedule}
          handle={this.handle}
          tipFormatter={value => Utils.addDays(value)}
        />
      </div>
    )
  }

  showContent = () => this.state.loaderStatus === 'disabled' ? this.getSchedule() : this.getFidgetSpinner()

  render = () => {
    Analytics.record('schedule')
    return (
      <Container>
      <Container> {this.showParams()} </Container>
      <Divider hidden/>
      <Divider />
      <Container> {this.showContent()} </Container>
      </Container>
    )
  }

}
