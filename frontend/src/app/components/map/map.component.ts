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
  style = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: `Map tiles by <a target='_top' rel='noopener' href='https://tile.openstreetmap.org/'>
          OpenStreetMap tile servers</a>, under the <a target='_top' rel='noopener'
          href='https://operations.osmfoundation.org/policies/tiles/'>tile usage policy</a>.
          Data by <a target='_top' rel='noopener' href='http://openstreetmap.org'>OpenStreetMap</a>`
      }
    },
    layers: [{
      id: 'osm',
      type: 'raster',
      source: 'osm',
    }],
  };
  lng = 8.1;
  lat = 47.32;
  zoom = 11;

  constructor(private markersService: MarkersService) { this.markersService = markersService; }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style as any,
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
