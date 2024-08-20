export class UserAlreadyExistgsError extends Error {
  constructor() {
    super('E-mail already exists')
  }
}
