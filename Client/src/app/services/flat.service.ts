import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";
import { Flat, FlatFilters } from "../models/flat";

@Injectable({
    providedIn: 'root'
})
export class FlatService {
    constructor(private httpClient: HttpClient) {
    }

    public add(flat: Flat): Observable<string> {
        return this.httpClient.post<string>(`${environment.apiUrlTmp}/rest/flats`, flat).pipe(
            catchError(error => throwError(() => error))
        );
    }

    public edit(flat: Flat): Observable<string> {
        return this.httpClient.put<string>(`${environment.apiUrlTmp}/rest/flats/${flat.id}`, flat).pipe(
            catchError(error => throwError(() => error))
        );
    }


    public getFlat(id: string): Observable<Flat> {
        return this.httpClient.get<Flat>(`${environment.apiUrlTmp}/rest/flats/${id}`).pipe(
            catchError((error) => throwError(() => error))
        );
    }

    public getFlats(): Observable<Flat[]> {
        return this.httpClient.get<Flat[]>(`${environment.apiUrlTmp}/rest/flats`).pipe(
            catchError((error) => throwError(() => error))
        );
    }

    public getFlatsByOwnerId(ownerId: string): Observable<Flat[]> {
        return this.httpClient.get<Flat[]>(`${environment.apiUrlTmp}/rest/flats/owner/${ownerId}`).pipe(
            catchError((error) => throwError(() => error))
        );
    }

    public getSearchFlats(filters: FlatFilters): Observable<Flat[]> {
        let params = new HttpParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params = params.set(key, value.toString());
            }
        });

        return this.httpClient.get<Flat[]>(`${environment.apiUrlTmp}/rest/flats/search`, { params }).pipe(
            catchError((error) => throwError(() => error))
        );
    }

    public addPhotos(id: string, photos: File[]) {
        const formData = new FormData();

        photos.forEach(photo => {
            formData.append('photos', photo);
        });


        return this.httpClient.post(`${environment.apiUrlTmp}/rest/flats/${id}/photos`, formData).pipe(
            catchError(error => throwError(() => error))
        );
    }

    public getPhotos(id: string) {
        return this.httpClient.get<string[]>(`${environment.apiUrlTmp}/rest/flats/${id}/photos`).pipe(
            catchError((error) => throwError(() => error))
        );
    }

    public deleteFlat(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${environment.apiUrlTmp}/rest/flats/${id}`).pipe(
            catchError(error => throwError(() => error))
        );
    }

}