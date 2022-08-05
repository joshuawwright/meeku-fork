import {CueType} from '../study-conditions/cue.constants';

export interface StudyConfigFlattened {
  'balance.same': number;
  'balance.greaterThan': number;
  'balance.iCannotKnow': number;
  'balance.lessThan': number;
  contextualControl: boolean;
  repeatBlockWhenProbeTrialWrongCountIs: number;
  maxAttempts: number;
  cueType: CueType;
  iCannotKnow: boolean;
  participantId: string;
  trialTimeoutSeconds: number;
}
