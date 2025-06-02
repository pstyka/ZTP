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

    public add(flat: Flat): Observable<Object> {
        return this.httpClient.post(`${environment.apiUrlTmp}/rest/flats`, flat).pipe(
            map((response) => response),
            catchError((error) => throwError(() => error))
        );
    }
}