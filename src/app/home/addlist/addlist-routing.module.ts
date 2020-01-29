import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddlistPage } from './addlist.page';

const routes: Routes = [
  {
    path: '',
    component: AddlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddlistPageRoutingModule {}
