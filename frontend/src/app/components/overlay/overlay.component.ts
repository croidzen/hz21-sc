import { Component, OnInit } from '@angular/core';
import Details from 'src/app/models/details';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  details: Details;
  graphData: {};

  constructor(private overlayService: OverlayService) {
    this.overlayService = overlayService;
    this.details = new Details();
    this.graphData = {};
  }

  ngOnInit(): void {
    this.overlayService.detailsEmitter.subscribe((details) => {
      this.details = details;
    })

    const overlayElement = document.querySelector('.overlay');
    overlayElement?.addEventListener('click', e => {
      if(e.target !== e.currentTarget) return;
      overlayElement.classList.add('hidden');
    })
  }
}
