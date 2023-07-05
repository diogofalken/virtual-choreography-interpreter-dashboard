import { Statement } from '../types/core.types';

export class StatementsHelper {
  static transformNaturalLanguage(s: Statement): string {
    return `O ${s.actor.name} ${s.verb.display} ${s.object.definition.name} no ${s.place.name}`;
  }
}
