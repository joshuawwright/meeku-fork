import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OneToManyGraphService } from '../../graph/one-to-many-graph.service';
import { OverlayService } from '../../overlay/overlay.service';
import { ReportService } from '../../report/report.service';
import { StudyConfig } from '../../study-config-form/study-config';
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
  maxAttempts = 0;
  name = 'One To Many Block';
  probeTrialCount = 0;
  probeTrialWithoutFeedbackStart = 32;
  probeWrongCount = 0;
  sequentialCorrectRequiredToAdvance = 3;
  startInstructions = 'CLICK TO CONTINUE';
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
    return this.attempts > this.maxAttempts;
  }

  private get lastAnswerCorrect() {
    return this.sequentialCorrect > 0;
  }

  private get repeatBlock() {
    return this.probeWrongCount === 3;
  }

  private get repeatProbeTrial() {
    return this.probeTrialCount < this.sequentialCorrectRequiredToAdvance;
  }

  private get repeatTrainingTrial() {
    return this.trainingTrialCount < this.sequentialCorrectRequiredToAdvance && this.index > -1;
  }

  createTrials() {
    const trainingTrials = this.getOrderedTrials(this.oneToManyGraph.trainingNetworks, COMPARISONS_WITH_FEEDBACK);
    const probeTrialsWithFeedback = this.getOrderedTrials(this.oneToManyGraph.finalNetworks,
      PROBE_COMPARISON_WITH_FEEDBACK);
    const probeTrialsWithoutFeedback = this.getOrderedTrials(this.oneToManyGraph.finalNetworks,
      PROBE_COMPARISONS_WITHOUT_FEEDBACK);

    return trainingTrials.concat(probeTrialsWithFeedback, probeTrialsWithoutFeedback);
  }

  feedbackEnabled(): boolean {
    return this.index < this.probeTrialWithoutFeedbackStart;
  }

  nextTrial() {
    this.isTrainingTrial ? this.nextTrainingTrial() : this.nextProbeTrial();
    try {
      console.log('trial num', this.trialNum);
      console.log('trial num', this.trial);
    }
    catch (e) {
      console.warn(e);
    }

  }

  ngOnInit(): void {
    this.start();
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
          cueComponentConfigs: randomizedComponentConfigs(this.studyConfig as StudyConfig),
        });
      }
    }
    return trials;
  }

  private nextProbeTrial() {
    this.probeWrongCount = this.lastAnswerCorrect ? this.probeWrongCount : this.probeWrongCount + 1;
    this.probeTrialCount++;

    if (this.repeatBlock) {
      this.restart();
    } else if (this.repeatProbeTrial) {
      this.repeatTrial();
    } else {
      this.probeTrialCount = 0;
      super.nextTrial();
    }
  }

  private nextTrainingTrial() {
    this.trainingTrialCount = this.lastAnswerCorrect ? this.trainingTrialCount + 1 : 0;

    if (this.repeatTrainingTrial) {
      this.repeatTrial();
    } else {
      this.trainingTrialCount = 0;
      super.nextTrial();
    }
  }

  private randomizeStimuliPositions() {
    this.trial.cueComponentConfigs = randomizedComponentConfigs(this.studyConfig);
  }

  private repeatTrial() {
    this.randomizeStimuliPositions();
    this.index--;
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
