
export class AuthService {
    isAuth = false;
    sessions: any;
    inscript_user: any;

    signIn() {
        this.isAuth = true;
    }

    signOut() {
        this.isAuth = false;
    }

    getSessions() {
        return this.sessions;
    }

}