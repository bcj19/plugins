function findWinner(home, visitor) {
  var rankBonus = 1.5, // multiplier for difference in rank (eg// rank 4 vs rank 2 >>> rankBonus * (4-2) === #)
    rankCompare = Math.abs(parseInt(home.rank) - parseInt(visitor.rank)),
    maxHeadToHead = 100,
    wins = { // the winner of each matchup is the greatest # of wins out of 100 coin flips
      home: 2, // give home team slight edge to start
      visitor: 0
    };

  // update wins for home and visitor before looping through coin head to head coin flips
  if (home.rank < visitor.rank) {
    wins.home += (rankCompare * rankBonus);
  } else if (visitor.rank < home.rank) {
    wins.visitor += (rankCompare * rankBonus);
  }

  // add total wins for home and visitor to get # of games already played
  var gamesPlayed = Math.round(wins.home + wins.visitor);

  // 100 games (accounting for games already played, so we don't flip for them again)
  for (var i = gamesPlayed, max = maxHeadToHead; i < max; i++) {
    var gameWinner = (Math.floor(Math.random() * 2) == 0) ? "home" : "visitor";
    wins[gameWinner]++;
  }

  // determine the winner and loser
  var winner = (wins.home >= wins.visitor) ? home.team : visitor.team;
  var loser = (winner === home.team) ? visitor.team : home.team;
  var isTie = (wins.home === wins.visitor) ? true : false;

  // update win/loss records for both teams
  updateRecords(winner, loser, isTie);

  // return the name of the winning team (or TIE if no winner)
  return (!isTie) ? winner : "TIE";
}

function updateRecords(winner, loser, isTie) {
  // update the winner and loser records, if it's a tie, update that, too
  if (!isTie) {
    records[winner].win = parseInt(records[winner].win) + 1;
    records[loser].loss = parseInt(records[loser].loss) + 1;
  } else {
    records[winner].tie = parseInt(records[winner].tie) + 1;
    records[loser].tie = parseInt(records[loser].tie) + 1;
  }
}

// build the matchups and execute the head to head competitions, returns the complete results for all matchups
function buildMatchups(pv_teams) {
  var matchups = [];

  for (var i = 0, max = pv_teams.length; i < max; i++) {
    var current = pv_teams[i];

    for (var ii = 0; ii < max; ii++) {
      if (current != pv_teams[ii]) {
        matchups.push({
          'game': (parseInt(i) + 1) + '_v_' + (parseInt(ii) + 1),
          'home': current.team,
          'visitor': pv_teams[ii].team,
          'winner': findWinner(current, pv_teams[ii])
        });
      }
    }
  }
  return matchups;
}

// placeholder for individual team results, populated in init() and updated through updateRecords()
var records = {}

// set the teams up and build initial records table
function init(pv_teams) {
  for (var i = 0, max = pv_teams.length; i < max; i++) {
    records[pv_teams[i].team] = {
      'win': 0,
      'loss': 0,
      'tie': 0,
      'start_rank': pv_teams[i].rank
    }
  }
}

// the competition!
var teams = [{
    'team': 'Reds',
    'rank': 1
  },
  {
    'team': 'Blues',
    'rank': 2
  },
  {
    'team': 'Greens',
    'rank': 3
  },
  {
    'team': 'Yellows',
    'rank': 4
  },
  {
    'team': 'Oranges',
    'rank': 5
  },
  {
    'team': 'Indigos',
    'rank': 6
  },
  {
    'team': 'Violets',
    'rank': 7
  }
];

// build it and see who wins
init(teams);
var output = buildMatchups(teams) 
console.log(output);
console.table(records);
