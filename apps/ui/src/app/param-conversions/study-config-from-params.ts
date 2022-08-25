import { Params } from '@angular/router';
import { unflatten } from 'flat';
import { StudyConfig } from '../study-config-form/study-config';
import { StudyConfigFlattened } from '../study-config-form/study-config-flattened';
import { paramToBool } from './param-to-bool';
import { paramToCondition } from './param-to-condition';
import { paramToCueType } from './param-to-cue-type';
import { paramToNonZeroPositiveNum, paramToNumberWithinRange } from './param-to-non-zero-positive-num';
import { paramToStr } from './param-to-str';

type ObjectKeysToFnDict<T> = { [K in keyof T]: ((key: K|string, params: Params) => T[K])|undefined }

export function studyConfigFromParams(params: Params): StudyConfig {

  const paramsToConfigFnDict: ObjectKeysToFnDict<StudyConfigFlattened> = {
    repeatBlockWhenProbeTrialWrongCountIs: paramToNonZeroPositiveNum,
    maxAttempts: paramToNonZeroPositiveNum,
    contextualControl: paramToBool,
    cueType: paramToCueType,
    condition: paramToCondition,
    participantId: paramToStr,
    trialTimeoutSeconds: paramToNonZeroPositiveNum,
    trainingTrialCorrectToAdvance: paramToNumberWithinRange(0, 10),
  };

  const configFlattened = Object.fromEntries(
    Object.entries(paramsToConfigFnDict)
      .map(([key, value]) => [key, value && value(key, params)]),
  );

  return unflatten(configFlattened);
}
