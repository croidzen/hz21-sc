import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point, Position } from 'geojson';
import * as coordinates from '../../../../coordinates.json';
import * as segmentsExample from '../../../../segments_example.json';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  constructor() { }

  _transformJsontoGeoJson(input: Object): {} {
    let arrayOfPoints = [];
    for (const [key, value] of Object.entries(input)) {
        arrayOfPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number.parseFloat(value), Number.parseFloat(key)] as Position
          },
          properties: {
            A2_RSSI: Math.random(),
            segment: Math.round(Math.random() * 330)
          }
        });
    }

    const geoJsonObject = {
      type: 'FeatureCollection',
      features: arrayOfPoints.slice(0, 100)
    }

    return geoJsonObject;
  }

  _transformSegmentsExampleToGeoJson(input: Object): {} {
    let arrayOfPoints = [];
    for (const [key, value] of Object.entries(input)) {
        arrayOfPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number.parseFloat(value.Longitude), Number.parseFloat(value.Latitude)] as Position
          },
          properties: {
            A2_RSSI: Number.parseFloat(value.A2_RSSI),
            segment: key,
          }
        });
    }

    const geoJsonObject = {
      type: 'FeatureCollection',
      features: arrayOfPoints
    }

    return geoJsonObject;
  }

  getMarkers(): Observable<{}> {
    return new Observable(observer => {
      const geoJsonData = this._transformSegmentsExampleToGeoJson(segmentsExample);
      observer.next(geoJsonData);
    })
  }
}
