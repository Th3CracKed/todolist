import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'addtodo',
    loadChildren: () => import('./addtodo/addtodo.module').then( m => m.AddtodoPageModule)
  },  {
    path: 'help',
    loadChildren: () => import('./tutorial/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./home/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'addlist',
    loadChildren: () => import('./home/addlist/addlist.module').then( m => m.AddlistPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
