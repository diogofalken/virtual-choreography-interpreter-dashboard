import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SourcesService } from 'src/app/services/sources.service';

type Statement = {
  id: string;
  actor: string;
  verb: string;
  object: string;
  place: string;
};
@Component({
  selector: 'app-log-statements',
  templateUrl: './log-statements.component.html',
  styleUrls: ['./log-statements.component.scss'],
})
export class LogStatementsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'actor', 'verb', 'object', 'place'];
  dataSource = new MatTableDataSource<Statement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly sourcesService: SourcesService) {}

  ngOnInit(): void {
    this.sourcesService
      .getSource('0965c2fe-ca3a-4d57-8c4a-9c8b8ad7ac91', { statements: true })
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.statements.map((s) => ({
            id: s.id,
            actor: s.actor.name,
            verb: s.verb.display,
            object: s.object.definition.name,
            place: s.place.name,
          }));
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
