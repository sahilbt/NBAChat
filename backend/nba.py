from nba_api.live.nba.endpoints import scoreboard

# Interacting with nba api
def get_team_name(team):
  return f"{team['teamCity']} {team['teamName']}"

def get_live_games():
  res = scoreboard.ScoreBoard().get_dict()
  games = res['scoreboard']['games']

  # Get all games running for the day
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
