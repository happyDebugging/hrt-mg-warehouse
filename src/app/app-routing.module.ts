import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthComponent] },

  {path: 'mountain/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent]},
  {path: 'mountain/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'water/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent] },
  {path: 'water/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'disaster/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent] },
  {path: 'disaster/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'firstAid/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent] },
  {path: 'firstAid/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'communications/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent] },
  {path: 'communications/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'socialCare/material-lines', component: MaterialLinesComponent, canActivate: [AuthComponent] },
  {path: 'socialCare/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthComponent]},

  { path: 'history', component: HistoryComponent, canActivate: [AuthComponent] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthComponent] },
  { path: '', redirectTo: '**', pathMatch: 'full' }, // redirect to `app-component`  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  //{ path: '**', component: HomeComponent, canActivate: [AuthComponent] },  // Wildcard route for a 404 page
  { path: '**', component: AuthComponent},  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

