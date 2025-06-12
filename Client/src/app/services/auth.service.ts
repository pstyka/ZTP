import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginDto, RegisterDto } from "../models/auth";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environment";
import { Store } from "@ngrx/store";
import { AppState } from "../store";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient, private store: Store<AppState>) {
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

    public getToken(): Observable<{ access_token: string; token_type: string } | null> {
        const raw = localStorage.getItem("auth_token");

        try {
            const token = raw ? JSON.parse(raw) : null;
            return of(token);
        } catch (e) {
            console.error("Invalid token in localStorage", e);
            return of(null);
        }
    }
}