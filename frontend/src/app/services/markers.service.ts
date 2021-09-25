import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Point, Position } from 'geojson';
import { HttpClient } from '@angular/common/http';
import * as coordinates from '../../../../coordinates.json';
import * as segmentsExample from '../../../../segments_example.json';
import Details from '../models/details';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  constructor(private httpClient: HttpClient) { }

  private _transformJsontoGeoJson(input: Object): {} {
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

  private _transformSegmentsExampleToGeoJson(input: Object): {} {
    let arrayOfPoints = [];
    for (const [key, value] of Object.entries(input)) {
      arrayOfPoints.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [value.Longitude, value.Latitude] as Position
        },
        properties: {
          A2_RSSI: Number.parseFloat(value.A2_RSSI),
          segment: key,
          longitude: value.Longitude,
          latitude: value.Latitude,
        }
      });
    }

    const geoJsonObject = {
      type: 'FeatureCollection',
      features: arrayOfPoints
    }

    return geoJsonObject;
  }

  _httpGetMarkers(): Observable<{}> {
    return this.httpClient.get<{}>(`${environment.apiUrl}/getMarkers`);
  }

  _httpGetSegmentDetails(): Observable<Details> {
    return this.httpClient.get<Details>(`${environment.apiUrl}/getSegmentDetails`);
  }

  getMarkers(): Observable<{}> {
    return new Observable(observer => {
      const geoJsonData = this._transformSegmentsExampleToGeoJson(segmentsExample);
      observer.next(geoJsonData);
    })
  }

  getMockSegmentDetails(segmentNumber: number): Observable<Details> {
    return new Observable(observer => {
      const details = new Details(
        'High', '26-09-2021', segmentNumber, 0, 0
      );
      observer.next(details);
    })
  }
}
