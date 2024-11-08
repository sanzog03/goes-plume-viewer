export interface PlumeRegion {
    id: string;
    location: [Lon, Lat]; // [lon, lat]
    startDate: DateTime;
    endDate: DateTime;
    plumes: Plume[];
}

export interface Plume {
    id: string;
    region: string;
    representationalPlume: SubDailyPlume;
    location: [Lon, Lat]; // [lon, lat]
    startDate: DateTime;
    endDate: DateTime;
    subDailyPlumes: SubDailyPlume[];
}

export type SubDailyPlume = STACItem;
export type DateTime = string;
export type Lon = string;
export type Lat = string;

// Stac Item defination
export interface STACItem {
    id: string;
    bbox: number[];
    type: string;
    links: Link[];
    assets: {
        rad: Asset;
        rendered_preview: Asset;
    };
    geometry: Geometry;
    collection: string;
    properties: {
        datetime: string;
    };
    stac_version: string;
    stac_extensions: string[];
}

interface Link {
    rel: string;
    type: string;
    href: string;
    title?: string;
}

interface Asset {
    href: string;
    type: string;
    roles?: string[];
    title: string;
    "proj:bbox"?: number[];
    "proj:epsg"?: number;
    "proj:wkt2"?: string;
    "proj:shape"?: number[];
    description?: string;
    "raster:bands"?: RasterBand[];
    "proj:geometry"?: Geometry;
    "proj:projjson"?: ProjJSON;
    "proj:transform"?: number[];
}

interface RasterBand {
    scale: number;
    nodata: string;
    offset: number;
    sampling: string;
    data_type: string;
    histogram: Histogram;
    statistics: Statistics;
}

interface Histogram {
    max: number;
    min: number;
    count: number;
    buckets: number[];
}

interface Statistics {
    mean: number;
    stddev: number;
    maximum: number;
    minimum: number;
    valid_percent: number;
}

interface Geometry {
    type: string;
    coordinates: string[][][];
}

interface ProjJSON {
    id: {
        code: number;
        authority: string;
    };
    name: string;
    type: string;
    datum: {
        name: string;
        type: string;
        ellipsoid: {
            name: string;
            semi_major_axis: number;
            inverse_flattening: number;
        };
    };
    $schema: string;
    coordinate_system: {
        axis: Axis[];
        subtype: string;
    };
}

interface Axis {
    name: string;
    unit: string;
    direction: string;
    abbreviation: string;
}