import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { StatementsHelper } from '../helpers/statements.helper';
import { Statement } from '../types/core.types';

export type GetChoreographiesDto = {
  name: string;
  statements: Statement[];
}[];

@Injectable({
  providedIn: 'root',
})
export class ChoreographiesService {
  readonly #API_URL = `${environment.VIRTUAL_CHOREOGRAPHY_MATCHER_API_URL}/choreographies`;

  choreographies: Map<
    string,
    { naturalLanguage: string; statement: Statement }[][]
  > = new Map();

  constructor(private readonly http: HttpClient) {}

  getChoreographies(sourceId: string) {
    const params = new HttpParams().append('sourceId', sourceId);

    return this.http.get<GetChoreographiesDto>(this.#API_URL, { params }).pipe(
      take(1),
      map((response) => {
        this.choreographies.clear();
        this.getChoreographiesMap(response);
        return response;
      })
    );
  }

  getChoreographiesMap(choreographies: GetChoreographiesDto) {
    for (const choreography of choreographies) {
      const cur = this.choreographies.get(choreography.name);

      if (cur) {
        this.choreographies.set(choreography.name, [
          ...cur,
          choreography.statements.map((s) => ({
            naturalLanguage: StatementsHelper.transformNaturalLanguage(s),
            statement: s,
          })),
        ]);
      } else {
        this.choreographies.set(choreography.name, [
          choreography.statements.map((s) => ({
            naturalLanguage: StatementsHelper.transformNaturalLanguage(s),
            statement: s,
          })),
        ]);
      }
    }
    return this.choreographies;
  }
}
