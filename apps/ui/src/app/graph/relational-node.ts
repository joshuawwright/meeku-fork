export class RelationalNode {
  constructor(readonly name: string, readonly network: number, value = '') {
    this._value = value;
  }

  private _value: string;

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  toString(): string {
    return `${this.name}${this.network}`;
  }
}
