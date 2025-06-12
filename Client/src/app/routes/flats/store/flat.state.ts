import { Flat } from "../../../models/flat";

export interface FlatState {
    flat?: Flat;
    flats?: Flat[];
    flatPhotosUrls?: string[];
    ownerFlats?: Flat[];
}