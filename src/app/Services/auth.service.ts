
export class AuthService {
    isAuth = false;
    sessions: any;
    inscript_user: any;
    etat_problematique = true;

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