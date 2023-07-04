import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';

type ActorType = { id: string; name: string };

type VerbType = {
  id: string;
  display: string;
};

type ObjectType = {
  id: string;
  definition: { name: string };
};

type PlaceType = {
  id: string;
  name: string;
};

type ContextType = {
  id: string;
  extensions: {
    timestamp: string;
    description: string;
    event: string;
    component: string;
  };
};

export type Source = {
  id: string;
  name: string;
  type: string;
};

export type Recipe = {
  name: string;
  actors: ActorType[];
  verbs: VerbType[];
  objects: ObjectType[];
  places: PlaceType[];
  contexts: ContextType[];
};

export type Statement = {
  id: string;
  actor: ActorType;
  verb: VerbType;
  object: ObjectType;
  place: PlaceType;
  context: ContextType;
};

export type GetSourceDto = {
  source: Source;
  recipe?: Recipe;
  statements: Statement[];
};
@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  API_URL = `${environment.PLATAFORM_DATA_EXTRACTOR_API_URL}/sources`;
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
      .get<GetSourceDto>(`${this.API_URL}/${sourceId}`, { params })
      .pipe(
        take(1),
        map((response) => response)
      );
  }
}
