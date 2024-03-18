import { CorpsTypes } from 'src/ranks/models/ranks.entity';

export function parseCorpsName(corps: string) {
  let number: number;

  switch (corps) {
    case CorpsTypes.OFICEROW:
      number = 3;
      break;
    case CorpsTypes.PODOFICEROW:
      number = 2;
      break;
    case CorpsTypes.STRZELCOW:
      number = 1;
      break;
  }

  return number;
}
