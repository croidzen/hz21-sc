import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Details from '../models/details';
import { MarkersService } from './markers.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  detailsEmitter = new Subject<Details>();
  graphDataEmitter = new Subject<{}>();

  constructor(private markersService: MarkersService) { this.markersService = markersService; }

  public showOverlay() {
    const overlayElement = document.querySelector('.overlay');
    if (overlayElement) {
      overlayElement.classList.remove('hidden');
    }
  }

  public showOverlayForSegment(segmentNumber: number, longitude: number, latitude: number) {
    this.markersService.getSegmentDetails(segmentNumber).subscribe(details => {
      details.longitude = longitude;
      details.latitude = latitude;
      this.detailsEmitter.next(details);
      this.markersService.getSegmentGraphData(segmentNumber).subscribe(graphData => {
        this.graphDataEmitter.next(graphData);
        this.showOverlay();
      });
    });
  }
}
