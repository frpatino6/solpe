import { Component, OnInit } from "@angular/core";
import firebase = require('nativescript-plugin-firebase')

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        
    }
    constructor(){
        firebase.init({
            persist: true,            
            showNotificationsWhenInForeground: true,
            onMessageReceivedCallback: function (message) {
                console.log("Title: " + message.title);
                console.log("Body: " + message.body);
                alert(message.body)
            },
            onPushTokenReceivedCallback: function (token) {
                console.log("Firebase push token: " + token);
            }
        }).then(
            (instance) => {
                console.log("firebase.init done "  + instance);
            },
            (error) => {
                console.log("firebase.init error: " + error);
            }
        );
        
    }
}
