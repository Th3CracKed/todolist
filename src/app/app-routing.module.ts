import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'list/add',
    loadChildren: () => import('./addList/addList.module').then( m => m.AddListPageModule)
  },
  {
    path: 'list/:id',
    loadChildren: () => import('./todos-list/todos-list.module').then( m => m.TodosListPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
