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
  providedIn: 'root',
})
export class OneToManyGraphService extends RelationalFrameGraph {

  ickNetworkNumbers: ReadonlyArray<number> = [7, 8, 9, 10, 11];
  knownNetworkNumbers: ReadonlyArray<number> = [5, 6, 12, 13, 14];

  constructor(
    @Inject(STIMULUS_CASE) private stimulusCase: StimulusCase,
    @Inject(SAME_GT_LT_ICK_GRAPH_CONFIG) private relationalFrameGraphConfig: RelationalFrameGraphConfig,
  ) {
    super(relationalFrameGraphConfig);
    this.includeRelationsBetweenNetworks = false;
    this.createIckNetworks();
    this.createKnownNetworks();
  }

  createIckNetworks() {
    // Network 7 - A7 < B7 > C7
    const nodeA7 = new RelationalNode('A', 7, getRandomStimulus(this.stimulusCase));
    const nodeB7 = new RelationalNode('B', 7, getRandomStimulus(this.stimulusCase));
    const nodeC7 = new RelationalNode('C', 7, getRandomStimulus(this.stimulusCase));

    this.addNode(nodeA7);
    this.addNode(nodeB7);
    this.addNode(nodeC7);

    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA7, nodeB7, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB7, nodeC7, 'greaterThan', RelationType.trained));

    // Network 8 - A8 > B8 < C8
    const nodeA8 = new RelationalNode('A', 8, getRandomStimulus(this.stimulusCase));
    const nodeB8 = new RelationalNode('B', 8, getRandomStimulus(this.stimulusCase));
    const nodeC8 = new RelationalNode('C', 8, getRandomStimulus(this.stimulusCase));

    this.addNode(nodeA8);
    this.addNode(nodeB8);
    this.addNode(nodeC8);

    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA8, nodeB8, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB8, nodeC8, 'lessThan', RelationType.trained));

    // Network 9 - A9 < B9 > C9
    const nodeA9 = new RelationalNode('A', 9, getRandomStimulus(this.stimulusCase));
    const nodeB9 = new RelationalNode('B', 9, getRandomStimulus(this.stimulusCase));
    const nodeC9 = new RelationalNode('C', 9, getRandomStimulus(this.stimulusCase));

    this.addNode(nodeA9);
    this.addNode(nodeB9);
    this.addNode(nodeC9);

    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA9, nodeB9, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB9, nodeC9, 'greaterThan', RelationType.trained));

    // Network 10 - A10 > B10 < C10
    const nodeA10 = new RelationalNode('A', 10, getRandomStimulus(this.stimulusCase));
    const nodeB10 = new RelationalNode('B', 10, getRandomStimulus(this.stimulusCase));
    const nodeC10 = new RelationalNode('C', 10, getRandomStimulus(this.stimulusCase));

    this.addNode(nodeA10);
    this.addNode(nodeB10);
    this.addNode(nodeC10);

    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA10, nodeB10, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB10, nodeC10, 'lessThan', RelationType.trained));

    // Network 9 - A11 > B11 < C11
    const nodeA11 = new RelationalNode('A', 11, getRandomStimulus(this.stimulusCase));
    const nodeB11 = new RelationalNode('B', 11, getRandomStimulus(this.stimulusCase));
    const nodeC11 = new RelationalNode('C', 11, getRandomStimulus(this.stimulusCase));

    this.addNode(nodeA11);
    this.addNode(nodeB11);
    this.addNode(nodeC11);

    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA11, nodeB11, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB11, nodeC11, 'lessThan', RelationType.trained));
  }

  createKnownNetworks() {
    // Network 5 - A5 = B5 = C5
    const nodeA5 = new RelationalNode('A', 5, getRandomStimulus(this.stimulusCase));
    const nodeB5 = new RelationalNode('B', 5, getRandomStimulus(this.stimulusCase));
    const nodeC5 = new RelationalNode('C', 5, getRandomStimulus(this.stimulusCase));

    // Add nodes for network 5
    this.addNode(nodeA5);
    this.addNode(nodeB5);
    this.addNode(nodeC5);

    // Set A5 = B5 = C5
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA5, nodeB5, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA5, nodeC5, 'same', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB5, nodeC5, 'same', RelationType.trained));

    // Network 6 - A6 > B6 > C6
    const nodeA6 = new RelationalNode('A', 6, getRandomStimulus(this.stimulusCase));
    const nodeB6 = new RelationalNode('B', 6, getRandomStimulus(this.stimulusCase));
    const nodeC6 = new RelationalNode('C', 6, getRandomStimulus(this.stimulusCase));

    // Add nodes for network 6
    this.addNode(nodeA6);
    this.addNode(nodeB6);
    this.addNode(nodeC6);

    // Set A6 > B6 > C6
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA6, nodeB6, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA6, nodeC6, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB6, nodeC6, 'greaterThan', RelationType.trained));

    // Network 12 - A12 < B12 < C12
    const nodeA12 = new RelationalNode('A', 12, getRandomStimulus(this.stimulusCase));
    const nodeB12 = new RelationalNode('B', 12, getRandomStimulus(this.stimulusCase));
    const nodeC12 = new RelationalNode('C', 12, getRandomStimulus(this.stimulusCase));

    // Add nodes for network 12
    this.addNode(nodeA12);
    this.addNode(nodeB12);
    this.addNode(nodeC12);

    // Set A12 < B12 < C12
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA12, nodeB12, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA12, nodeC12, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB12, nodeC12, 'lessThan', RelationType.trained));

    // Network 13 - A13 > B13 = C13
    const nodeA13 = new RelationalNode('A', 13, getRandomStimulus(this.stimulusCase));
    const nodeB13 = new RelationalNode('B', 13, getRandomStimulus(this.stimulusCase));
    const nodeC13 = new RelationalNode('C', 13, getRandomStimulus(this.stimulusCase));

    // Add nodes for network 13
    this.addNode(nodeA13);
    this.addNode(nodeB13);
    this.addNode(nodeC13);

    // Set A13 > B13 = C13
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA13, nodeB13, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA13, nodeC13, 'greaterThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB13, nodeC13, 'same', RelationType.trained));

    // Network 14 - A14 < B14 = C14
    const nodeA14 = new RelationalNode('A', 14, getRandomStimulus(this.stimulusCase));
    const nodeB14 = new RelationalNode('B', 14, getRandomStimulus(this.stimulusCase));
    const nodeC14 = new RelationalNode('C', 14, getRandomStimulus(this.stimulusCase));

    // Add nodes for network 14
    this.addNode(nodeA14);
    this.addNode(nodeB14);
    this.addNode(nodeC14);

    // Set A14 < B14 = C14
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA14, nodeB14, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeA14, nodeC14, 'lessThan', RelationType.trained));
    this.addTrainedAndMutualRelations(new RelationalEdge(nodeB14, nodeC14, 'same', RelationType.trained));
  }

}
