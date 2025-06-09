import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";
import { Flat } from "../models/flat";
import { Message } from "../models/chat";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private httpClient: HttpClient) {
    }

    public send(message: Message) {
        return this.httpClient.post<string>(`${environment.apiUrl}/chat/messages`, message).pipe(
            catchError(error => throwError(() => error))
        );
    }

    // public getFlat(id: string): Observable<Flat> {
    //     return this.httpClient.get<Flat>(`${environment.apiUrlTmp}/rest/flats/${id}`).pipe(
    //         catchError((error) => throwError(() => error))
    //     );
    // }

    // public getFlats(): Observable<Flat[]> {
    //     return this.httpClient.get<Flat[]>(`${environment.apiUrlTmp}/rest/flats`).pipe(
    //         catchError((error) => throwError(() => error))
    //     );
    // }

    // public addPhotos(id: string, photos: File[]) {
    //     const formData = new FormData();

    //     photos.forEach(photo => {
    //         formData.append('photos', photo);
    //     });


    //     return this.httpClient.post(`${environment.apiUrlTmp}/rest/flats/${id}/photos`, formData).pipe(
    //         catchError(error => throwError(() => error))
    //     );
    // }

    // public getPhotos(id: string) {
    //     return this.httpClient.get<string[]>(`${environment.apiUrlTmp}/rest/flats/${id}/photos`).pipe(
    //         catchError((error) => throwError(() => error))
    //     );
    // }
}