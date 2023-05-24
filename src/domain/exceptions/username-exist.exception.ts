export class UserNameExistException extends Error {
  constructor(username: string) {
    super(`User ${username} already exists.`);
    this.name = 'UserNameExistException';
  }
}
