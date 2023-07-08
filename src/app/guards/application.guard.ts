import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SourcesService } from '../services/sources.service';

export const applicationGuard: CanActivateFn = (route, state) => {
  const sourcesService = inject(SourcesService);
  const router = inject(Router);

  return sourcesService.sourceId$.pipe(
    map((sourceId) => {
      if (sourceId === '') {
        router.navigateByUrl('/source-not-found');
        return false;
      }
      return true;
    })
  );
};
