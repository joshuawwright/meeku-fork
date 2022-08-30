import { Condition } from '@known-unknowns-multiple-exemplar-experiment/shared/util-ick';
import { CueType } from '../study-conditions/cue.constants';

export interface StudyConfig {
  condition: Condition;
  contextualControl: boolean;
  cueType: CueType;
  maxAttempts: number;
  participantId: string;
  repeatBlockWhenProbeTrialWrongCountIs: number;
  trainingTrialCorrectToAdvance: number;
  trialTimeoutSeconds: number;
}

