export interface Flat {
    id?: string;
    ownerId?: string;
    name?: string;
    description?: string;
    city?: string;
    district?: string;
    street?: string;
    buildingNumber?: string;
    flatNumber?: string;
    postalCode?: string;
    rooms?: number;
    area?: number;
    price?: number;
    isAvailable?: boolean;
    visitCount?: number;
    createdAt?: string;
    updatedAt?: string;
    photos?: string[];
}