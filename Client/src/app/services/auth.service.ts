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

    public login(login: LoginDto): Observable<any> {
        const body = new URLSearchParams();
        body.set('grant_type', 'password');
        body.set('username', login.email);
        body.set('password', login.password);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        };

        return this.httpClient.post<any>(
            `${environment.apiUrl}/auth/token`,
            body.toString(),
            { headers }
        );
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