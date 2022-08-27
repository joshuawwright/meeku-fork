import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OneToManyGraphService } from '../../graph/one-to-many-graph.service';
import { OverlayService } from '../../overlay/overlay.service';
import { ReportService } from '../../report/report.service';
import { Trial } from '../../trial/trial';
import { TrialCounterService } from '../../trial/trial-counter.service';
import { BlockComponent } from '../block.component';
import { randomizedComponentConfigs } from '../cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from '../trial-animation-delay';

interface Stimulus1And2 {
  stimulus1: string,
  stimulus2: string
}

@Component({
  selector: 'one-to-many-block',
  templateUrl: './one-to-many-block.component.html',
  styleUrls: ['./one-to-many-block.component.scss'],
})
export class OneToManyBlockComponent extends BlockComponent implements OnInit {
  ick!: boolean;
  name = 'One To Many Block';
  probeTrialCount = 0;
  probeTrialWithoutFeedbackStart = 32;
  probeWrongCount = 0;
  sequentialProbeTrialCorrectRequiredToAdvance = 3;
  sequentialTrainingTrialCorrectRequiredToAdvance = 3;
  startInstructions = 'TAKE A BREAK THEN CLICK TO CONTINUE';
  trainingTrialCount = 0;

  constructor(
    dialog: MatDialog,
    overlay: OverlayService,
    reportService: ReportService,
    counter: TrialCounterService,
    private oneToManyGraph: OneToManyGraphService,
  ) {
    super(dialog, overlay, reportService, counter);
  }

  get isTrainingTrial() {
    return this.index < this.probeTrialWithoutFeedbackStart;
  }

  private get blockFailed() {
    return this.attempts + 1 >= this.studyConfig.maxAttempts;
  }

  private get lastAnswerCorrect() {
    return this.sequentialCorrect > 0;
  }

  private get repeatBlock() {
    return this.probeWrongCount >= this.studyConfig.repeatBlockWhenProbeTrialWrongCountIs && this.trialNum === 36 &&
      this.probeTrialCount === 3;
  }

  private get repeatProbeTrial() {
    return this.probeTrialCount < this.sequentialProbeTrialCorrectRequiredToAdvance;
  }

  private get repeatTrainingTrial() {
    return this.trainingTrialCount < this.sequentialTrainingTrialCorrectRequiredToAdvance && this.index > -1;
  }

  createTrials() {
    const trainingNetworks = this.oneToManyGraph.getTrainingNetworks(this.ick);
    const finalNetworks = this.oneToManyGraph.getFinalNetworks(this.ick);

    const trainingTrials = this.getOrderedTrials(trainingNetworks, COMPARISONS_WITH_FEEDBACK);
    const probeTrialsWithFeedback = this.getOrderedTrials(finalNetworks, PROBE_COMPARISON_WITH_FEEDBACK);
    const probeTrialsWithoutFeedback = this.getOrderedTrials(finalNetworks, PROBE_COMPARISONS_WITHOUT_FEEDBACK);

    return trainingTrials.concat(probeTrialsWithFeedback, probeTrialsWithoutFeedback);
  }

  feedbackEnabled(): boolean {
    return this.index < this.probeTrialWithoutFeedbackStart;
  }

  nextTrial() {
    if (this.lastTrialWasColor) return super.nextTrial();

    this.isTrainingTrial ? this.nextTrainingTrial() : this.nextProbeTrial();
  }

  ngOnInit(): void {
    this.start();
    this.sequentialTrainingTrialCorrectRequiredToAdvance = this.studyConfig.trainingTrialCorrectToAdvance;
  }

  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.probeTrialCount = 0;
    this.probeWrongCount = 0;
    this.trainingTrialCount = 0;
    this.oneToManyGraph.updateNodeValuesWithNewStimuli();
  }

  start() {
    this.trials = this.createTrials();

    this.prompt(this.startInstructions, false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.started.next();
        this.nextTrial();
      });
  }

  private getOrderedTrials(networks: ReadonlyArray<number>, comparisons: Stimulus1And2[]) {
    const trials: Trial[] = [];
    for (const network of networks) {
      for (const { stimulus1, stimulus2 } of comparisons) {
        const stimulusComparison = this.oneToManyGraph.getStimulusComparison(stimulus1, network, stimulus2, network);

        trials.push({
          ...stimulusComparison,
          cueComponentConfigs: randomizedComponentConfigs(this.studyConfig, this.ick),
        });
      }
    }
    return trials;
  }

  private nextProbeTrial() {
    if (this._trial) {
      this.probeWrongCount = this.lastAnswerCorrect ? this.probeWrongCount : this.probeWrongCount + 1;
    }
    this.probeTrialCount++;

    if (this.repeatBlock) {
      this.restart();
    } else if (this.repeatProbeTrial) {
      this.repeatTrial();
    } else {
      this.probeTrialCount = 0;
      this.index++;
      super.nextTrial();
    }
  }

  private nextTrainingTrial() {
    this.trainingTrialCount = this.lastAnswerCorrect ? this.trainingTrialCount + 1 : 0;
    if (this.repeatTrainingTrial) {
      this.repeatTrial();
    } else {
      this.trainingTrialCount = 0;
      this.index++;
      super.nextTrial();
    }
  }

  private randomizeStimuliPositions() {
    this.trial.cueComponentConfigs = randomizedComponentConfigs(this.studyConfig, this.ick);
  }

  private repeatTrial() {
    this.randomizeStimuliPositions();
    super.nextTrial();
  }

  private restart() {
    this.blockFailed ? this.failed() : this.retry();
  }
}

const COMPARISONS_WITH_FEEDBACK: Stimulus1And2[] = [
  { stimulus1: 'A', stimulus2: 'B' },
  { stimulus1: 'B', stimulus2: 'A' },
  { stimulus1: 'B', stimulus2: 'C' },
  { stimulus1: 'C', stimulus2: 'B' },
  { stimulus1: 'C', stimulus2: 'A' },
  { stimulus1: 'A', stimulus2: 'C' },
];

const PROBE_COMPARISON_WITH_FEEDBACK: Stimulus1And2[] = [
  { stimulus1: 'A', stimulus2: 'B' },
  { stimulus1: 'B', stimulus2: 'C' },
];

const PROBE_COMPARISONS_WITHOUT_FEEDBACK: Stimulus1And2[] = [
  { stimulus1: 'B', stimulus2: 'A' },
  { stimulus1: 'C', stimulus2: 'B' },
  { stimulus1: 'C', stimulus2: 'A' },
  { stimulus1: 'A', stimulus2: 'C' },
];
