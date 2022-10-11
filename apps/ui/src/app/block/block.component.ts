import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, timer } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { OverlayService } from '../overlay/overlay.service';
import { ReportService } from '../report/report.service';
import { StudyConfig } from '../study-config-form/study-config';
import { CueSelected } from '../trial/cue-selected';
import { FADE_OUT_DURATION_MS } from '../trial/fade-out-duration';
import { Trial } from '../trial/trial';
import { FeedBackDialogData } from '../trial/trial-correct/feed-back-dialog.data';
import { FEEDBACK_DURATION_MS, FEEDBACK_FADE_OUT_DELAY_MS } from '../trial/trial-correct/feedback-duration';
import { TrialFeedbackDialogComponent } from '../trial/trial-correct/trial-feedback-dialog.component';
import { TrialCounterService } from '../trial/trial-counter.service';
import { TrialCompleted, TrialComponent } from '../trial/trial.component';
import { BlockButtonDialogComponent, BlockButtonDialogData } from './block-button-dialog/block-button-dialog.component';
import { createColorTrial } from './color-trial';
import { fullScreenDialogWithData } from './full-screen-dialog-with-data';
import { TRIAL_ANIMATION_DURATION_MS, TRIAL_DELAY_INTERVAL_MS } from './trial-animation-delay';

@Component({
  selector: 'block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent {
  @Output() completed = new Subject<{ failed: boolean }>();
  completedAt?: Date;
  containsSequentialTriplicates = false;
  correct = 0;
  failSafeDuration = 0;
  feedBackShown = false;
  feedback?: FeedBackDialogData['feedback'];
  incorrect = 0;
  index = -1;
  isVisible = true;
  lastTrialWasColor = false;
  name = 'Block';
  retryInstructions = 'TAKE A BREAK THEN CLICK TO TRY AGAIN';
  sequentialCorrect = 0;
  startInstructions = 'CLICK TO START';
  @Output() started = new Subject();
  startedAt: Date|undefined;
  studyFailed = false;
  @Output() trialCompleted = new EventEmitter();
  @ViewChild(TrialComponent, { static: false }) trialComponent?: TrialComponent;
  trials: Trial[] = [];

  constructor(
    private dialog: MatDialog,
    private overlaySvc: OverlayService,
    private reportSvc: ReportService,
    private trialCounterSvc: TrialCounterService,
  ) {
  }

  private _attempts = 0;

  get attempts() {
    return this._attempts;
  }

  private _probeAttempts = 0;

  get probeAttempts() {
    return this._probeAttempts;
  }

  _studyConfig?: StudyConfig;

  get studyConfig() {
    if (!this._studyConfig) throw Error('Study configuration is undefined');
    return this._studyConfig;
  }

  set studyConfig(config: StudyConfig) {
    this._studyConfig = config;
  };

  private _totalTrials = 0;

  get totalTrials() {
    return this._totalTrials;
  }

  private _trainingAttempts = 0;

  get trainingAttempts() {
    return this._trainingAttempts;
  }

  _trial?: Trial;

  get trial() {
    if (!this._trial) throw Error('Trial is undefined');
    return this._trial;
  }

  set trial(trial: Trial) {
    this._trial = trial;
  }

  get isLastTrial() {
    return this.index === this.trials.length - 1;
  }

  /**
   * Calculates the percent correct in the current trial attempt by
   * dividing the correct count by the trial number and multiplying by 100
   * @returns {number}
   */
  get percentCorrect(): number {
    return (this.correct / (this.correct + this.incorrect)) * 100;
  }

  /**
   * Converts index (zero-based) to trial number
   * @returns {number}
   */
  get trialNum() {
    return this.index + 1;
  }

  /**
   * Increases the number of attempts, sets the completed at date, then emits the completed event.
   */
  complete() {
    this.incrementAttempt();
    this.completedAt = new Date();
    setTimeout(() => {
      this.completed.next({ failed: false });
    }, TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS));
  }

  /**
   * Creates trials for the block
   */
  createTrials(): Trial[] {
    return [];
  }

  /**
   * Participants that fail the block criterion are thanked for their participation and the study is completed.
   */
  failed() {
    this.completed.next({ failed: true });
  }

  /**
   * Function that determines if feedback is enabled. This can easily be overridden
   * in block subclasses to accommodate complex feedback scenarios. Reference
   * the forced choice block.
   * @returns {boolean}
   */
  feedbackEnabled() {
    return false;
  }

  /**
   * The selected relation is compared to the the trial relation. If the selected relation is
   * correct the correct counter is increased by 1 otherwise, the incorrect counter
   * is increased by one. If the answer was correct the feedback string "CORRECT"
   * is returned otherwise the feedback string "WRONG" is returned.
   * @param {CueSelected | undefined} selected
   * @returns {"CORRECT" | "WRONG"}
   */
  grade(selected: TrialCompleted): FeedBackDialogData['feedback']|undefined {
    const isCorrect = selected?.cue?.value === this.trial.relation;

    if (!['red', 'green', 'blue'].includes(this.trial.relation)) {
      if (selected?.cue?.value === this.trial.relation) {
        this.correct++;
        this.sequentialCorrect++;
      } else {
        this.incorrect++;
        this.sequentialCorrect = 0;
      }
    }
    return isCorrect ? 'CORRECT' : 'WRONG';
  }

  increaseTotalTrials() {
    this._totalTrials++;
  }

  incrementAttempt() {
    this._attempts++;
  }

  incrementProbeAttempts() {
    return this._probeAttempts++;
  }

  incrementTrainingAttempts() {
    return this._trainingAttempts++;
  }

  nextTrial(showCorrectAnswer = true) {
    if (this.index === -1) this.startedAt = new Date();

    this.trialCounterSvc.increase();

    if (this.trialCounterSvc.showColorTrial) {
      this.showTrial(createColorTrial(), this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : 0, false);
      this.trialCompleted.pipe(first()).subscribe(selected => this.cueSelected(selected));
      this.trialCounterSvc.reset();
    } else if (this.index < this.trials.length) {
      this.showTrial(this.trials[this.index], this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : 0, showCorrectAnswer);
      this.trialCompleted.pipe(first()).subscribe(selected => this.cueSelected(selected));
    } else {
      this.complete();
    }
  }

  /**
   * Shows a clickable dialog to the user with a prompt.
   * @param {string} text
   * @param {boolean} disableClose
   * @param {number} delayMs
   * @returns {Observable<void>}
   */
  prompt(text: string, disableClose = false, delayMs = TRIAL_ANIMATION_DURATION_MS): Observable<void> {
    return timer(delayMs).pipe(
      first(),
      switchMap(() => this.dialog.open(
        BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose }),
      ).componentInstance.closeClicked.pipe(first())),
    );
  }

  /***
   * Resets block index, correct count, incorrect count, and generates fresh trials.
   */
  reset() {
    this.index = -1;
    this.correct = 0;
    this.incorrect = 0;
    this.sequentialCorrect = 0;
    this.trials = this.createTrials();
  }

  /**
   * User is shown a retry block, which they have to click to continue.
   */
  retry() {
    this.incrementAttempt();
    this.prompt(this.retryInstructions, false,
      TRIAL_DELAY_INTERVAL_MS + (this.feedBackShown ? FEEDBACK_FADE_OUT_DELAY_MS : FADE_OUT_DURATION_MS)).subscribe(
      () => this.nextTrial(),
    );
    this.reset();
  }

  /**
   * Shows feedback to a participant for a set duration.
   * @param {string} feedback
   * @param {number} durationMs
   * @param {{duration: number, delay: number}} animationParams
   */
  showFeedback(
    feedback: FeedBackDialogData['feedback'],
    durationMs = FEEDBACK_DURATION_MS,
    animationParams = { delay: FEEDBACK_FADE_OUT_DELAY_MS, duration: FADE_OUT_DURATION_MS },
  ) {
    this.feedBackShown = true;
    if (this.isLastTrial) this.overlaySvc.show(FEEDBACK_FADE_OUT_DELAY_MS);
    this.dialog.open(
      TrialFeedbackDialogComponent,
      fullScreenDialogWithData<FeedBackDialogData>({ animationParams, durationMs, feedback }),
    );
  }

  showTrial(trial: Trial, delayMs = FEEDBACK_FADE_OUT_DELAY_MS, showCorrectAnswer: boolean) {
    this.lastTrialWasColor = ['red', 'green', 'blue'].includes(trial.relation);
    this.feedBackShown = false;
    this.trial = trial;
    setTimeout(() => this.trialComponent?.show(trial, showCorrectAnswer), delayMs);
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

  /**
   * When a relation is selected. The associated trial and relation selected data
   * is stored. Feedback is shown if an item is not selected or feedback
   * is enabled. Then the block is advanced to the next trial.
   * @param {CueSelected | undefined} selected
   */
  private cueSelected(selected: TrialCompleted) {
    this.feedback = this.grade(selected);

    if (!selected?.cue) {
      this.showFeedback('TIME EXPIRED');
    } else if (this.feedback && this.feedbackEnabled()) {
      this.showFeedback(this.feedback);
    }

    this.reportSvc.addTrial(this, selected);
    this.increaseTotalTrials();
    this.nextTrial();
  }
}
