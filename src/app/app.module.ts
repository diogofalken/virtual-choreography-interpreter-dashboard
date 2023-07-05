import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SourcesService } from './services/sources.service';

import { NgChartsModule } from 'ng2-charts';
import { ChoreographiesComponent } from './pages/choreographies/choreographies.component';
import { LogStatementsComponent } from './pages/log-statements/log-statements.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ChoreographiesService } from './services/choreographies.service';

@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent,
    LogStatementsComponent,
    ChoreographiesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    NgChartsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
  ],
  providers: [SourcesService, HttpClientModule, ChoreographiesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
