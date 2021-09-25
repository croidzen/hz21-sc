export interface MarkerProps {
    A2_RSSI: string,
    dateOfFailure: string,
    segment: number,
    longitude: number,
    latitude: number,
}

export interface GraphData {
    segmentNumber: number,
    labels: string[],
    data: number[],
  }
