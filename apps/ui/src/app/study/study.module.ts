import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BlockModule } from '../block/block.module';
import { OneToManyBlockModule } from '../block/one-to-many-block-component/one-to-many-block.module';
import { Network1And2Graph } from '../graph/network-1-and-2-graph';
import { Network3And4Graph } from '../graph/network-3-and-4-graph';
import { Network5And6Graph } from '../graph/network-5-and-6-graph';
import { OneToManyGraphService } from '../graph/one-to-many-graph.service';
import { randomStimulusCase } from '../study-conditions/random-stimulus-case';
import { SurveyModule } from '../survey/survey.module';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';

export const STIMULUS_CASE = new InjectionToken('Stimulus case');

@NgModule({
  declarations: [
    StudyComponent,
  ],
  exports: [
    StudyComponent,
  ],
  imports: [
    BlockModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    OneToManyBlockModule,
    StudyRoutingModule,
    SurveyModule,
  ],
  providers: [
    Network1And2Graph,
    Network3And4Graph,
    Network5And6Graph,
    OneToManyGraphService,
    { provide: STIMULUS_CASE, useValue: randomStimulusCase() },
  ],
})
export class StudyModule {}
