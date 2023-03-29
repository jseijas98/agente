export interface Multi {
    name:   string;
    series: Series[];
}

export interface Series {
    name: Date;
    value: number;
}
