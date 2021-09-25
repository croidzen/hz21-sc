import { Component, Input, OnInit } from '@angular/core';
import Details from 'src/app/models/details';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @Input() model?: Details = new Details();

  constructor() { }

  ngOnInit(): void {
  }
}
