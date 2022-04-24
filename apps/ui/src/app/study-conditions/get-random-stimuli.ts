import { sample } from 'lodash-es';
import { OneHundredNonWordTrigramsFilteredByFrequency } from './one-hundred-non-word-trigrams-filtered-by-frequency';
import { STIMULUS_CASE, StimulusCase } from './stimulus-case';

export function getRandomStimulus(stimulusCase: StimulusCase) {
  const trigram = getTrigramOrThrow();
  removeTrigram(trigram)
  return stimulusCase === STIMULUS_CASE.lower ? trigram.toLowerCase() : trigram.toUpperCase();
}

function removeTrigram(trigram: string) {
  const index = OneHundredNonWordTrigramsFilteredByFrequency.indexOf(trigram);
  OneHundredNonWordTrigramsFilteredByFrequency.splice(index, 1);
}

function getTrigramOrThrow() {
  const trigram = sample(OneHundredNonWordTrigramsFilteredByFrequency);
  if (!trigram) throw Error('Random value returned "undefined"!');
  return trigram;
}

