import { ComponentType } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IdDialogComponent } from '@known-unknowns-multiple-exemplar-experiment/ng/ui-id-dialog';
import { Condition } from '@known-unknowns-multiple-exemplar-experiment/shared/util-ick';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { timer } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import {
  BlockButtonDialogComponent, BlockButtonDialogData,
} from '../block/block-button-dialog/block-button-dialog.component';
import { fullScreenDialogWithData } from '../block/full-screen-dialog-with-data';
import { OneToManyBlockComponent } from '../block/one-to-many-block-component/one-to-many-block.component';
import { TRIAL_DELAY_INTERVAL_MS } from '../block/trial-animation-delay';
import { ReportStatus } from '../report/report-status';
import { ReportService } from '../report/report.service';
import { StudyConfigService } from '../study-config-form/study-config.service';
import { SurveyService } from '../survey/survey.service';
import { STUDY_INSTRUCTIONS } from './study-instructions';

@UntilDestroy()
@Component({
  selector: 'study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
  providers: [],
})
export class StudyComponent implements OnInit {
  abandonmentEnabled = false;
  blocksAndBoolean: { block: ComponentType<OneToManyBlockComponent>, ick: boolean }[] = [];
  complete = false;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container?: ViewContainerRef;
  instructions = STUDY_INSTRUCTIONS;
  showInstructions = true;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialog: MatDialog,
    private reportSvc: ReportService,
    readonly studyConfigSvc: StudyConfigService,
    private surveySvc: SurveyService,
  ) {
  }

  addBlocks() {
    const { config } = this.studyConfigSvc;

    if (config.condition === Condition.withIck) {

      this.blocksAndBoolean = [
        {
          block: OneToManyBlockComponent,
          ick: true,
        },
      ];

    } else if (config.condition === Condition.withoutIck) {

      this.blocksAndBoolean = [
        {
          block: OneToManyBlockComponent,
          ick: false,
        },
      ];

    } else {

      this.blocksAndBoolean = [
        {
          block: OneToManyBlockComponent,
          ick: false,
        },
        {
          block: OneToManyBlockComponent,
          ick: true,
        },
      ];

    }
  }

  createBlockComponent(blockComponent: ComponentType<OneToManyBlockComponent>, ick: boolean) {
    if (!this.container) throw Error('Container is undefined');
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(blockComponent);
    this.container.clear();
    const componentRef = this.container.createComponent(componentFactory);
    const blockInstance = componentRef.instance;
    blockInstance.studyConfig = this.studyConfigSvc.config;
    blockInstance.ick = ick;

    blockInstance.started.pipe(first(), untilDestroyed(this)).subscribe(() => this.abandonmentEnabled = true);

    blockInstance.completed.pipe(first(), tap(({ failed }) => {
      this.abandonmentEnabled = false;
      if (failed && this.blocksAndBoolean.length === 0) {
        this.showCompleteDialog('failed');
      } else if (this.blocksAndBoolean.length) {
        this.nextBlock();
        this.reportSvc.sendReport('block').then();
      } else {
        this.showCompleteDialog('complete');
      }
    }), untilDestroyed(this)).subscribe();

  }

  nextBlock() {
    this.showInstructions = false;
    const blockAndIck = this.blocksAndBoolean.shift();
    if (!blockAndIck) throw Error('Block is undefined');
    const { block, ick } = blockAndIck;
    this.createBlockComponent(block, ick);
  }

  ngOnInit() {

    this.dialog.open(IdDialogComponent, { disableClose: true }).afterClosed().pipe(
      tap((id) => this.reportSvc.prolificId = id),
      switchMap(() => this.studyConfigSvc.loadStudyConfigFromParams()),
    ).subscribe();
  }

  showCompleteDialog(status: ReportStatus) {
    const { participantId } = this.studyConfigSvc;
    const text = status === 'abandoned' ? `STUDY ABANDONED!\n\n PARTICIPANT ID:\n ${participantId}` :
      `THANKS FOR PARTICIPATING!\n\n PARTICIPANT ID:\n ${participantId}`;
    this.complete = true;
    this.container?.clear();
    timer(TRIAL_DELAY_INTERVAL_MS).pipe(
      first(),
      switchMap(() => this.reportSvc.sendReport(status)),
      switchMap(() => status !== 'abandoned' ? this.surveySvc.showPostSurvey(participantId) : [text]),
      switchMap(() => this.dialog.open(BlockButtonDialogComponent,
        fullScreenDialogWithData<BlockButtonDialogData>({ text, disableClose: true })).afterClosed()),
    ).subscribe();
  }

  showPreSurvey() {
    this.surveySvc.showPreSurvey(this.studyConfigSvc.participantId).subscribe(() => {
      this.addBlocks();
      this.nextBlock();
    });
  }

}
