import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SourcesService } from '../../services/sources.service';

@Component({
  selector: 'app-source-not-found',
  templateUrl: './source-not-found.component.html',
  styleUrls: [],
})
export class SourceNotFoundComponent implements OnInit {
  constructor(
    private readonly sourcesService: SourcesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.sourcesService.sourceId$.subscribe((sourceId) => {
      if (sourceId !== '') {
        this.router.navigateByUrl('/');
      }
    });
  }
}
