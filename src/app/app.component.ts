import { Component, OnInit } from "@angular/core";
import * as firebase from 'nativescript-plugin-firebase';
import { HomeService } from "./shared/home.service";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        
    }
    constructor( private homeServices: HomeService){
       var self= this;
        firebase.init({
            persist: true,            
            showNotificationsWhenInForeground: true,
           
            onPushTokenReceivedCallback: function (token) {
                //console.log("Firebase push token: " + token);
            }
        }).then(
            (instance) => {
                //console.log("firebase.init done "  );
            },
            (error) => {
                //console.log("firebase.init error: " + error);
            }
        );
        
    }
}
