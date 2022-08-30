import { sample } from 'lodash-es';
import { TWO_HUNDRED_NON_WORD_TRIGRAMS } from './two_hundred-trigrams';
import { STIMULUS_CASE, StimulusCase } from './stimulus-case';

export function getRandomStimulus(stimulusCase: StimulusCase) {
  const trigram = getTrigramOrThrow();
  removeTrigram(trigram)
  return stimulusCase === STIMULUS_CASE.lower ? trigram.toLowerCase() : trigram.toUpperCase();
}

function removeTrigram(trigram: string) {
  const index = TWO_HUNDRED_NON_WORD_TRIGRAMS.indexOf(trigram);
  TWO_HUNDRED_NON_WORD_TRIGRAMS.splice(index, 1);
}

function getTrigramOrThrow() {
  const trigram = sample(TWO_HUNDRED_NON_WORD_TRIGRAMS);
  if (!trigram) throw Error('Random value returned "undefined"!');
  return trigram;
}

