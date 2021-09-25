import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MarkerProps } from '../custom-types';
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

  public showOverlayForSegment(props: MarkerProps) {
    const details = new Details(
      props.A2_RSSI,
      props.dateOfFailure,
      props.segment,
      props.longitude,
      props.latitude,
    )
    this.detailsEmitter.next(details);
    this.markersService.getSegmentGraphData(props.segment).subscribe(graphData => {
      this.graphDataEmitter.next(graphData);
      this.showOverlay();
    });
  }
}
