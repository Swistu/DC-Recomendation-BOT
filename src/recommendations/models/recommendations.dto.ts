export enum RecommendationsTypes {
  negative = 0,
  positive = 1,
}

export class RecommendationsDto {
  type: number;
}

export class GiveRecommendationDto {
  recommenderDiscordId: string; 
  recommendedDiscordId: string;
  reason: string; 
  type: number;
}
