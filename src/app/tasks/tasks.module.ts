import { NgModule } from '@angular/core';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    SharedModule,
    TasksPageRoutingModule
  ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
