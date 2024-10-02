import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: 'mountain/material-lines', component: MaterialLinesComponent },
  { path: 'water/material-lines', component: MaterialLinesComponent },
  { path: 'disaster/material-lines', component: MaterialLinesComponent },
  { path: 'firstAid/material-lines', component: MaterialLinesComponent },
  { path: 'communications/material-lines', component: MaterialLinesComponent },
  { path: 'socialCare/material-lines', component: MaterialLinesComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

