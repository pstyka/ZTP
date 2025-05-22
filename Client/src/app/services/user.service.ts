import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private httpClient: HttpClient) {
    }

    public getMe(): Observable<Object> {
        return this.httpClient.get<any>(environment.apiUrl + '/users/me').pipe(
            map((r: HttpResponse<any>) => {
                return r;
            }),
            catchError(error => throwError(error))
        );
    }

}