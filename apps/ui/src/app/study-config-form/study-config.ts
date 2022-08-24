import { CueType } from '../study-conditions/cue.constants';
import { BalanceConfig } from './balance-config';

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  cueType: CueType;
  iCannotKnow: string;
  repeatBlockWhenProbeTrialWrongCountIs: number;
  maxAttempts: number;
  participantId: string;
  trialTimeoutSeconds: number;
  trainingTrialCorrectToAdvance: number;
}

