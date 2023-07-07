import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChoreographiesComponent } from './pages/choreographies/choreographies.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogStatementsComponent } from './pages/log-statements/log-statements.component';
import { RecipeComponent } from './pages/recipe/recipe.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'recipe',
    component: RecipeComponent,
  },
  {
    path: 'log-statements',
    component: LogStatementsComponent,
  },
  {
    path: 'choreographies',
    component: ChoreographiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
