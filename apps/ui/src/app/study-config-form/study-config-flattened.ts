import { CueType } from '../study-conditions/cue.constants';

export interface StudyConfigFlattened {
  'balance.greaterThan': number;
  'balance.iCannotKnow': number;
  'balance.lessThan': number;
  'balance.same': number;
  contextualControl: boolean;
  cueType: CueType;
  iCannotKnow: string;
  maxAttempts: number;
  participantId: string;
  repeatBlockWhenProbeTrialWrongCountIs: number;
  trainingTrialCorrectToAdvance: number;
  trialTimeoutSeconds: number;
}
