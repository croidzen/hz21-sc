export default class Details {
    public daysUntilFailure: number;
    public dateOfFailure: string;
    public segmentNo: number;
    public longitude: number;
    public latitude: number;
    public trackId: number;
    public areaNumber: number;

    constructor(
        daysUntilFailure: number = 0,
        dateOfFailure: string = '01-01-1900',
        segmentNo: number = 0,
        longitude: number = 0,
        latitude: number = 0,
        trackId: number = 0,
        areaNumber: number = 0,
    ) {
        this.daysUntilFailure = daysUntilFailure;
        this.dateOfFailure = dateOfFailure;
        this.segmentNo = segmentNo;
        this.longitude = longitude;
        this.latitude = latitude;
        this.trackId = trackId;
        this.areaNumber = areaNumber;
    }
}