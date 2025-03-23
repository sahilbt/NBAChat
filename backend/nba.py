from nba_api.live.nba.endpoints import scoreboard

"""
Games format
  {
    id: 0,
    homeTeam: "Chicago Bulls",
    homeTeamImg: "bulls.svg",
    awayTeam: "Los Angeles Lakers",
    awayTeamImg: "lakers.svg",
  },
"""

def get_team_name(team):
  return f'{team['teamCity']} {team['teamName']}'


def get_live_games():
  res = scoreboard.ScoreBoard().get_dict()
  games = res['scoreboard']['games']

  formatted_games = []
  for game in games:
    home, away = game['homeTeam'], game['awayTeam']
    formatted_game = {
      'id': game['gameId'],
      'homeTeam': get_team_name(home),
      'homeTeamImg': home['teamName'].lower() + '.svg',
      'awayTeam': get_team_name(away),
      'awayTeamImg': away['teamName'].lower() + '.svg',
    }
    formatted_games.append(formatted_game)

  return formatted_games
