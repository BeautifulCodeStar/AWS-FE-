import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankComponent } from './rank/rank.component';
import { AsinComponent } from './asin/asin.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', redirectTo: '/rank', pathMatch: 'full'},
  { path: 'rank', component: RankComponent },
  { path: 'asin', component: AsinComponent },
  { path: 'product/details', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class Ng2MultiStepFormRoutingModule { }
