import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from 'geojson';
import { HttpClient } from '@angular/common/http';

import * as segmentsExample from 'src/assets/segments_example.json';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  constructor(private httpClient: HttpClient) { }

  _transformSegmentsExampleToGeoJson(input: Object): {} {
    let arrayOfPoints = [];
    for (const [key, value] of Object.entries(input)) {
      arrayOfPoints.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [value.Longitude, value.Latitude] as Position
        },
        properties: {
          daysUntilFailure: Number.parseFloat(value.A2_RSSI) * 10,
          dateOfFailure: '2021-09-26',
          segmentNo: key,
          longitude: value.Longitude,
          latitude: value.Latitude,
          trackId: 1,
          areaNumber: 100,
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
    return this.httpClient.get<{}>(`${environment.apiUrl}/geoFeature`);
  }

  _httpGetGraphData(segmentNumber: number): Observable<{}> {
    const body = { segmentNumber }
    return this.httpClient.post<{}>(`${environment.apiUrl}/graphRssi`, body);
  }

  getMarkers(): Observable<{}> {
    return this._httpGetMarkers();
  }

  getSegmentGraphData(segmentNumber: number): Observable<{}> {
    return this._httpGetGraphData(segmentNumber);
  }
}

@Injectable()
export class MockMarkersService extends MarkersService {
  getMarkers(): Observable<{}> {
    return new Observable(observer => {
      const geoJsonData = this._transformSegmentsExampleToGeoJson(segmentsExample);
      observer.next(geoJsonData);
    });
  }

  getSegmentGraphData(segmentNumber: number): Observable<{}> {
    return new Observable(observer => {
      const mockGraphData = {
        segmentNumber: segmentNumber,
        data: [
          { x: "2021-09-25", y: 3 },
          { x: "2021-09-26", y: 2.5 },
          { x: "2021-09-27", y: 2 },
          { x: "2021-09-28", y: 1.5 },
          { x: "2021-09-29", y: 1 },
          { x: "2021-09-30", y: 0.5 },
        ]
      }
      observer.next(mockGraphData);
    });
  }
}