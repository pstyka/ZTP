import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginDto } from "../models/auth";
import { map, Observable } from "rxjs";
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

    public register(register: RegisterDto): Observable<> {
        
    }
}