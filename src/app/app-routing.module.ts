import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./tutorial/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'list/add',
    loadChildren: () => import('./addList/addList.module').then( m => m.AddListPageModule)
  },
  {
    path: 'list/:id',
    loadChildren: () => import('./todos-list/todos-list.module').then( m => m.TodosListPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./home/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'addlist',
    loadChildren: () => import('./home/addlist/addlist.module').then( m => m.AddlistPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./todo/tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./todo/add-task/add-task.module').then( m => m.AddTaskPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
