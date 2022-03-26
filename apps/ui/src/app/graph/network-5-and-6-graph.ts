import { Inject, Injectable } from '@angular/core';
import { getRandomStimulus } from '../study-conditions/get-random-stimuli';
import { StimulusCase } from '../study-conditions/stimulus-case';
import { STIMULUS_CASE } from '../study/study.module';
import { RelationType } from './relation-type';
import { RelationalEdge } from './relational-edge';
import { RelationalFrameGraph } from './relational-frame-graph';
import { RelationalFrameGraphConfig } from './relational-frame-graph-config';
import { RelationalNode } from './relational-node';
import { SAME_GT_LT_ICK_GRAPH_CONFIG } from './same-gt-lt-ick-graph-config';

@Injectable({
  providedIn: 'root'
})
export class Network5And6Graph extends RelationalFrameGraph {

  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig
  ) {
    super(relationalFrameGraphConfig);

    // Network 5 - known network
    const nodeA5 = new RelationalNode('A', 5, getRandomStimulus(stimulusCase));
    const nodeB5 = new RelationalNode('B', 5, getRandomStimulus(stimulusCase));
    const nodeC5 = new RelationalNode('C', 5, getRandomStimulus(stimulusCase));

    // Add nodes for network 5
    this.addNode(nodeA5);
    this.addNode(nodeB5);
    this.addNode(nodeC5);

    // Set A5 = B5 = C5
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA5, nodeB5, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA5, nodeC5, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB5, nodeC5, 'same', RelationType.trained));

    // Network 6 - A6 > B6 > C6
    const nodeA6 = new RelationalNode('A', 6, getRandomStimulus(stimulusCase));
    const nodeB6 = new RelationalNode('B', 6, getRandomStimulus(stimulusCase));
    const nodeC6 = new RelationalNode('C', 6, getRandomStimulus(stimulusCase));

    // Add nodes for network 6
    this.addNode(nodeA6);
    this.addNode(nodeB6);
    this.addNode(nodeC6);

    // Set A6 > B6 > C6
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA6, nodeB6, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA6, nodeC6, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB6, nodeC6, 'greaterThan', RelationType.trained));
  }

}
