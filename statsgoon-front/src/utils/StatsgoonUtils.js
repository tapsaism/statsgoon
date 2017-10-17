
const parseDate = (date) => {
  let str = String(date)
  let y = str.substr(0,4),
      m = str.substr(4,2),
      d = str.substr(6,2)
  return new Date(y,m,d)
}

const dynamicSort = (property) => {
  let sortOrder = 1;
  if(property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a,b) => {
    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

const arrayMaxValue = (array,measure) => {
  return Math.max.apply(Math,array.map(stat => stat[measure]))
}

const parsePlayers = (solverData) => {
  let players = Object.keys(solverData).map((key, index) => parseInt(solverData[key],10) === 1 ? key : '')
  return players.filter(player => player !== '')
}

const parseTeams = (teamData) => teamData.map(data => ({key: data.team, text: data.team + ' - ' + data.games, value: data.team}))

export default {
  parseDate,
  dynamicSort,
  parsePlayers,
  parseTeams,
  arrayMaxValue
}
