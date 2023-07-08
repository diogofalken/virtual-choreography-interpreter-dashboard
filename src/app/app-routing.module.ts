import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { applicationGuard } from './guards/application.guard';
import { ChoreographiesComponent } from './pages/choreographies/choreographies.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogStatementsComponent } from './pages/log-statements/log-statements.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { SourceNotFoundComponent } from './pages/source-not-found/source-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [applicationGuard],
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [applicationGuard],
  },
  {
    path: 'log-statements',
    component: LogStatementsComponent,
    canActivate: [applicationGuard],
  },
  {
    path: 'choreographies',
    component: ChoreographiesComponent,
    canActivate: [applicationGuard],
  },
  {
    path: 'source-not-found',
    component: SourceNotFoundComponent,
  },
  { path: '**', redirectTo: 'source-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
