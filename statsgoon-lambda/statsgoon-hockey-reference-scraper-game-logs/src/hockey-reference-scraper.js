'use strict'
const cheerio = require('cheerio')
const writeFile = require('fs')
const request = require('request')

module.exports.scrapeGameStats = (html) => {

  let data = ''
  let ranker = 0

  const rawhtml = cheerio.load(html);

  const title = rawhtml('head > title').text().replace('|','')

  const playerDetails = rawhtml('div.media-item').next().text()
  const ps = rawhtml('div.media-item').next().find('p')

  let DOB, position, currentSalary, currentCapHit
  let prev = 'previkka'

  ps.map(i => {
    let p = rawhtml('p')[i]
    p.children.forEach((element,i) => {
/
      switch (prev) {
        case "Position":
          position = rawhtml(element).text().substring(1,3).replace(/(\r\n|\n|\r)/gm,"")
        case "Born:":
          DOB = rawhtml(element).text()
        case "Current salary":
          currentSalary = rawhtml(element).text()
        case  "Current cap hit":
          currentCapHit = rawhtml(element).text()
        default:
          null
      }

      prev = rawhtml(element).text().trim() === '' ? prev :  rawhtml(element).text()
    })
  })

  rawhtml('tr').map(index => {

    let tr = rawhtml('tr')[index]
    let dataType = rawhtml(tr).attr('class') ? rawhtml(tr).attr('class') : 'general'

    tr.children.forEach((element,i) => {
      if(rawhtml(element).attr('data-stat')==='ranker') {
        ranker = rawhtml(element).text()
      }
      else if (rawhtml(element).attr('data-stat')){
        let row = title.concat('|', DOB, '|', position, '|', currentSalary, '|', currentCapHit, '|', ranker, '|', rawhtml(element).attr('data-stat'),'|', rawhtml(element).html())
        data += row + '\n'
      }
    })
  })
  return data
}
