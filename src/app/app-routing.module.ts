import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'list/add',
    loadChildren: () => import('./home/add-list/add-list.module').then( m => m.AddlistPageModule)
  },
  {
    path: 'list/:id',
    loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
