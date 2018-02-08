import React from 'react'
import { Table, Loader } from 'semantic-ui-react'

import StatsgoonSchedule from './StatsgoonSchedule'

const StatsgoonScheduleComponent = (props) => {

  if (props.status === 'active') {
    return <Loader className={props.status} content='Loading schedule'/>
  }

  return (
    <div style={{overflowX: 'auto'}}>
    <Table size='small' unstackable selectable>
      <Table.Header>
        {StatsgoonSchedule.getTableHeader(props.schedule)}
      </Table.Header>
      <Table.Body>
        {StatsgoonSchedule.getTableRows(props.schedule)}
      </Table.Body>
    </Table>
    </div>
  )

}

export default StatsgoonScheduleComponent
