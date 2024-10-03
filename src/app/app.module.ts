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

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    AdminComponent,
    MaterialDetailsComponent,
    MaterialLinesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink, 
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
