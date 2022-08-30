import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DeviceDetectorService } from 'ngx-device-detector';
import { interval, timer } from 'rxjs';
import { delay, filter, tap } from 'rxjs/operators';
import { fadeIn } from '../../animations/fade-in.animation';
import { fadeOut } from '../../animations/fade-out.animation';
import { TrialCueComponentConfig } from '../../study-conditions/trial-cue-component-config';
import { FADE_OUT_DURATION_MS } from '../fade-out-duration';

@UntilDestroy()
@Component({
  selector: 'trial-cue',
  templateUrl: './trial-cue.component.html',
  styleUrls: ['../trial.component.scss', './trial-cue.component.scss'],
  animations: [
    fadeIn(),
    fadeOut({ duration: FADE_OUT_DURATION_MS }),
  ],
})
export class TrialCueComponent implements OnInit {
  animate?: 'fade-in'|'fade-out';
  @Input() animationDelay = 0;
  config?: TrialCueComponentConfig;
  correct = false;
  disabled = true;
  isDesktop = this.deviceDetectorSvc.isDesktop();
  @Output() selected = new EventEmitter<TrialCueComponentConfig>();
  shake = false;

  constructor(private deviceDetectorSvc: DeviceDetectorService) {}

  ngOnInit(): void {
    interval(4000).pipe(
      filter(() => this.correct),
      tap(() => this.shake = true),
      delay(1500),
      tap(() => this.shake = false),
      untilDestroyed(this),
    ).subscribe();
  }

  select() {
    this.disabled = true;
    this.selected.emit(this.config);
  }

  async set(config: TrialCueComponentConfig) {
    this.animate = 'fade-out';
    // This delay prevents the cues from changing mid-animation.
    await timer(FADE_OUT_DURATION_MS).toPromise();
    this.disabled = false;
    this.config = config;
    this.animate = 'fade-in';
  }
}
