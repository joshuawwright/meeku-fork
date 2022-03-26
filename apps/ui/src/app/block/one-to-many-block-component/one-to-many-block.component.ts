import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OneToManyGraphService } from '../../graph/one-to-many-graph.service';
import { OverlayService } from '../../overlay/overlay.service';
import { ReportService } from '../../report/report.service';
import { StudyConfig } from '../../study-config-form/study-config';
import { Trial } from '../../trial/trial';
import { FeedBackDialogData } from '../../trial/trial-correct/feed-back-dialog.data';
import { TrialCounterService } from '../../trial/trial-counter.service';
import { TrialCompleted } from '../../trial/trial.component';
import { BlockComponent } from '../block.component';
import { randomizedComponentConfigs } from '../cue-component-configs';
import { TRIAL_DELAY_INTERVAL_MS } from '../trial-animation-delay';

@Component({
  selector: 'one-to-many-block',
  templateUrl: './one-to-many-block.component.html',
  styleUrls: ['./one-to-many-block.component.scss'],
  animations: [],
})
export class OneToManyBlockComponent extends BlockComponent implements OnInit {
  name = 'One To Many Block';
  resettingCorrectCount = 0;
  sequentialCorrectRequiredToAdvance = 3;
  startInstructions = 'CLICK TO CONTINUE';

  constructor(
    dialog: MatDialog,
    overlaySvc: OverlayService,
    reportSvc: ReportService,
    trialCounterSvc: TrialCounterService,
    private oneToManyGraph: OneToManyGraphService,
  ) {
    super(dialog, overlaySvc, reportSvc, trialCounterSvc);
  }

  /**
   * Creates test block trials.
   * @returns {unknown[] | Array<Trial[][keyof Trial[]]>}
   */
  createTrials() {
    const { studyConfig } = this; // defined locally so that typescript can infer types
    if (!studyConfig) throw Error('Study configuration is undefined');

    const networks = this.studyConfig?.iCannotKnow ? this.oneToManyGraph.ickNetworkNumbers :
      this.oneToManyGraph.knownNetworkNumbers;

    const comparisions = [
      { stimulus1: 'A', stimulus2: 'B' },
      { stimulus1: 'B', stimulus2: 'A' },
      { stimulus1: 'B', stimulus2: 'C' },
      { stimulus1: 'C', stimulus2: 'B' },
      { stimulus1: 'C', stimulus2: 'A' },
      { stimulus1: 'A', stimulus2: 'C' },
    ];
    const trials: Trial[] = [];

    for (const network of networks) {
      for (const { stimulus1, stimulus2 } of comparisions) {
        const stimulusComparison = this.oneToManyGraph.getStimulusComparison(stimulus1, network, stimulus2, network);

        trials.push({
          ...stimulusComparison,
          cueComponentConfigs: randomizedComponentConfigs(studyConfig),
        });
      }
    }

    const test = trials.map(trial => `${trial.stimuli[0].toString()}:${trial.stimuli[1].toString()}`);
    console.log(test);

    return trials;
  }

  feedbackEnabled(): boolean {
    return true;
  }

  grade(selected: TrialCompleted): FeedBackDialogData['feedback']|undefined {
    if (!this.trial) throw Error('Trial is undefined');
    const isCorrect = selected?.cue?.value === this.trial.relation;

    if (selected?.cue?.value === this.trial.relation) {
      this.correct++;
      this.resettingCorrectCount++;
      this.sequentialCorrect++;
    } else {
      this.incorrect++;
      this.sequentialCorrect = 0;
      this.resettingCorrectCount = 0;
    }

    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  nextTrial() {
    if (this.resettingCorrectCount < this.sequentialCorrectRequiredToAdvance && this.index > -1) {
      (this.trial as Trial).cueComponentConfigs = randomizedComponentConfigs(this.studyConfig as StudyConfig);
      this.index--;
    } else {
      this.resettingCorrectCount = 0;
    }
    super.nextTrial();
  }

  ngOnInit(): void {
    this.start();
  }

  /***
   * Resets block index, correct count, incorrect count, and generates fresh trials.
   */
  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.trials = this.createTrials();
  }

  /***
   * Resets block index, binds to the view, and shows a message.
   */
  start() {
    if (this.trials.length === 0) this.reset();
    this.prompt(this.startInstructions, false, TRIAL_DELAY_INTERVAL_MS)
      .subscribe(() => {
        this.started.next();
        this.nextTrial();
      });
  }
}
