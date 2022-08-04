import { CueType } from '../study-conditions/cue.constants';
import { BalanceConfig } from './balance-config';

export interface StudyConfig {
  balance: BalanceConfig;
  contextualControl: boolean;
  cueType: CueType;
  iCannotKnow: boolean;
  repeatProbeTrialWrongCount: number;
  participantId: string;
  trialTimeoutSeconds: number;
}

