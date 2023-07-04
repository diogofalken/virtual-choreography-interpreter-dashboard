import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogStatementsComponent } from './pages/log-statements/log-statements.component';
import { RecipeComponent } from './pages/recipe/recipe.component';

const routes: Routes = [
  {
    path: 'recipe',
    component: RecipeComponent,
  },
  {
    path: 'log-statements',
    component: LogStatementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
