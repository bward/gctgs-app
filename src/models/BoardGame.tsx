import { BggDetails } from './BggDetails';
import { User } from './User';

export class BoardGame {
  constructor(public id: number,
              public name: string,
              public location: string,
              public owner: User,
              public bggDetails: BggDetails) {};
}