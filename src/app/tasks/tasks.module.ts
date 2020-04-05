import { NgModule } from '@angular/core';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { SharedModule } from '../shared.module';
import {MainPageModule} from '../home/main/main.module';

@NgModule({
    imports: [
        SharedModule,
        TasksPageRoutingModule,
        MainPageModule
    ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
