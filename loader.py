import urllib2, utils

timestamp = utils.timestamp('%Y%m%d')

teams = [
'anaheim-ducks',
'arizona-coyotes',
'boston-bruins',
'buffalo-sabres',
'calgary-flames',
'carolina-hurricanes',
'chicago-blackhawks',
'colorado-avalanche',
'columbus-blue-jackets',
'dallas-stars',
'detroit-red-wings',
'edmonton-oilers',
'florida-panthers',
'los-angeles-kings',
'minnesota-wild',
'montreal-canadiens',
'nashville-predators',
'new-jersey-devils',
'new-york-islanders',
'new-york-rangers',
'ottawa-senators',
'philadelphia-flyers',
'pittsburgh-penguins',
'san-jose-sharks',
'st-louis-blues',
'tampa-bay-lightning',
'toronto-maple-leafs',
'vancouver-canucks',
'vegas-golden-knights',
'washington-capitals',
'winnipeg-jets'
]

for team in teams:
 url = "https://www.dailyfaceoff.com/teams/"+team+"/line-combinations"
 lines = urllib2.urlopen(url)
 linesHtml = lines.read()
 filename = timestamp+'_'+team + '.htm'
 utils.SaveToS3(linesHtml, filename, 'statsgoon-source-daily-faceoff')
 print(filename+' uploaded to S3')
