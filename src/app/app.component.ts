import { Component, OnInit } from '@angular/core';
import { GetSourceDto, SourcesService } from './services/sources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'virtual-choreography-interpreter-dashboard';

  source?: GetSourceDto['source'];
  recipe: GetSourceDto['recipe'];

  constructor(private readonly sourcesService: SourcesService) {}

  ngOnInit(): void {
    this.sourcesService
      .getSource('87c2479b-83be-438d-baa8-b6857ed1a459', { recipe: true })
      .subscribe({
        next: (response) => {
          this.source = response.source;
          this.recipe = response.recipe;
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
