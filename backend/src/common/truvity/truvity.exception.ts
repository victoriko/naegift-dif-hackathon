export class TruvityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TruvityException';
  }
}
