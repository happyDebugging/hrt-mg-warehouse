import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },

  {path: 'mountain/material-lines', component: MaterialLinesComponent},
  {path: 'mountain/material-lines/item', component: MaterialDetailsComponent},

  { path: 'water/material-lines', component: MaterialLinesComponent },
  {path: 'water/material-lines/item', component: MaterialDetailsComponent},

  { path: 'disaster/material-lines', component: MaterialLinesComponent },
  {path: 'disaster/material-lines/item', component: MaterialDetailsComponent},

  { path: 'firstAid/material-lines', component: MaterialLinesComponent },
  {path: 'firstAid/material-lines/item', component: MaterialDetailsComponent},

  { path: 'communications/material-lines', component: MaterialLinesComponent },
  {path: 'communications/material-lines/item', component: MaterialDetailsComponent},

  { path: 'socialCare/material-lines', component: MaterialLinesComponent },
  {path: 'socialCare/material-lines/item', component: MaterialDetailsComponent},

  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: '**', pathMatch: 'full' }, // redirect to `app-component`  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  { path: '**', component: HomeComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

