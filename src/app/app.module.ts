import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { MaterialLinesComponent } from './material-lines/material-lines.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    AdminComponent,
    MaterialDetailsComponent,
    MaterialLinesComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
