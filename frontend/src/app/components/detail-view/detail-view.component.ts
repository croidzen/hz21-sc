import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartItem, registerables } from 'chart.js';
import { GraphData } from 'src/app/custom-types';
import Details from 'src/app/models/details';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @Input() model?: Details = new Details();

  ctx: ChartItem | null = null;
  chart: Chart | null = null;

  constructor(private overlayService: OverlayService) { this.overlayService = overlayService; }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.overlayService.graphDataEmitter.subscribe((graphData: {}) => {
      this.updateChart(graphData as GraphData);
    })

    this.setupInitialChart();
  }

  getDaysUntilFailureAsInt() {
    return Math.round(this.model?.daysUntilFailure ?? 0);
  }

  setupInitialChart(): void {
    const initialGraphData: GraphData = {
      segmentNumber: 100,
      data: [{x: 10, y: 20}],
    }

    this.ctx = (document.getElementById('myChart') as ChartItem);
    const chartData = this.createChartData(initialGraphData);
    this.chart = new Chart(this.ctx as ChartItem, chartData as any);
  }

  createChartData(input: GraphData): {} {
    return {
      type: 'line',
      data: {
        datasets: [{
          label: `Segment ${input.segmentNumber}`,
          data: input.data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Threshold',
          data: Array.from({ length: input.data.length }, () => 1),
          fill: false,
          borderColor: 'rgb(255,0,0)',
          tension: 0.1
        }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }

  updateChart(graphData: GraphData): void {
    this.chart!.destroy();
    const chartData = this.createChartData(graphData);
    this.chart = new Chart(this.ctx as ChartItem, chartData as any);
    this.chart.update();
  }
}
