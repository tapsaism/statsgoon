
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

const addDays = (days) => {
  let dat = new Date('2017-10-04')
  dat.setDate(dat.getDate() + days)
  return dat.getFullYear()+'-'+dat.getMonth()+'-'+dat.getDate()
}

const dateDiff = (firstDate, secondDate) => {
  return Math.round((secondDate-firstDate)/(1000*60*60*24));
}

const periodEnd = () => {
  let endDays = 0
  if(new Date() < new Date('2017-10-29')) return 25
  if(new Date() < new Date('2017-12-10')) return 67
  if(new Date() < new Date('2018-01-25')) return 119
  if(new Date() < new Date('2018-12-10')) return 151
  if(new Date() < new Date('2018-12-10')) return 185

}


export default {
  parseDate,
  dynamicSort,
  parsePlayers,
  parseTeams,
  arrayMaxValue,
  addDays,
  dateDiff,
  periodEnd
}
