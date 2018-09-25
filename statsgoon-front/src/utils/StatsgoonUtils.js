
const parseDate = (date) => {
  let str = String(date)
  let strArr = [str.substr(0,4), str.substr(4,2),str.substr(6,2)]
  return new Date(strArr.join('-'))
}

const formatDt = (dt) => {

  let year = dt.getFullYear()
  let month = '' + (dt.getMonth()+1)
  let day = '' + dt.getDate()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')

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

const parseTeams = (teamData) => {
  let teams = teamData.map(data => {
    let desc = data.team.concat(' - ', data.games,' - ', data.home_games, ' - ', data.away_games)
    return {key: data.team, text: desc, value: data.team}
  })
  teams.unshift({key: 'all', text: 'All teams', value: 'all'})
  return teams
}

const addDays = (days) => {
  let dat = new Date('2018-10-04')

  dat.setDate(dat.getDate() + days)

  return formatDt(dat)
}

const dateDiff = (firstDate, secondDate) => {
  return Math.round((secondDate-firstDate)/(1000*60*60*24));
}

const periodEnd = () => {
  if(new Date() <= new Date('2018-10-28')) return 24
  if(new Date() <= new Date('2018-12-09')) return 66
  if(new Date() <= new Date('2019-01-23')) return 111
  if(new Date() <= new Date('2019-03-03')) return 150
  if(new Date() <= new Date('2019-04-06')) return 184
  if(new Date() <= new Date('2019-06-30')) return 240
}

const getPlayerDropdownElement = (player) => ({key: player.team +'-'+ player.name, text: player.team +'-'+ player.name, value: player.name})

const parsePlayerData = (playerData, position) => {
  return playerData
          .filter(player => player.position === position)
          .map(player => getPlayerDropdownElement(player))
          .sort(dynamicSort('text'))
}

export default {
  parseDate,
  dynamicSort,
  parsePlayers,
  parseTeams,
  arrayMaxValue,
  addDays,
  dateDiff,
  periodEnd,
  parsePlayerData
}
