import { BggDetails } from './BggDetails';
import { User } from './User';
import { BoardGame } from './BoardGame';

export class BoardGameRequest {
  constructor(public id: number,
              public dateTime: string,
              public requester: User,
              public boardGame: BoardGame) {};
}