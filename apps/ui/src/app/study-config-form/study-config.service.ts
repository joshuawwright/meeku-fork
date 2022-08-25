import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '@known-unknowns-multiple-exemplar-experiment/ng/mat-snack-bar';
import { Condition } from '@known-unknowns-multiple-exemplar-experiment/shared/util-ick';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { catchError, first, map, tap } from 'rxjs/operators';
import { studyConfigFromParams } from '../param-conversions/study-config-from-params';
import { CUE_TYPE } from '../study-conditions/cue.constants';
import { StudyConfig } from './study-config';

@Injectable({
  providedIn: 'root',
})
export class StudyConfigService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBarSvc: SnackBarService,
  ) {
  }

  private _config?: StudyConfig;

  get config(): StudyConfig {
    if (!this._config) throw Error('Config is not defined');
    return this._config;
  }

  get condition() {
    return this.config.condition;
  }

  get participantId(): string {
    return this.config.participantId;
  }

  createForm(): FormGroup<StudyConfig> {
    const numericValidators1To100 = [Validators.required, Validators.min(1), Validators.max(100)];
    const numericValidators1To12 = [Validators.required, Validators.min(1), Validators.max(12)];

    return this.fb.group({
      maxAttempts: [9, numericValidators1To100],
      repeatBlockWhenProbeTrialWrongCountIs: [3, numericValidators1To12],
      contextualControl: [false, Validators.required],
      cueType: [CUE_TYPE.nonArbitrary, Validators.required],
      condition: ['' as Condition, Validators.required],
      participantId: ['', [Validators.required, Validators.minLength(3)]],
      trialTimeoutSeconds: [10, [Validators.required, Validators.min(1), Validators.max(1000)]],
      trainingTrialCorrectToAdvance: [3, [Validators.required, Validators.min(0), Validators.max(10)]],
    });
  }

  isConfigValid(config: StudyConfig): void {
    const form = this.createForm();
    form.patchValue(config);
    if (form.invalid) throw Error('Study configuration params are invalid.');
  }

  async loadStudyConfigFromParams(): Promise<void> {
    this._config = await this.activatedRoute.queryParams.pipe(
      first(),
      map(studyConfigFromParams),
      tap((config) => this.isConfigValid(config)),
      catchError((err) => {
        this.snackBarSvc.error(err.message);
        this.router.navigate([`../`]).then();
        return [err];
      })).toPromise();
  }
}
