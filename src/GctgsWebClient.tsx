import { User } from './models/User'
import { BoardGame } from './models/BoardGame';

export class GctgsWebClient {
  private readonly baseUrl = 'https://gctgs.ben-ward.net/api';

  public getBoardGames(user: User): Promise<BoardGame[]> {
    let headers = new Headers();
    headers.append("X-GCTGS-Key", user.key);
    let options = {
      headers
    }
    return fetch(this.baseUrl + '/boardgames', options)
      .then((response) => response.json())
      .then((responseJson) => responseJson as BoardGame[])
      .catch((error: any) => console.log(error));
  }
}