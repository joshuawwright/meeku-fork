import { Params } from '@angular/router';
import { Condition, CONDITIONS } from '@known-unknowns-multiple-exemplar-experiment/shared/util-ick';

export function paramToCondition(key: string, params: Params): Condition {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  if (!CONDITIONS.includes(params[key]))
    throw Error(
      `Invalid param "${key}", value was "${params[key]}". Value must be one of the following: ${CONDITIONS.join(
        ' | ')}`);
  return params[key] as Condition;
}

