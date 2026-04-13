import type { ConferenceSlug } from '@/lib/supabase/types'

export interface SchoolData {
  slug: string
  name: string
  short_name: string
  mascot: string
  nickname: string
  city: string
  state: string
  conference: ConferenceSlug
  primary_color: string
  secondary_color: string
  fan_size_rank: number
}

export const SCHOOLS: SchoolData[] = [
  // ═══════════════════════════════════════════
  // TOP 20 (by fan size)
  // ═══════════════════════════════════════════
  { slug: 'nebraska', name: 'Nebraska Cornhuskers', short_name: 'Nebraska', mascot: 'Cornhuskers', nickname: 'Huskers', city: 'Lincoln', state: 'NE', conference: 'big-ten', primary_color: '#E41C38', secondary_color: '#F5F1E7', fan_size_rank: 1 },
  { slug: 'alabama', name: 'Alabama Crimson Tide', short_name: 'Alabama', mascot: 'Crimson Tide', nickname: 'Bama', city: 'Tuscaloosa', state: 'AL', conference: 'sec', primary_color: '#9E1B32', secondary_color: '#828A8F', fan_size_rank: 2 },
  { slug: 'ohio-state', name: 'Ohio State Buckeyes', short_name: 'Ohio State', mascot: 'Buckeyes', nickname: 'Bucks', city: 'Columbus', state: 'OH', conference: 'big-ten', primary_color: '#BB0000', secondary_color: '#666666', fan_size_rank: 3 },
  { slug: 'michigan', name: 'Michigan Wolverines', short_name: 'Michigan', mascot: 'Wolverines', nickname: 'Wolverines', city: 'Ann Arbor', state: 'MI', conference: 'big-ten', primary_color: '#00274C', secondary_color: '#FFCB05', fan_size_rank: 4 },
  { slug: 'texas', name: 'Texas Longhorns', short_name: 'Texas', mascot: 'Longhorns', nickname: 'Horns', city: 'Austin', state: 'TX', conference: 'sec', primary_color: '#BF5700', secondary_color: '#FFFFFF', fan_size_rank: 5 },
  { slug: 'georgia', name: 'Georgia Bulldogs', short_name: 'Georgia', mascot: 'Bulldogs', nickname: 'Dawgs', city: 'Athens', state: 'GA', conference: 'sec', primary_color: '#BA0C2F', secondary_color: '#000000', fan_size_rank: 6 },
  { slug: 'penn-state', name: 'Penn State Nittany Lions', short_name: 'Penn State', mascot: 'Nittany Lions', nickname: 'PSU', city: 'State College', state: 'PA', conference: 'big-ten', primary_color: '#041E42', secondary_color: '#FFFFFF', fan_size_rank: 7 },
  { slug: 'lsu', name: 'LSU Tigers', short_name: 'LSU', mascot: 'Tigers', nickname: 'Tigers', city: 'Baton Rouge', state: 'LA', conference: 'sec', primary_color: '#461D7C', secondary_color: '#FDD023', fan_size_rank: 8 },
  { slug: 'notre-dame', name: 'Notre Dame Fighting Irish', short_name: 'Notre Dame', mascot: 'Fighting Irish', nickname: 'Irish', city: 'Notre Dame', state: 'IN', conference: 'independent', primary_color: '#0C2340', secondary_color: '#C99700', fan_size_rank: 9 },
  { slug: 'tennessee', name: 'Tennessee Volunteers', short_name: 'Tennessee', mascot: 'Volunteers', nickname: 'Vols', city: 'Knoxville', state: 'TN', conference: 'sec', primary_color: '#FF8200', secondary_color: '#FFFFFF', fan_size_rank: 10 },
  { slug: 'oklahoma', name: 'Oklahoma Sooners', short_name: 'Oklahoma', mascot: 'Sooners', nickname: 'Sooners', city: 'Norman', state: 'OK', conference: 'sec', primary_color: '#841617', secondary_color: '#FDF9D8', fan_size_rank: 11 },
  { slug: 'auburn', name: 'Auburn Tigers', short_name: 'Auburn', mascot: 'Tigers', nickname: 'Tigers', city: 'Auburn', state: 'AL', conference: 'sec', primary_color: '#0C2340', secondary_color: '#E87722', fan_size_rank: 12 },
  { slug: 'florida', name: 'Florida Gators', short_name: 'Florida', mascot: 'Gators', nickname: 'Gators', city: 'Gainesville', state: 'FL', conference: 'sec', primary_color: '#0021A5', secondary_color: '#FA4616', fan_size_rank: 13 },
  { slug: 'clemson', name: 'Clemson Tigers', short_name: 'Clemson', mascot: 'Tigers', nickname: 'Tigers', city: 'Clemson', state: 'SC', conference: 'acc', primary_color: '#F66733', secondary_color: '#522D80', fan_size_rank: 14 },
  { slug: 'michigan-state', name: 'Michigan State Spartans', short_name: 'Michigan State', mascot: 'Spartans', nickname: 'Spartans', city: 'East Lansing', state: 'MI', conference: 'big-ten', primary_color: '#18453B', secondary_color: '#FFFFFF', fan_size_rank: 15 },
  { slug: 'wisconsin', name: 'Wisconsin Badgers', short_name: 'Wisconsin', mascot: 'Badgers', nickname: 'Badgers', city: 'Madison', state: 'WI', conference: 'big-ten', primary_color: '#C5050C', secondary_color: '#FFFFFF', fan_size_rank: 16 },
  { slug: 'iowa', name: 'Iowa Hawkeyes', short_name: 'Iowa', mascot: 'Hawkeyes', nickname: 'Hawks', city: 'Iowa City', state: 'IA', conference: 'big-ten', primary_color: '#FFCD00', secondary_color: '#000000', fan_size_rank: 17 },
  { slug: 'texas-am', name: 'Texas A&M Aggies', short_name: 'Texas A&M', mascot: 'Aggies', nickname: 'Aggies', city: 'College Station', state: 'TX', conference: 'sec', primary_color: '#500000', secondary_color: '#FFFFFF', fan_size_rank: 18 },
  { slug: 'oregon', name: 'Oregon Ducks', short_name: 'Oregon', mascot: 'Ducks', nickname: 'Ducks', city: 'Eugene', state: 'OR', conference: 'big-ten', primary_color: '#154733', secondary_color: '#FEE123', fan_size_rank: 19 },
  { slug: 'usc', name: 'USC Trojans', short_name: 'USC', mascot: 'Trojans', nickname: 'Trojans', city: 'Los Angeles', state: 'CA', conference: 'big-ten', primary_color: '#990000', secondary_color: '#FFC72C', fan_size_rank: 20 },

  // ═══════════════════════════════════════════
  // SEC (remaining)
  // ═══════════════════════════════════════════
  { slug: 'arkansas', name: 'Arkansas Razorbacks', short_name: 'Arkansas', mascot: 'Razorbacks', nickname: 'Hogs', city: 'Fayetteville', state: 'AR', conference: 'sec', primary_color: '#9D2235', secondary_color: '#FFCF01', fan_size_rank: 21 },
  { slug: 'south-carolina', name: 'South Carolina Gamecocks', short_name: 'South Carolina', mascot: 'Gamecocks', nickname: 'Cocks', city: 'Columbia', state: 'SC', conference: 'sec', primary_color: '#73000A', secondary_color: '#000000', fan_size_rank: 22 },
  { slug: 'ole-miss', name: 'Ole Miss Rebels', short_name: 'Ole Miss', mascot: 'Rebels', nickname: 'Rebels', city: 'Oxford', state: 'MS', conference: 'sec', primary_color: '#14213D', secondary_color: '#CE1126', fan_size_rank: 23 },
  { slug: 'kentucky', name: 'Kentucky Wildcats', short_name: 'Kentucky', mascot: 'Wildcats', nickname: 'Cats', city: 'Lexington', state: 'KY', conference: 'sec', primary_color: '#0033A0', secondary_color: '#FFFFFF', fan_size_rank: 24 },
  { slug: 'missouri', name: 'Missouri Tigers', short_name: 'Missouri', mascot: 'Tigers', nickname: 'Mizzou', city: 'Columbia', state: 'MO', conference: 'sec', primary_color: '#F1B82D', secondary_color: '#000000', fan_size_rank: 25 },
  { slug: 'mississippi-state', name: 'Mississippi State Bulldogs', short_name: 'Miss State', mascot: 'Bulldogs', nickname: 'Bulldogs', city: 'Starkville', state: 'MS', conference: 'sec', primary_color: '#660000', secondary_color: '#FFFFFF', fan_size_rank: 26 },
  { slug: 'vanderbilt', name: 'Vanderbilt Commodores', short_name: 'Vanderbilt', mascot: 'Commodores', nickname: 'Dores', city: 'Nashville', state: 'TN', conference: 'sec', primary_color: '#866D4B', secondary_color: '#000000', fan_size_rank: 27 },

  // ═══════════════════════════════════════════
  // BIG TEN (remaining)
  // ═══════════════════════════════════════════
  { slug: 'minnesota', name: 'Minnesota Golden Gophers', short_name: 'Minnesota', mascot: 'Golden Gophers', nickname: 'Gophers', city: 'Minneapolis', state: 'MN', conference: 'big-ten', primary_color: '#7A0019', secondary_color: '#FFB71B', fan_size_rank: 28 },
  { slug: 'indiana', name: 'Indiana Hoosiers', short_name: 'Indiana', mascot: 'Hoosiers', nickname: 'Hoosiers', city: 'Bloomington', state: 'IN', conference: 'big-ten', primary_color: '#990000', secondary_color: '#FFFFFF', fan_size_rank: 29 },
  { slug: 'purdue', name: 'Purdue Boilermakers', short_name: 'Purdue', mascot: 'Boilermakers', nickname: 'Boilers', city: 'West Lafayette', state: 'IN', conference: 'big-ten', primary_color: '#CEB888', secondary_color: '#000000', fan_size_rank: 30 },
  { slug: 'illinois', name: 'Illinois Fighting Illini', short_name: 'Illinois', mascot: 'Fighting Illini', nickname: 'Illini', city: 'Champaign', state: 'IL', conference: 'big-ten', primary_color: '#E84A27', secondary_color: '#13294B', fan_size_rank: 31 },
  { slug: 'iowa-state', name: 'Iowa State Cyclones', short_name: 'Iowa State', mascot: 'Cyclones', nickname: 'Cyclones', city: 'Ames', state: 'IA', conference: 'big-12', primary_color: '#C8102E', secondary_color: '#F1BE48', fan_size_rank: 32 },
  { slug: 'maryland', name: 'Maryland Terrapins', short_name: 'Maryland', mascot: 'Terrapins', nickname: 'Terps', city: 'College Park', state: 'MD', conference: 'big-ten', primary_color: '#E03A3E', secondary_color: '#FFD520', fan_size_rank: 33 },
  { slug: 'northwestern', name: 'Northwestern Wildcats', short_name: 'Northwestern', mascot: 'Wildcats', nickname: 'Cats', city: 'Evanston', state: 'IL', conference: 'big-ten', primary_color: '#4E2A84', secondary_color: '#FFFFFF', fan_size_rank: 34 },
  { slug: 'rutgers', name: 'Rutgers Scarlet Knights', short_name: 'Rutgers', mascot: 'Scarlet Knights', nickname: 'Knights', city: 'Piscataway', state: 'NJ', conference: 'big-ten', primary_color: '#CC0033', secondary_color: '#5F6A72', fan_size_rank: 35 },
  { slug: 'ucla', name: 'UCLA Bruins', short_name: 'UCLA', mascot: 'Bruins', nickname: 'Bruins', city: 'Los Angeles', state: 'CA', conference: 'big-ten', primary_color: '#2D68C4', secondary_color: '#F2A900', fan_size_rank: 36 },
  { slug: 'washington', name: 'Washington Huskies', short_name: 'Washington', mascot: 'Huskies', nickname: 'Huskies', city: 'Seattle', state: 'WA', conference: 'big-ten', primary_color: '#4B2E83', secondary_color: '#B7A57A', fan_size_rank: 37 },

  // ═══════════════════════════════════════════
  // BIG 12 (remaining)
  // ═══════════════════════════════════════════
  { slug: 'oklahoma-state', name: 'Oklahoma State Cowboys', short_name: 'Oklahoma State', mascot: 'Cowboys', nickname: 'Pokes', city: 'Stillwater', state: 'OK', conference: 'big-12', primary_color: '#FF6600', secondary_color: '#000000', fan_size_rank: 38 },
  { slug: 'colorado', name: 'Colorado Buffaloes', short_name: 'Colorado', mascot: 'Buffaloes', nickname: 'Buffs', city: 'Boulder', state: 'CO', conference: 'big-12', primary_color: '#CFB87C', secondary_color: '#000000', fan_size_rank: 39 },
  { slug: 'baylor', name: 'Baylor Bears', short_name: 'Baylor', mascot: 'Bears', nickname: 'Bears', city: 'Waco', state: 'TX', conference: 'big-12', primary_color: '#154734', secondary_color: '#FFB81C', fan_size_rank: 40 },
  { slug: 'kansas', name: 'Kansas Jayhawks', short_name: 'Kansas', mascot: 'Jayhawks', nickname: 'Jayhawks', city: 'Lawrence', state: 'KS', conference: 'big-12', primary_color: '#0051A5', secondary_color: '#E8000D', fan_size_rank: 41 },
  { slug: 'kansas-state', name: 'Kansas State Wildcats', short_name: 'Kansas State', mascot: 'Wildcats', nickname: 'Wildcats', city: 'Manhattan', state: 'KS', conference: 'big-12', primary_color: '#512888', secondary_color: '#FFFFFF', fan_size_rank: 42 },
  { slug: 'tcu', name: 'TCU Horned Frogs', short_name: 'TCU', mascot: 'Horned Frogs', nickname: 'Frogs', city: 'Fort Worth', state: 'TX', conference: 'big-12', primary_color: '#4D1979', secondary_color: '#A3A9AC', fan_size_rank: 43 },
  { slug: 'texas-tech', name: 'Texas Tech Red Raiders', short_name: 'Texas Tech', mascot: 'Red Raiders', nickname: 'Raiders', city: 'Lubbock', state: 'TX', conference: 'big-12', primary_color: '#CC0000', secondary_color: '#000000', fan_size_rank: 44 },
  { slug: 'west-virginia', name: 'West Virginia Mountaineers', short_name: 'West Virginia', mascot: 'Mountaineers', nickname: 'Mountaineers', city: 'Morgantown', state: 'WV', conference: 'big-12', primary_color: '#002855', secondary_color: '#EAAA00', fan_size_rank: 45 },
  { slug: 'byu', name: 'BYU Cougars', short_name: 'BYU', mascot: 'Cougars', nickname: 'Cougars', city: 'Provo', state: 'UT', conference: 'big-12', primary_color: '#002E5D', secondary_color: '#FFFFFF', fan_size_rank: 46 },
  { slug: 'utah', name: 'Utah Utes', short_name: 'Utah', mascot: 'Utes', nickname: 'Utes', city: 'Salt Lake City', state: 'UT', conference: 'big-12', primary_color: '#CC0001', secondary_color: '#808080', fan_size_rank: 47 },
  { slug: 'arizona', name: 'Arizona Wildcats', short_name: 'Arizona', mascot: 'Wildcats', nickname: 'Cats', city: 'Tucson', state: 'AZ', conference: 'big-12', primary_color: '#CC0033', secondary_color: '#003366', fan_size_rank: 48 },
  { slug: 'arizona-state', name: 'Arizona State Sun Devils', short_name: 'Arizona State', mascot: 'Sun Devils', nickname: 'Devils', city: 'Tempe', state: 'AZ', conference: 'big-12', primary_color: '#8C1D40', secondary_color: '#FFC627', fan_size_rank: 49 },
  { slug: 'cincinnati', name: 'Cincinnati Bearcats', short_name: 'Cincinnati', mascot: 'Bearcats', nickname: 'Bearcats', city: 'Cincinnati', state: 'OH', conference: 'big-12', primary_color: '#E00122', secondary_color: '#000000', fan_size_rank: 50 },
  { slug: 'houston', name: 'Houston Cougars', short_name: 'Houston', mascot: 'Cougars', nickname: 'Coogs', city: 'Houston', state: 'TX', conference: 'big-12', primary_color: '#C8102E', secondary_color: '#FFFFFF', fan_size_rank: 51 },
  { slug: 'ucf', name: 'UCF Knights', short_name: 'UCF', mascot: 'Knights', nickname: 'Knights', city: 'Orlando', state: 'FL', conference: 'big-12', primary_color: '#000000', secondary_color: '#BA9B37', fan_size_rank: 52 },

  // ═══════════════════════════════════════════
  // ACC (remaining)
  // ═══════════════════════════════════════════
  { slug: 'florida-state', name: 'Florida State Seminoles', short_name: 'Florida State', mascot: 'Seminoles', nickname: 'Noles', city: 'Tallahassee', state: 'FL', conference: 'acc', primary_color: '#782F40', secondary_color: '#CEB888', fan_size_rank: 53 },
  { slug: 'miami', name: 'Miami Hurricanes', short_name: 'Miami', mascot: 'Hurricanes', nickname: 'Canes', city: 'Coral Gables', state: 'FL', conference: 'acc', primary_color: '#005030', secondary_color: '#F47321', fan_size_rank: 54 },
  { slug: 'north-carolina', name: 'North Carolina Tar Heels', short_name: 'UNC', mascot: 'Tar Heels', nickname: 'Heels', city: 'Chapel Hill', state: 'NC', conference: 'acc', primary_color: '#4B9CD3', secondary_color: '#FFFFFF', fan_size_rank: 55 },
  { slug: 'virginia-tech', name: 'Virginia Tech Hokies', short_name: 'Virginia Tech', mascot: 'Hokies', nickname: 'Hokies', city: 'Blacksburg', state: 'VA', conference: 'acc', primary_color: '#630031', secondary_color: '#CF4420', fan_size_rank: 56 },
  { slug: 'nc-state', name: 'NC State Wolfpack', short_name: 'NC State', mascot: 'Wolfpack', nickname: 'Pack', city: 'Raleigh', state: 'NC', conference: 'acc', primary_color: '#CC0000', secondary_color: '#000000', fan_size_rank: 57 },
  { slug: 'louisville', name: 'Louisville Cardinals', short_name: 'Louisville', mascot: 'Cardinals', nickname: 'Cards', city: 'Louisville', state: 'KY', conference: 'acc', primary_color: '#AD0000', secondary_color: '#000000', fan_size_rank: 58 },
  { slug: 'pittsburgh', name: 'Pittsburgh Panthers', short_name: 'Pitt', mascot: 'Panthers', nickname: 'Panthers', city: 'Pittsburgh', state: 'PA', conference: 'acc', primary_color: '#003594', secondary_color: '#FFB81C', fan_size_rank: 59 },
  { slug: 'georgia-tech', name: 'Georgia Tech Yellow Jackets', short_name: 'Georgia Tech', mascot: 'Yellow Jackets', nickname: 'Jackets', city: 'Atlanta', state: 'GA', conference: 'acc', primary_color: '#B3A369', secondary_color: '#003057', fan_size_rank: 60 },
  { slug: 'syracuse', name: 'Syracuse Orange', short_name: 'Syracuse', mascot: 'Orange', nickname: 'Cuse', city: 'Syracuse', state: 'NY', conference: 'acc', primary_color: '#D44500', secondary_color: '#000E54', fan_size_rank: 61 },
  { slug: 'duke', name: 'Duke Blue Devils', short_name: 'Duke', mascot: 'Blue Devils', nickname: 'Devils', city: 'Durham', state: 'NC', conference: 'acc', primary_color: '#003087', secondary_color: '#FFFFFF', fan_size_rank: 62 },
  { slug: 'virginia', name: 'Virginia Cavaliers', short_name: 'Virginia', mascot: 'Cavaliers', nickname: 'Hoos', city: 'Charlottesville', state: 'VA', conference: 'acc', primary_color: '#232D4B', secondary_color: '#E57200', fan_size_rank: 63 },
  { slug: 'boston-college', name: 'Boston College Eagles', short_name: 'Boston College', mascot: 'Eagles', nickname: 'Eagles', city: 'Chestnut Hill', state: 'MA', conference: 'acc', primary_color: '#8B0000', secondary_color: '#C0A000', fan_size_rank: 64 },
  { slug: 'wake-forest', name: 'Wake Forest Demon Deacons', short_name: 'Wake Forest', mascot: 'Demon Deacons', nickname: 'Deacs', city: 'Winston-Salem', state: 'NC', conference: 'acc', primary_color: '#9E7E38', secondary_color: '#000000', fan_size_rank: 65 },
  { slug: 'stanford', name: 'Stanford Cardinal', short_name: 'Stanford', mascot: 'Cardinal', nickname: 'Cardinal', city: 'Stanford', state: 'CA', conference: 'acc', primary_color: '#8C1515', secondary_color: '#B6B1A9', fan_size_rank: 66 },
  { slug: 'california', name: 'California Golden Bears', short_name: 'Cal', mascot: 'Golden Bears', nickname: 'Bears', city: 'Berkeley', state: 'CA', conference: 'acc', primary_color: '#003262', secondary_color: '#FDB515', fan_size_rank: 67 },
  { slug: 'smu', name: 'SMU Mustangs', short_name: 'SMU', mascot: 'Mustangs', nickname: 'Mustangs', city: 'Dallas', state: 'TX', conference: 'acc', primary_color: '#CC0035', secondary_color: '#0033A0', fan_size_rank: 68 },

  // ═══════════════════════════════════════════
  // AMERICAN ATHLETIC
  // ═══════════════════════════════════════════
  { slug: 'memphis', name: 'Memphis Tigers', short_name: 'Memphis', mascot: 'Tigers', nickname: 'Tigers', city: 'Memphis', state: 'TN', conference: 'american', primary_color: '#003087', secondary_color: '#898D8D', fan_size_rank: 69 },
  { slug: 'tulane', name: 'Tulane Green Wave', short_name: 'Tulane', mascot: 'Green Wave', nickname: 'Wave', city: 'New Orleans', state: 'LA', conference: 'american', primary_color: '#006747', secondary_color: '#418FDE', fan_size_rank: 70 },
  { slug: 'navy', name: 'Navy Midshipmen', short_name: 'Navy', mascot: 'Midshipmen', nickname: 'Mids', city: 'Annapolis', state: 'MD', conference: 'american', primary_color: '#00205B', secondary_color: '#C5B783', fan_size_rank: 71 },
  { slug: 'south-florida', name: 'South Florida Bulls', short_name: 'USF', mascot: 'Bulls', nickname: 'Bulls', city: 'Tampa', state: 'FL', conference: 'american', primary_color: '#006747', secondary_color: '#CFC493', fan_size_rank: 72 },
  { slug: 'east-carolina', name: 'East Carolina Pirates', short_name: 'East Carolina', mascot: 'Pirates', nickname: 'Pirates', city: 'Greenville', state: 'NC', conference: 'american', primary_color: '#592A8A', secondary_color: '#FDC82F', fan_size_rank: 73 },
  { slug: 'florida-atlantic', name: 'Florida Atlantic Owls', short_name: 'FAU', mascot: 'Owls', nickname: 'Owls', city: 'Boca Raton', state: 'FL', conference: 'american', primary_color: '#003366', secondary_color: '#CC0000', fan_size_rank: 74 },
  { slug: 'temple', name: 'Temple Owls', short_name: 'Temple', mascot: 'Owls', nickname: 'Owls', city: 'Philadelphia', state: 'PA', conference: 'american', primary_color: '#9D2235', secondary_color: '#FFFFFF', fan_size_rank: 75 },
  { slug: 'charlotte', name: 'Charlotte 49ers', short_name: 'Charlotte', mascot: '49ers', nickname: 'Niners', city: 'Charlotte', state: 'NC', conference: 'american', primary_color: '#046A38', secondary_color: '#B9975B', fan_size_rank: 76 },
  { slug: 'north-texas', name: 'North Texas Mean Green', short_name: 'North Texas', mascot: 'Mean Green', nickname: 'Mean Green', city: 'Denton', state: 'TX', conference: 'american', primary_color: '#00853E', secondary_color: '#FFFFFF', fan_size_rank: 77 },
  { slug: 'rice', name: 'Rice Owls', short_name: 'Rice', mascot: 'Owls', nickname: 'Owls', city: 'Houston', state: 'TX', conference: 'american', primary_color: '#00205B', secondary_color: '#5B6770', fan_size_rank: 78 },
  { slug: 'tulsa', name: 'Tulsa Golden Hurricane', short_name: 'Tulsa', mascot: 'Golden Hurricane', nickname: 'Hurricane', city: 'Tulsa', state: 'OK', conference: 'american', primary_color: '#002D62', secondary_color: '#C8102E', fan_size_rank: 79 },
  { slug: 'utsa', name: 'UTSA Roadrunners', short_name: 'UTSA', mascot: 'Roadrunners', nickname: 'Runners', city: 'San Antonio', state: 'TX', conference: 'american', primary_color: '#002A5E', secondary_color: '#F15A22', fan_size_rank: 80 },

  // ═══════════════════════════════════════════
  // MOUNTAIN WEST
  // ═══════════════════════════════════════════
  { slug: 'boise-state', name: 'Boise State Broncos', short_name: 'Boise State', mascot: 'Broncos', nickname: 'Broncos', city: 'Boise', state: 'ID', conference: 'mountain-west', primary_color: '#0033A0', secondary_color: '#D64309', fan_size_rank: 81 },
  { slug: 'san-diego-state', name: 'San Diego State Aztecs', short_name: 'SDSU', mascot: 'Aztecs', nickname: 'Aztecs', city: 'San Diego', state: 'CA', conference: 'mountain-west', primary_color: '#BA0C2F', secondary_color: '#000000', fan_size_rank: 82 },
  { slug: 'fresno-state', name: 'Fresno State Bulldogs', short_name: 'Fresno State', mascot: 'Bulldogs', nickname: 'Bulldogs', city: 'Fresno', state: 'CA', conference: 'mountain-west', primary_color: '#CC0000', secondary_color: '#003DA5', fan_size_rank: 83 },
  { slug: 'colorado-state', name: 'Colorado State Rams', short_name: 'Colorado State', mascot: 'Rams', nickname: 'Rams', city: 'Fort Collins', state: 'CO', conference: 'mountain-west', primary_color: '#1E4D2B', secondary_color: '#C8C372', fan_size_rank: 84 },
  { slug: 'unlv', name: 'UNLV Rebels', short_name: 'UNLV', mascot: 'Rebels', nickname: 'Rebels', city: 'Las Vegas', state: 'NV', conference: 'mountain-west', primary_color: '#CF0A2C', secondary_color: '#858585', fan_size_rank: 85 },
  { slug: 'air-force', name: 'Air Force Falcons', short_name: 'Air Force', mascot: 'Falcons', nickname: 'Falcons', city: 'Colorado Springs', state: 'CO', conference: 'mountain-west', primary_color: '#003087', secondary_color: '#8A8D8F', fan_size_rank: 86 },
  { slug: 'wyoming', name: 'Wyoming Cowboys', short_name: 'Wyoming', mascot: 'Cowboys', nickname: 'Pokes', city: 'Laramie', state: 'WY', conference: 'mountain-west', primary_color: '#492F24', secondary_color: '#FFC425', fan_size_rank: 87 },
  { slug: 'hawaii', name: 'Hawaii Rainbow Warriors', short_name: 'Hawaii', mascot: 'Rainbow Warriors', nickname: 'Warriors', city: 'Honolulu', state: 'HI', conference: 'mountain-west', primary_color: '#024731', secondary_color: '#C8B560', fan_size_rank: 88 },
  { slug: 'nevada', name: 'Nevada Wolf Pack', short_name: 'Nevada', mascot: 'Wolf Pack', nickname: 'Pack', city: 'Reno', state: 'NV', conference: 'mountain-west', primary_color: '#003366', secondary_color: '#8F8F8C', fan_size_rank: 89 },
  { slug: 'new-mexico', name: 'New Mexico Lobos', short_name: 'New Mexico', mascot: 'Lobos', nickname: 'Lobos', city: 'Albuquerque', state: 'NM', conference: 'mountain-west', primary_color: '#BA0C2F', secondary_color: '#63666A', fan_size_rank: 90 },
  { slug: 'san-jose-state', name: 'San Jose State Spartans', short_name: 'San Jose State', mascot: 'Spartans', nickname: 'Spartans', city: 'San Jose', state: 'CA', conference: 'mountain-west', primary_color: '#0055A2', secondary_color: '#E5A823', fan_size_rank: 91 },
  { slug: 'utah-state', name: 'Utah State Aggies', short_name: 'Utah State', mascot: 'Aggies', nickname: 'Aggies', city: 'Logan', state: 'UT', conference: 'mountain-west', primary_color: '#013C72', secondary_color: '#8B8B00', fan_size_rank: 92 },

  // ═══════════════════════════════════════════
  // SUN BELT
  // ═══════════════════════════════════════════
  { slug: 'app-state', name: 'Appalachian State Mountaineers', short_name: 'App State', mascot: 'Mountaineers', nickname: 'Mountaineers', city: 'Boone', state: 'NC', conference: 'sun-belt', primary_color: '#000000', secondary_color: '#FFB300', fan_size_rank: 93 },
  { slug: 'james-madison', name: 'James Madison Dukes', short_name: 'James Madison', mascot: 'Dukes', nickname: 'Dukes', city: 'Harrisonburg', state: 'VA', conference: 'sun-belt', primary_color: '#450084', secondary_color: '#CBB766', fan_size_rank: 94 },
  { slug: 'marshall', name: 'Marshall Thundering Herd', short_name: 'Marshall', mascot: 'Thundering Herd', nickname: 'Herd', city: 'Huntington', state: 'WV', conference: 'sun-belt', primary_color: '#009639', secondary_color: '#000000', fan_size_rank: 95 },
  { slug: 'louisiana', name: 'Louisiana Ragin\' Cajuns', short_name: 'Louisiana', mascot: 'Ragin\' Cajuns', nickname: 'Cajuns', city: 'Lafayette', state: 'LA', conference: 'sun-belt', primary_color: '#CE181E', secondary_color: '#231F20', fan_size_rank: 96 },
  { slug: 'southern-miss', name: 'Southern Miss Golden Eagles', short_name: 'Southern Miss', mascot: 'Golden Eagles', nickname: 'Eagles', city: 'Hattiesburg', state: 'MS', conference: 'sun-belt', primary_color: '#FFB300', secondary_color: '#000000', fan_size_rank: 97 },
  { slug: 'troy', name: 'Troy Trojans', short_name: 'Troy', mascot: 'Trojans', nickname: 'Trojans', city: 'Troy', state: 'AL', conference: 'sun-belt', primary_color: '#8B0000', secondary_color: '#C0A000', fan_size_rank: 98 },
  { slug: 'georgia-southern', name: 'Georgia Southern Eagles', short_name: 'Georgia Southern', mascot: 'Eagles', nickname: 'Eagles', city: 'Statesboro', state: 'GA', conference: 'sun-belt', primary_color: '#011E41', secondary_color: '#C8A956', fan_size_rank: 99 },
  { slug: 'old-dominion', name: 'Old Dominion Monarchs', short_name: 'Old Dominion', mascot: 'Monarchs', nickname: 'Monarchs', city: 'Norfolk', state: 'VA', conference: 'sun-belt', primary_color: '#003087', secondary_color: '#8B8B00', fan_size_rank: 100 },
  { slug: 'arkansas-state', name: 'Arkansas State Red Wolves', short_name: 'Arkansas State', mascot: 'Red Wolves', nickname: 'Wolves', city: 'Jonesboro', state: 'AR', conference: 'sun-belt', primary_color: '#CC092F', secondary_color: '#000000', fan_size_rank: 101 },
  { slug: 'georgia-state', name: 'Georgia State Panthers', short_name: 'Georgia State', mascot: 'Panthers', nickname: 'Panthers', city: 'Atlanta', state: 'GA', conference: 'sun-belt', primary_color: '#0039A6', secondary_color: '#CC0000', fan_size_rank: 102 },
  { slug: 'south-alabama', name: 'South Alabama Jaguars', short_name: 'South Alabama', mascot: 'Jaguars', nickname: 'Jags', city: 'Mobile', state: 'AL', conference: 'sun-belt', primary_color: '#003087', secondary_color: '#BA0C2F', fan_size_rank: 103 },
  { slug: 'texas-state', name: 'Texas State Bobcats', short_name: 'Texas State', mascot: 'Bobcats', nickname: 'Bobcats', city: 'San Marcos', state: 'TX', conference: 'sun-belt', primary_color: '#501214', secondary_color: '#8B8B00', fan_size_rank: 104 },
  { slug: 'louisiana-monroe', name: 'Louisiana Monroe Warhawks', short_name: 'ULM', mascot: 'Warhawks', nickname: 'Warhawks', city: 'Monroe', state: 'LA', conference: 'sun-belt', primary_color: '#840029', secondary_color: '#C1A35E', fan_size_rank: 105 },

  // ═══════════════════════════════════════════
  // MAC
  // ═══════════════════════════════════════════
  { slug: 'toledo', name: 'Toledo Rockets', short_name: 'Toledo', mascot: 'Rockets', nickname: 'Rockets', city: 'Toledo', state: 'OH', conference: 'mac', primary_color: '#003F7D', secondary_color: '#FFC82E', fan_size_rank: 106 },
  { slug: 'northern-illinois', name: 'Northern Illinois Huskies', short_name: 'NIU', mascot: 'Huskies', nickname: 'Huskies', city: 'DeKalb', state: 'IL', conference: 'mac', primary_color: '#BA0C2F', secondary_color: '#000000', fan_size_rank: 107 },
  { slug: 'western-michigan', name: 'Western Michigan Broncos', short_name: 'Western Michigan', mascot: 'Broncos', nickname: 'Broncos', city: 'Kalamazoo', state: 'MI', conference: 'mac', primary_color: '#6C4023', secondary_color: '#C5922D', fan_size_rank: 108 },
  { slug: 'ohio', name: 'Ohio Bobcats', short_name: 'Ohio', mascot: 'Bobcats', nickname: 'Bobcats', city: 'Athens', state: 'OH', conference: 'mac', primary_color: '#00694E', secondary_color: '#FFFFFF', fan_size_rank: 109 },
  { slug: 'miami-ohio', name: 'Miami (OH) RedHawks', short_name: 'Miami OH', mascot: 'RedHawks', nickname: 'RedHawks', city: 'Oxford', state: 'OH', conference: 'mac', primary_color: '#B61E2E', secondary_color: '#FFFFFF', fan_size_rank: 110 },
  { slug: 'central-michigan', name: 'Central Michigan Chippewas', short_name: 'Central Michigan', mascot: 'Chippewas', nickname: 'Chips', city: 'Mount Pleasant', state: 'MI', conference: 'mac', primary_color: '#6A0032', secondary_color: '#FFC82E', fan_size_rank: 111 },
  { slug: 'buffalo', name: 'Buffalo Bulls', short_name: 'Buffalo', mascot: 'Bulls', nickname: 'Bulls', city: 'Buffalo', state: 'NY', conference: 'mac', primary_color: '#005BBB', secondary_color: '#FFFFFF', fan_size_rank: 112 },
  { slug: 'ball-state', name: 'Ball State Cardinals', short_name: 'Ball State', mascot: 'Cardinals', nickname: 'Cardinals', city: 'Muncie', state: 'IN', conference: 'mac', primary_color: '#BA0C2F', secondary_color: '#FFFFFF', fan_size_rank: 113 },
  { slug: 'bowling-green', name: 'Bowling Green Falcons', short_name: 'Bowling Green', mascot: 'Falcons', nickname: 'Falcons', city: 'Bowling Green', state: 'OH', conference: 'mac', primary_color: '#4F2C1D', secondary_color: '#FC5C04', fan_size_rank: 114 },
  { slug: 'eastern-michigan', name: 'Eastern Michigan Eagles', short_name: 'Eastern Michigan', mascot: 'Eagles', nickname: 'Eagles', city: 'Ypsilanti', state: 'MI', conference: 'mac', primary_color: '#006633', secondary_color: '#FFFFFF', fan_size_rank: 115 },
  { slug: 'kent-state', name: 'Kent State Golden Flashes', short_name: 'Kent State', mascot: 'Golden Flashes', nickname: 'Flashes', city: 'Kent', state: 'OH', conference: 'mac', primary_color: '#002664', secondary_color: '#EAB200', fan_size_rank: 116 },
  { slug: 'akron', name: 'Akron Zips', short_name: 'Akron', mascot: 'Zips', nickname: 'Zips', city: 'Akron', state: 'OH', conference: 'mac', primary_color: '#041E42', secondary_color: '#A89968', fan_size_rank: 117 },

  // ═══════════════════════════════════════════
  // CONFERENCE USA
  // ═══════════════════════════════════════════
  { slug: 'western-kentucky', name: 'Western Kentucky Hilltoppers', short_name: 'WKU', mascot: 'Hilltoppers', nickname: 'Toppers', city: 'Bowling Green', state: 'KY', conference: 'cusa', primary_color: '#C60C30', secondary_color: '#000000', fan_size_rank: 118 },
  { slug: 'sam-houston', name: 'Sam Houston Bearkats', short_name: 'Sam Houston', mascot: 'Bearkats', nickname: 'Kats', city: 'Huntsville', state: 'TX', conference: 'cusa', primary_color: '#F96302', secondary_color: '#FFFFFF', fan_size_rank: 119 },
  { slug: 'middle-tennessee', name: 'Middle Tennessee Blue Raiders', short_name: 'MTSU', mascot: 'Blue Raiders', nickname: 'Raiders', city: 'Murfreesboro', state: 'TN', conference: 'cusa', primary_color: '#0066CC', secondary_color: '#FFFFFF', fan_size_rank: 120 },
  { slug: 'louisiana-tech', name: 'Louisiana Tech Bulldogs', short_name: 'Louisiana Tech', mascot: 'Bulldogs', nickname: 'Bulldogs', city: 'Ruston', state: 'LA', conference: 'cusa', primary_color: '#002F6C', secondary_color: '#E31837', fan_size_rank: 121 },
  { slug: 'jacksonville-state', name: 'Jacksonville State Gamecocks', short_name: 'Jax State', mascot: 'Gamecocks', nickname: 'Gamecocks', city: 'Jacksonville', state: 'AL', conference: 'cusa', primary_color: '#CC0000', secondary_color: '#003087', fan_size_rank: 122 },
  { slug: 'utep', name: 'UTEP Miners', short_name: 'UTEP', mascot: 'Miners', nickname: 'Miners', city: 'El Paso', state: 'TX', conference: 'cusa', primary_color: '#FF8200', secondary_color: '#041E42', fan_size_rank: 123 },
  { slug: 'fiu', name: 'FIU Panthers', short_name: 'FIU', mascot: 'Panthers', nickname: 'Panthers', city: 'Miami', state: 'FL', conference: 'cusa', primary_color: '#081E3F', secondary_color: '#B6862C', fan_size_rank: 124 },
  { slug: 'new-mexico-state', name: 'New Mexico State Aggies', short_name: 'NMSU', mascot: 'Aggies', nickname: 'Aggies', city: 'Las Cruces', state: 'NM', conference: 'cusa', primary_color: '#861F41', secondary_color: '#C8A96E', fan_size_rank: 125 },

  // ═══════════════════════════════════════════
  // INDEPENDENTS (remaining)
  // ═══════════════════════════════════════════
  { slug: 'liberty', name: 'Liberty Flames', short_name: 'Liberty', mascot: 'Flames', nickname: 'Flames', city: 'Lynchburg', state: 'VA', conference: 'independent', primary_color: '#002868', secondary_color: '#C41230', fan_size_rank: 126 },
  { slug: 'connecticut', name: 'Connecticut Huskies', short_name: 'UConn', mascot: 'Huskies', nickname: 'Huskies', city: 'Storrs', state: 'CT', conference: 'independent', primary_color: '#000E2F', secondary_color: '#E4D5B7', fan_size_rank: 127 },
  { slug: 'umass', name: 'UMass Minutemen', short_name: 'UMass', mascot: 'Minutemen', nickname: 'Minutemen', city: 'Amherst', state: 'MA', conference: 'independent', primary_color: '#881C1C', secondary_color: '#041E42', fan_size_rank: 128 },
  { slug: 'army', name: 'Army Black Knights', short_name: 'Army', mascot: 'Black Knights', nickname: 'Knights', city: 'West Point', state: 'NY', conference: 'independent', primary_color: '#000000', secondary_color: '#D4BF8B', fan_size_rank: 129 },
  { slug: 'kennesaw-state', name: 'Kennesaw State Owls', short_name: 'Kennesaw State', mascot: 'Owls', nickname: 'Owls', city: 'Kennesaw', state: 'GA', conference: 'cusa', primary_color: '#FDBB30', secondary_color: '#000000', fan_size_rank: 130 },
]

export function getSchoolBySlug(slug: string): SchoolData | undefined {
  return SCHOOLS.find(s => s.slug === slug)
}

export function getSchoolsByConference(conference: string): SchoolData[] {
  if (conference === 'all') return [...SCHOOLS].sort((a, b) => a.fan_size_rank - b.fan_size_rank)
  return SCHOOLS.filter(s => s.conference === conference).sort((a, b) => a.fan_size_rank - b.fan_size_rank)
}

export function searchSchools(query: string): SchoolData[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase().trim()
  return SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.short_name.toLowerCase().includes(q) ||
    s.mascot.toLowerCase().includes(q) ||
    s.nickname.toLowerCase().includes(q) ||
    s.slug.includes(q) ||
    s.conference.toLowerCase().includes(q) ||
    s.city.toLowerCase().includes(q) ||
    s.state.toLowerCase().includes(q) ||
    (SCHOOL_SEARCH_ALIASES[s.slug] || []).some(alias => alias.includes(q) || q.includes(alias))
  ).sort((a, b) => a.fan_size_rank - b.fan_size_rank)
}

export const SCHOOL_SEARCH_ALIASES: Record<string, string[]> = {
  'nebraska':        ['huskers', 'cornhuskers', 'big red', 'nu'],
  'alabama':         ['crimson tide', 'bama', 'roll tide', 'ua'],
  'ohio-state':      ['buckeyes', 'osu', 'bucks'],
  'michigan':        ['wolverines', 'umich', 'u of m', 'go blue'],
  'michigan-state':  ['spartans', 'msu', 'state'],
  'georgia':         ['bulldogs', 'uga', 'dawgs'],
  'penn-state':      ['nittany lions', 'psu', 'we are'],
  'lsu':             ['tigers', 'louisiana state', 'geaux'],
  'notre-dame':      ['fighting irish', 'nd', 'irish'],
  'tennessee':       ['volunteers', 'vols', 'ut', 'rocky top'],
  'oklahoma':        ['sooners', 'ou'],
  'auburn':          ['tigers', 'war eagle', 'au'],
  'florida':         ['gators', 'uf', 'swamp'],
  'clemson':         ['tigers', 'cu'],
  'wisconsin':       ['badgers', 'uw', 'bucky'],
  'iowa':            ['hawkeyes', 'hawk-eyes'],
  'texas':           ['longhorns', 'ut', 'hook em', 'horns'],
  'texas-am':        ['aggies', 'tamu', 'gig em', '12th man'],
  'oregon':          ['ducks', 'uo'],
  'usc':             ['trojans', 'southern cal', 'southern california'],
  'ucla':            ['bruins', 'uc la'],
  'washington':      ['huskies', 'uw', 'dawgs'],
  'florida-state':   ['seminoles', 'fsu', 'noles'],
  'miami':           ['hurricanes', 'canes', 'the u'],
  'north-carolina':  ['tar heels', 'unc', 'carolina'],
  'duke':            ['blue devils'],
  'virginia':        ['cavaliers', 'wahoos', 'uva', 'hoos'],
  'virginia-tech':   ['hokies', 'vt'],
  'louisville':      ['cardinals', 'ul'],
  'kansas':          ['jayhawks', 'ku', 'rock chalk'],
  'kansas-state':    ['wildcats', 'k-state', 'ksu'],
  'iowa-state':      ['cyclones', 'isu'],
  'baylor':          ['bears', 'bu'],
  'tcu':             ['horned frogs', 'texas christian'],
  'texas-tech':      ['red raiders', 'ttu', 'tech'],
  'oklahoma-state':  ['cowboys', 'osu', 'pokes'],
  'west-virginia':   ['mountaineers', 'wvu'],
  'colorado':        ['buffaloes', 'buffs', 'cu'],
  'utah':            ['utes', 'uu'],
  'arizona':         ['wildcats', 'ua', 'zona'],
  'arizona-state':   ['sun devils', 'asu'],
  'stanford':        ['cardinal', 'su'],
  'california':      ['golden bears', 'cal', 'bears'],
  'oregon-state':    ['beavers', 'osu'],
  'washington-state':['cougars', 'wsu', 'cougs'],
  'minnesota':       ['golden gophers', 'gophers', 'u of m'],
  'illinois':        ['fighting illini', 'illini', 'uiuc'],
  'indiana':         ['hoosiers', 'iu'],
  'purdue':          ['boilermakers', 'boilers'],
  'maryland':        ['terrapins', 'terps', 'umd'],
  'rutgers':         ['scarlet knights', 'ru'],
  'northwestern':    ['wildcats', 'nu'],
  'pittsburgh':      ['panthers', 'pitt', 'pgh'],
  'syracuse':        ['orange', 'cuse', 'su'],
  'boston-college':   ['eagles', 'bc'],
  'wake-forest':     ['demon deacons', 'wfu'],
  'nc-state':        ['wolfpack', 'ncsu', 'pack'],
  'georgia-tech':    ['yellow jackets', 'ramblin wreck', 'gt'],
  'missouri':        ['tigers', 'mizzou', 'mu'],
  'ole-miss':        ['ole miss', 'rebels', 'hotty toddy'],
  'mississippi-state': ['bulldogs', 'hail state', 'msu'],
  'vanderbilt':      ['commodores', 'vandy', 'vu'],
  'south-carolina':  ['gamecocks', 'usc', 'cocky'],
  'kentucky':        ['wildcats', 'uk', 'cats'],
  'arkansas':        ['razorbacks', 'hogs', 'woo pig'],
}
