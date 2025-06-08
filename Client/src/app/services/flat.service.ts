import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";
import { Flat } from "../models/flat";

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



    public getFlats(): Observable<Flat[]> {
        return this.httpClient.get<Flat[]>(`${environment.apiUrlTmp}/rest/flats`).pipe(
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
}