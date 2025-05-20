import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginDto, RegisterDto } from "../models/auth";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {
    }

    public login(login: LoginDto): Observable<string> {
        return this.httpClient.post<{ token: string }>(environment.apiUrl + '/auth/login', login).pipe(map(x => x.token));
    }

    public register(register: RegisterDto): Observable<Object> {
        return this.httpClient.post<any>(environment.apiUrl + '/auth/register', register).pipe(
            map((r: HttpResponse<any>) => {
                return r;
            }),
            catchError(error => throwError(error))
        );
    }
}