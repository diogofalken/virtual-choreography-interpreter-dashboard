import { Component, OnInit } from '@angular/core';
import { GetSourceDto, SourcesService } from '../../services/sources.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  source?: GetSourceDto['source'];
  recipe: GetSourceDto['recipe'];

  selectedCard: {
    label: 'actors' | 'verbs' | 'objects' | 'places';
    items: string[];
  };

  constructor(private readonly sourcesService: SourcesService) {
    this.selectedCard = {
      label: 'actors',
      items: [],
    };
  }

  ngOnInit(): void {
    this.sourcesService
      .getSource('1647e8c9-b780-4c6a-97ab-97da95e3819c', { recipe: true })
      .subscribe({
        next: (response) => {
          this.source = response.source;
          this.recipe = response.recipe;

          this.selectCard('actors');
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  selectCard(label: 'actors' | 'verbs' | 'objects' | 'places'): void {
    if (!this.recipe) {
      return;
    }

    let items = [];
    switch (label) {
      case 'actors':
        items = this.recipe.actors.map((actor) => actor.name);
        break;
      case 'verbs':
        items = this.recipe.verbs.map((verb) => verb.display);
        break;
      case 'objects':
        items = this.recipe.objects.map((verb) => verb.definition.name);
        break;
      case 'places':
        items = this.recipe.places.map((verb) => verb.name);
        break;
    }

    this.selectedCard.label = label;
    this.selectedCard.items = items;
  }
}
