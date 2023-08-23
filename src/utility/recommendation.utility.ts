import { CorpsTypes, RankTypes } from "src/ranks/models/ranks.entity";
import { RecommendationsEntity } from "src/recommendations/models/recommendations.entity";

export function checkRecommendationRequiredToPromote(rankName: string) {
  let number: number;

  switch (rankName) {
    case RankTypes.POBOROWY:
    case RankTypes.SZEREGOWY:
    case RankTypes.STARSZY_SZEREGOWY:
    case RankTypes.KAPRAL:
    case RankTypes.STARSZY_KAPRAL:
      number = 3;
      break;
    case RankTypes.PLUTONOWY:
    case RankTypes.SIERZANT:
    case RankTypes.STARSZY_SIERZANT:
    case RankTypes.CHORAZY:
      number = 4;
      break;
    case RankTypes.STARSZY_CHORAZY:
    case RankTypes.PORUCZNIK:
    case RankTypes.KAPITAN:
    case RankTypes.MAJOR:
    case RankTypes.PULKOWNIK:
      number = 5;
      break;
    case RankTypes.GENERAL:
      number = 777;
      break;
  }
  return number;
}

export function checkPromotionAvaiable(rankName: string, corpsName: string, recommendationCount: number): boolean {
  let promotion = false;

  switch (corpsName) {
    case CorpsTypes.STRZELCOW:
      if (recommendationCount >= 3)
        if (rankName !== RankTypes.PLUTONOWY)
          promotion = true;
        else if (recommendationCount >= 4)
          promotion = true;
      break;
    case CorpsTypes.PODOFICEROW:
      if (recommendationCount >= 4)
        if (rankName !== RankTypes.STARSZY_CHORAZY)
          promotion = true;
        else if (recommendationCount >= 5)
          promotion = true;
      break;
    case CorpsTypes.OFICEROW:
      if (recommendationCount >= 5)
        promotion = true;
      break;
  }
  return promotion;
}

export function calcCurrentRecommendationNumber(recommendationList: RecommendationsEntity[]) {
  return recommendationList.reduce((previous, current) => {
    if (current.type)
      return previous + 1;
    else
      return previous - 1;
  }, 0);
}

export function isUserRecommendationInList(recommenderDiscordId: string, recommendationList: RecommendationsEntity[], type: string) {
  return recommendationList.find((element) => {
    if (element.recommender_discord_id === recommenderDiscordId && element.type === type)
      return true;
  })
}
