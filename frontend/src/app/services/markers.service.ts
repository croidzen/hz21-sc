import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point, Position } from 'geojson';
import * as coordinates from '../../../../coordinates.json'

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
        }});
    }

    const geoJsonObject = {
      type: 'FeatureCollection',
      features: arrayOfPoints.slice(0, 10000)
    }

    return geoJsonObject;
  }

  getMarkers(): Observable<{}> {
    return new Observable(observer => {
      const geoJsonData = this._transformJsontoGeoJson(coordinates);
      observer.next(geoJsonData);
    })
  }
}
