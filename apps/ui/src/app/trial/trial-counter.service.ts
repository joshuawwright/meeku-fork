import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrialCounterService {
  #count = 0;

  get showColorTrial() {
    return this.#count === 100;
  }

  increase() {
    this.#count++;
  }

  reset() {
    this.#count = 0;
  }
}
