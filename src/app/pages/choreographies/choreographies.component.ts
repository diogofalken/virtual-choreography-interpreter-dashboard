import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { StatementsHelper } from '../../helpers/statements.helper';
import { ChoreographiesService } from '../../services/choreographies.service';
import { Statement } from '../../types/core.types';

@Component({
  selector: 'app-choreographies',
  templateUrl: './choreographies.component.html',
  styleUrls: ['./choreographies.component.scss'],
})
export class ChoreographiesComponent implements OnInit {
  choreographies: Map<
    string,
    { naturalLanguage: string; statement: Statement }[][]
  > = new Map();
  tabs: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly choreographiesService: ChoreographiesService) {}

  ngOnInit(): void {
    this.choreographiesService
      .getChoreographies('0965c2fe-ca3a-4d57-8c4a-9c8b8ad7ac91')
      .subscribe({
        next: (response) => {
          for (const choreography of response) {
            this.addToChoreographiesMap(choreography);
          }

          this.tabs = Array.from(this.choreographies.keys());
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private addToChoreographiesMap(choreography: {
    name: string;
    statements: Statement[];
  }) {
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
}
