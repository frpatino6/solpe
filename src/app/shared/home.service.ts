// The following is a sample implementation of a backend service using Progress Kinvey (https://www.progress.com/kinvey).
// Feel free to swap in your own service / APIs / etc here for your own apps.
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs/Observable';
// import { Kinvey } from "kinvey-nativescript-sdk";
import { User } from "./user.model";
import { Orders } from "./models/Orders";

@Injectable()
export class HomeService {
    public onChange: EventEmitter<string> = new EventEmitter<string>();
    
    constructor(private http: HttpClient) { 

        
    }

    private serverUrl = "https://solpeservices.azurewebsites.net/";

    changesearchTaskCriteriak(searchText: string) {

        this.onChange.emit(searchText);
      }
    getOrders(user: String) : Observable<Orders[]>{
        let headers = this.createRequestHeader();
        return this.http.get<Orders[]>(this.serverUrl + '/solpe/GetOrdersByUserAsync/' + user, { headers: headers });
    }
    updateOrdersState(number: string) : Observable<Orders>{
        let headers = this.createRequestHeader();
        return this.http.put<Orders>(this.serverUrl + '/solpe/UpdateOrderState/' + number, { headers: headers });
    }


    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, PUT, POST",
            'X-TFS-FedAuthRedirect': 'Suppress'
        });

        return headers;
    }


}
