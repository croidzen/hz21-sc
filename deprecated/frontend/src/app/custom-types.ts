export interface MarkerProps {
    daysUntilFailure: number,
    dateOfFailure: string,
    segmentNo: number,
    longitude: number,
    latitude: number,
    trackId: number,
    areaNumber: number,
}

export interface GraphData {
    segmentNumber: number,
    data: {}[],
  }
