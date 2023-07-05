import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Recipe, Source, Statement } from '../types/core.types';

export type GetSourceDto = {
  source: Source;
  recipe?: Recipe;
  statements: Statement[];
};
@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  readonly #API_URL = `${environment.PLATAFORM_DATA_EXTRACTOR_API_URL}/sources`;
  constructor(private readonly http: HttpClient) {}

  getSource(
    sourceId: string,
    filters: { recipe?: boolean; statements?: boolean }
  ) {
    let params: HttpParams = new HttpParams();

    if (filters.recipe) {
      params = params.append('recipe', filters.recipe);
    }

    if (filters.statements) {
      params = params.append('statements', filters.statements);
    }

    return this.http
      .get<GetSourceDto>(`${this.#API_URL}/${sourceId}`, { params })
      .pipe(
        take(1),
        map((response) => response)
      );
  }
}
