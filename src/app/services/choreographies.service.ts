import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
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

  constructor(private readonly http: HttpClient) {}

  getChoreographies(sourceId: string) {
    const params = new HttpParams().append('sourceId', sourceId);

    return this.http.get<GetChoreographiesDto>(this.#API_URL, { params }).pipe(
      take(1),
      map((response) => response)
    );
  }
}
