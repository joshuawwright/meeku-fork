import { Params } from '@angular/router';

export function paramToNonZeroPositiveNum(key: string, params: Params): number {
  if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
  const num = +params[key];
  if (isNaN(num) || num < 1) throw Error(
    `Invalid param "${key}", value was "${params[key]}". Value must be a non zero positive number`);
  return parseFloat(params[key]);
}

export function paramToNumberWithinRange(min: number, max: number): (key: string, params: Params) => number {
  return (key: string, params: Params) => {
    if (params?.[key] === undefined) throw Error(`Required param "${key}" not found`);
    const num = +params[key];
    if (isNaN(num) || num < min || num > max) throw Error(
      `Invalid param "${key}", value was "${params[key]}". Value must be a non zero positive number`);
    return parseFloat(params[key]);
  }

}
