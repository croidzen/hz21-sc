import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MarkersService } from 'src/app/services/markers.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map = undefined as unknown as mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng = 8.05;
  lat = 47.3;
  zoom = 10;

  constructor(private markersService: MarkersService) { this.markersService = markersService; }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('style.load', () => {
      this.map.loadImage('assets/mapbox-marker-icon-20px-red.png', (error, image) => {
        if (error || image == undefined) throw error;
        this.map.addImage('defaultImage', image);

        const mockPoints = {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {
                "probability": 0.5
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  8.43475341796875,
                  46.822616668804926
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {
                "probability": 0.5
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  8.1903076171875,
                  46.87145819560722
                ]
              }
            }
          ]
        }


        this.markersService.getMarkers().subscribe(geoJson => {
          this.map.addSource('points', {
            type: 'geojson',
            data: geoJson as any
          });

          this.map.addLayer({
            'id': 'layer1',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'defaultImage',
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            },
          });
        })
      })
    });
  }
}
