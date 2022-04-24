/**
 * Represents a node in a graph.
 */
export class Node {

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  toString(): string {
    return this.name;
  }

}
