import { CueType } from '../study-conditions/cue.constants';

export interface StudyConfigFlattened {
  contextualControl: boolean;
  cueType: CueType;
  condition: string;
  maxAttempts: number;
  participantId: string;
  repeatBlockWhenProbeTrialWrongCountIs: number;
  trainingTrialCorrectToAdvance: number;
  trialTimeoutSeconds: number;
}
