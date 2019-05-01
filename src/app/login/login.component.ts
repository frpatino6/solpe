import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as pushPlugin from "nativescript-push-notifications";
import { User } from "../shared/user.model";
import { UserService } from "../shared/user.service";
import firebase = require('nativescript-plugin-firebase')
import { ActivatedRoute } from "@angular/router";
require("nativescript-localstorage");

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    private _message: string;
    private _token: String;
    private isLoggingIn = true;
    private user: User;
    private processing = false;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService,
        private activeRoute: ActivatedRoute,
        private routerExtensions: RouterExtensions) {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.onRegisterButtonTap();

        firebase.getCurrentPushToken().then((token: string) => {
            // may be null if not known yet
            console.log(`Current push token: ${token}`);
            this._token=token;
        });
        this.user.email = "";
        this.user.password = ""
    }
    private pushSettings = {
        // Android settings
        senderID: "984049361003", // Android: Required setting with the sender/project number
        notificationCallbackAndroid: (stringifiedData: String, fcmNotification: any) => {
            const notificationBody = fcmNotification && fcmNotification.getBody();
            console.log("Message received!\n" + notificationBody + "\n" + stringifiedData);
        },

        // iOS settings
        badge: true, // Enable setting badge through Push Notification
        sound: true, // Enable playing a sound
        alert: true, // Enable creating a alert
        notificationCallbackIOS: (message: any) => {
            console.log("Message received!\n" + JSON.stringify(message));

        }
    };
    
    ngOnInit(): void {

    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            // this.notifyPropertyChange("message", value);
        }
    }
    
    private updateMessage(text: String) {

        this.message += text + "\n";
        alert(this.message);
    }
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }
    onRegisterButtonTap() {
        let self = this;
        pushPlugin.register(this.pushSettings, (token: String) => {
            console.log("Device registered. Access token: " + token);
            self._token=token;

            if (pushPlugin.registerUserNotificationSettings) {
                pushPlugin.registerUserNotificationSettings(() => {
                    console.log("Successfully registered for interactive push.");
                }, (err) => {
                    console.log("Error registering for interactive push: " + JSON.stringify(err));
                });
            }
        }, (errorMessage: String) => {
            console.log(JSON.stringify(errorMessage));
        });
    }
    onUnregisterButtonTap() {
        let self = this;
        pushPlugin.unregister(
            (successMessage: String) => {
                console.log(successMessage);
            },
            (errorMessage: String) => {
                console.log(JSON.stringify(errorMessage));
            },
            this.pushSettings
        );
    }
    submit() {
        if (!this.user.email || !this.user.password) {
            this.message = "Please provide both an email address and password.";
            return;
        }

        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        this.processing = true;
        this.user.accessToken=this._token
        
        this.userService.login(this.user)
            .subscribe((result) => {
                this.processing = false;
                localStorage.setItem('emailUser', this.user.email);
                let navigationExtras = {
                    queryParams: { 'email': this.user.email }
                  }
                this.routerExtensions.navigate(["/home"],  navigationExtras);
            }, (error) => {
                console.log(error.message)
                alert("Unfortunately we could not find your account." + error.message);
                this.processing = false;
            });


    }

    register() {
        if (this.user.password != this.user.confirmPassword) {
            this.message = "Your passwords do not match.";
            return;
        }
        this.userService.register(this.user)
        // .then(() => {
        //     this.processing = false;
        //     this.alert("Your account was successfully created.");
        //     this.isLoggingIn = true;
        // })
        // .catch(() => {
        //     this.processing = false;
        //     this.alert("Unfortunately we were unable to create your account.");
        // });
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register for APP NAME to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then((data) => {
            if (data.result) {
                this.userService.resetPassword(data.text.trim())
                // .then(() => {
                //     this.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                // }).catch(() => {
                //     this.alert("Unfortunately, an error occurred resetting your password.");
                // });
            }
        });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    get messages(): string {
        return this._message;
    }

    set messages(value: string) {
        if (this._message !== value) {
            this._message = value;

        }
    }

}

