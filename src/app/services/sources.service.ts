import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
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

  #sourceId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get sourceId$() {
    if (this.#sourceId.getValue() === '') {
      const sourceId = localStorage.getItem('sourceId');
      if (sourceId) {
        this.#sourceId.next(sourceId);
      }
    }
    return this.#sourceId.asObservable();
  }

  constructor(private readonly http: HttpClient) {}

  createSource(file: File) {
    const formData = new FormData();
    formData.append('source', file);

    return this.http.post<{ id: string }>(this.#API_URL, formData).pipe(
      take(1),
      map((response) => {
        this.#sourceId.next(response.id);
        localStorage.setItem('sourceId', response.id);
        return response;
      })
    );
  }

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
        map((response) => response),
        catchError((error) => {
          localStorage.removeItem('sourceId');
          throw error;
        })
      );
  }
}
