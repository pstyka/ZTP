export interface AuthState {
    isLoggedIn?: boolean;
    token?: string;
    userId?: string;
    isAdmin?: boolean;
}