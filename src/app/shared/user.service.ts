// The following is a sample implementation of a backend service using Progress Kinvey (https://www.progress.com/kinvey).
// Feel free to swap in your own service / APIs / etc here for your own apps.
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { Kinvey } from "kinvey-nativescript-sdk";
import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    private serverUrl = "https://solpeservices.azurewebsites.net/";
    register(user: User) {
        // return Kinvey.User.signup({ username: user.email, password: user.password })
        //     .catch(this.handleErrors);
    }

    login(user: User) {
        let headers = this.createRequestHeader();
        return this.http.get(this.serverUrl+'/solpe/login/' + user.email +'/' + user.password +'/' + user.accessToken, { headers: headers });
    }

    logout() {
        // return Kinvey.User.logout()
        //     .catch(this.handleErrors);
    }

    resetPassword(email) {
        // return Kinvey.User.resetPassword(email)
        //     .catch(this.handleErrors);
    }
    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Methods":"GET, PUT, POST",
            'X-TFS-FedAuthRedirect': 'Suppress'
         });

        return headers;
    }

   
}
