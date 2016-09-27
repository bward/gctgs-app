export class User {
  public constructor(public crsid: string,
                     public name: string,
                     public key: string,
                     public admin: boolean,
                     public email: string) {}
}