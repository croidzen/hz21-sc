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

  imagesToLoad = [
    {
      url: 'assets/mapbox-marker-icon-20px-red.png',
      name: 'marker-red'
    },
    {
      url: 'assets/mapbox-marker-icon-20px-orange.png',
      name: 'marker-orange'
    },
    {
      url: 'assets/mapbox-marker-icon-20px-green.png',
      name: 'marker-green'
    },
  ]

  // The probability that needs to be passed to be rendered on the map.
  markerVisibilityThreshold = 0.6;

  layerConfigurations = [
    {
      name: 'layer-high',
      imageName: 'marker-red',
      probabilityBoundary: [1, 0.8],
    },
    {
      name: 'layer-med',
      imageName: 'marker-orange',
      probabilityBoundary: [0.8, 0.6],
    },
    {
      name: 'layer-other',
      imageName: 'marker-green',
      probabilityBoundary: [0.6, 0],
    },
  ];

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
      Promise.all(
        this.imagesToLoad.map(img => new Promise<void>((resolve, reject) => {
          this.map.loadImage(img.url, (error, res) => {
            this.map.addImage(img.name, res!)
            resolve();
          })
        }))
      ).then(() => {
        this.markersService.getMarkers().subscribe(geoJson => {
          this.map.addSource('points', {
            type: 'geojson',
            data: geoJson as any,
            filter: [">", ["get", "probability"], this.markerVisibilityThreshold]
          });

          this.layerConfigurations.forEach((layerConfig) => {
            this.map.addLayer({
              'id': layerConfig.name,
              'type': 'symbol',
              'source': 'points',
              'layout': {
                'icon-image': layerConfig.imageName,
                'text-font': [
                  'Open Sans Semibold',
                  'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top',
                "icon-allow-overlap": true,
              },
              'filter': [
								"all",
								['>', 'probability', layerConfig.probabilityBoundary[1]],
								['<=', 'probability', layerConfig.probabilityBoundary[0]],
							]
            })
          });
        })
      })
    });
  }
}
