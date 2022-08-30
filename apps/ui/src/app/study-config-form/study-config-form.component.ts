import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CONDITIONS } from '@known-unknowns-multiple-exemplar-experiment/shared/util-ick';
import { FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { flatten } from 'flat';
import { environment } from '../../environments/environment';
import { CUE_TYPES_OPTIONS } from '../study-conditions/cue.constants';
import { StudyConfig } from './study-config';
import { StudyConfigFlattened } from './study-config-flattened';
import { StudyConfigService } from './study-config.service';

@UntilDestroy()
@Component({
  selector: 'study-config-form',
  templateUrl: './study-config-form.component.html',
  styleUrls: ['./study-config-form.component.scss'],
})
export class StudyConfigFormComponent {
  cueTypeOptions = CUE_TYPES_OPTIONS;
  form: FormGroup<StudyConfig>;
  conditions = CONDITIONS;

  constructor(
    private clipboard: Clipboard,
    private router: Router,
    private studyConfigSvc: StudyConfigService,
  ) {
    this.form = this.studyConfigSvc.createForm();
  }

  copyLink() {
    this.clipboard.copy(
      `${environment.baseUrl}/study?${this.getQueryParamStr()}`);
  }

  getQueryParamObj(): StudyConfigFlattened {
    return flatten(this.form.value);
  }

  getQueryParamStr() {
    return Object.entries(this.getQueryParamObj()).map(([key, val]) => `${key}=${val}`).join('&');
  }

  start() {
    this.router.navigate([`./study`], { queryParams: this.getQueryParamObj() }).then();
  }

}
