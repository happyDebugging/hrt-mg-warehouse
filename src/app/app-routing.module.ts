import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { UnsavedChangesGuard } from './unsaved-changes/unsaved-changes.guard';
import { LoggedInGuard } from './auth/logged-in.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent, pathMatch: 'full', canActivate: [LoggedInGuard]}, 
  { path: 'reset-password/session/:session-id', pathMatch: 'full', component: ResetPasswordComponent},

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  {path: 'mountain/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard]},
  {path: 'mountain/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'mountain/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'water/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard] },
  {path: 'water/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'water/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'disaster/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard] },
  {path: 'disaster/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'disaster/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'firstAid/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard] },
  {path: 'firstAid/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'firstAid/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'communications/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard] },
  {path: 'communications/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'communications/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'socialCare/material-lines', component: MaterialLinesComponent, canActivate: [AuthGuard] },
  {path: 'socialCare/material-lines/item', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},
  {path: 'socialCare/material-lines/item/:serial-number', component: MaterialDetailsComponent, canActivate: [AuthGuard], canDeactivate: [UnsavedChangesGuard]},

  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] }, // redirect to `app-component`  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
  { path: '**', pathMatch: 'full', redirectTo: '', canActivate: [AuthGuard]},  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

