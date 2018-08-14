'use strict'
const cheerio = require('cheerio')
const writeFile = require('fs')
const request = require('request')

const parseGameInfo = (title) => {
  let atIndex = title.indexOf(' at ')
  let boxIndex = title.indexOf('Box Score')
  let hocIndex = title.indexOf('Hockey')

  return {
    date : title.substring(boxIndex+12,hocIndex-2),
    home : title.substring(atIndex+3,boxIndex),
    away : title.substring(0,atIndex)
  }
}

module.exports.scrapeGameStats = (html) => {

  let player = ''
  let data = ''
  let playerId = ''

  const rawhtml = cheerio.load(html);

  const title = rawhtml('head > title').text().replace('|','')

  const gameInfo = parseGameInfo(title);

  rawhtml('tr').map(index => {

    let tr = rawhtml('tr')[index]
    let team = tr.parent.parent.parent.attribs.id.substring(4,7)

    let dataType = rawhtml(tr).attr('class') ? rawhtml(tr).attr('class') : 'general'

    tr.children.forEach((element,i) => {
      if(rawhtml(element).attr('data-stat')==='player') {
        player = rawhtml(element).text()
        playerId = rawhtml(element).find('a').attr('href')
      }
      else if (rawhtml(element).attr('data-stat')){
        let row = title.concat('|',gameInfo.date,'|',gameInfo.home,'|',gameInfo.away,'|',dataType,'|',playerId,'|',team,'|',player,'|', rawhtml(element).attr('data-stat'),'|', rawhtml(element).html())
        data += row + '\n'
      }
    })
  })
  return data
}
