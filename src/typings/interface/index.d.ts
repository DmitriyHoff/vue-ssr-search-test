import type { BoundingBox } from '../type'

export as namespace Types

interface OSMAdress {
    'ISO3166-2-lvl4'?: string
    borough?: string
    city?: string
    country?: string
    country_code?: string
    historic?: string
    house_number?: string
    neighbourhood?: string
    postcode?: string
    road?: string
    suburb?: string
}

export interface OpenStreetMapObject {
    address?: OSMAdress
    addresstype?: string
    addressdetails?: string
    boundingbox: BoundingBox
    class?: string
    display_name?: string
    importance?: number
    lat: string
    licence?: string
    lon: string
    osm_id: number
    osm_type?: string
    place_id?: number
    svg?: string
    type?: string
}
