import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MarkersService } from 'src/app/services/markers.service';
import { OverlayService } from 'src/app/services/overlay.service';
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
  markerVisibilityThreshold = 0;

  layerConfigurations = [
    {
      name: 'layer-high',
      imageName: 'marker-red',
      A2_RSSIBoundary: [1.2, 0.9],
    },
    {
      name: 'layer-med',
      imageName: 'marker-orange',
      A2_RSSIBoundary: [1.6, 1.2],
    },
    {
      name: 'layer-other',
      imageName: 'marker-green',
      A2_RSSIBoundary: [3, 1.6],
    },
  ];

  constructor(private markersService: MarkersService, private overlayService: OverlayService) {
    this.markersService = markersService;
    this.overlayService = overlayService;
  }

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
          });
        }))
      ).then(() => {
        this.markersService.getMarkers().subscribe(geoJson => {
          this.map.addSource('points', {
            type: 'geojson',
            data: geoJson as any,
            filter: [">", ["get", "A2_RSSI"], this.markerVisibilityThreshold]
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
								['>', 'A2_RSSI', layerConfig.A2_RSSIBoundary[1]],
								['<=', 'A2_RSSI', layerConfig.A2_RSSIBoundary[0]],
							]
            })
          });
        })
        this.setupEventHandlers();
      })
    });
  }

  setupEventHandlers() {
    const layers = this.map.getStyle().layers;

    const intLayers = layers!.reduce((array: number[], layer, index) => {
      if(layer.id.includes('layer-'))
          array.push(index);
      return array;
    }, []);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    for (let i = 0; i < intLayers.length; i++) {
      const currentLayer = layers![intLayers[i]];

      this.map.on('click', currentLayer.id, (e) => {
        const props = e.features![0].properties
          console.log(e.features![0]);
          this.overlayService.showOverlayForSegment(props?.segment, props?.longitude, props?.latitude);
      });

      this.map.on('mouseenter', currentLayer.id, (e) => {
          this.map.getCanvas().style.cursor = 'pointer';

          const coordinates = ((e.features as mapboxgl.MapboxGeoJSONFeature[])[0].geometry as any).coordinates.slice();

          let htmlPopup = "<div style='text-align: center;'>";

          const elementsToShow = ['segment', 'A2_RSSI'];

          for (const element in (e.features as mapboxgl.MapboxGeoJSONFeature[])[0].properties) {
              if (elementsToShow.includes(element)) {
                  htmlPopup += `${element}: ${e.features![0].properties![element]}<br>`;
              }
          };
          htmlPopup += "</div>";

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates).setHTML(htmlPopup).addTo(this.map);
      });

      this.map.on('mouseleave', currentLayer.id, () => {
          this.map.getCanvas().style.cursor = '';
          popup.remove();
      });
  }

  }
}
