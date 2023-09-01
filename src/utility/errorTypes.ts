export class UserExistsError extends Error {
  constructor(message: string = "Użytkownik już istnieje") {
    super(message);
    this.name = "UserExist";
  }
}

export class UserDontExistError extends Error {
  constructor(message: string = "Użytkownik nie istnieje") {
    super(message);
    this.name = "UserDontExist";
  }
}

export class RecommendationForbiddenError extends Error {
  constructor(message: string = "Nie możesz dać rekomedancji tej osobie!") {
    super(message);
    this.name = "RecommendationForbidden";
  }
}

export class RankDontExistError extends Error {
  constructor(message: string = "Ranga nie istnieje!") {
    super(message);
    this.name = "RankDontExist";
  }
}
