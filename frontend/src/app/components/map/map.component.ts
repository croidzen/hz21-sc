import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map = undefined as unknown as mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng = 14.5;
  lat = 47.6;
  zoom = 8;

  constructor() { }

  ngOnInit() {
    this.map = new mapboxgl.Map({
        accessToken: environment.mapboxAccessToken,
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  }
}
