export default class Details {
    public severity: string;
    public dateOfFailure: string;
    public segment: number;
    public longitude: number;
    public latitude: number;

    constructor(
        severity: string = 'unknown',
        dateOfFailure: string = '01-01-1900',
        segment: number = 1,
        longitude: number = 0,
        latitude: number = 0,
    ) {
        this.severity = severity;
        this.dateOfFailure = dateOfFailure;
        this.segment = segment;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}