import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { DbFunctionService } from './shared/services/db-functions.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { UnsavedChangesGuard } from './unsaved-changes/unsaved-changes.guard';
import { UnsavedChangesComponent } from './unsaved-changes/unsaved-changes.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    AdminComponent,
    MaterialDetailsComponent,
    MaterialLinesComponent,
    HomeComponent,
    AuthComponent,
    UnsavedChangesComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink, 
    RouterOutlet,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DbFunctionService,
    AuthGuard,
    LoggedInGuard,
    AuthService,
    UnsavedChangesGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
