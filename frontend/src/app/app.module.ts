import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapComponent } from './components/map/map.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { HttpClientModule } from '@angular/common/http';
import { MarkersService, MockMarkersService } from './services/markers.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    OverlayComponent,
    DetailViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: MarkersService, useClass: MockMarkersService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
