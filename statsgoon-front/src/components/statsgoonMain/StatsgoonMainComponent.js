import React from 'react';

import StatsgoonSolver from '../solver/StatsgoonSolverContainer'
import StatsgoonSchedule from '../schedule/StatsgoonScheduleContainer'
import StatsgoonPlayerSelector from '../selectPlayers/StatsgoonPlayerSelectorContainer'
import StatsgoonTopPlayers from '../topPlayers/StatsgoonTopPlayersContainer'
import StatsgoonTeamsSummary from '../teamsSummary/StatsgoonTeamsSummaryContainer'

const StatsgoonMainComponent = (props) => {

  switch(props.selectedContent) {
    case 'solver':
      return <StatsgoonSolver />
    case 'schedule':
      return <StatsgoonSchedule />
    case 'players':
      return <StatsgoonPlayerSelector />
    case 'top':
      return <StatsgoonTopPlayers />
    case 'teams':
      return <StatsgoonTeamsSummary />
    default:
      return <StatsgoonSolver />
  }

}

export default StatsgoonMainComponent
