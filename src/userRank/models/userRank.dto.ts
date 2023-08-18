import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserRank {
  discord_id: string;
  rankId: number;
  rankStartDate?: Date;
}

export class createUserRankBase {
  @IsNotEmpty()
  @IsString()
  discordId: string;
}

export class createUserRankWithId extends createUserRankBase {
  @IsNumber()
  @IsNotEmpty()
  rankId: number;
  rankName: never;
  rankOrderNumber: never;
}

export class createUserRankWithRankName extends createUserRankBase {
  rankId: never;
  @IsNotEmpty()
  @IsString()
  rankName: string;
  rankOrderNumber: never;
}

export class createUserRankWithOrderNumber extends createUserRankBase {
  rankId: never;
  rankName: never;
  @IsNumber()
  @IsNotEmpty()
  rankOrderNumber: number;
}

