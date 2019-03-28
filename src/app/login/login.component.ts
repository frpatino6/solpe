import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

import { User } from "../shared/user.model";
import { UserService } from "../shared/user.service";
import firebase = require('nativescript-plugin-firebase')

import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    private _message: string;

    ngOnInit(): void {

    }

    isLoggingIn = true;
    user: User;
    processing = false;

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            // this.notifyPropertyChange("message", value);
        }
    }


    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService,
        private activeRoute: ActivatedRoute,
        private routerExtensions: RouterExtensions) {
        this.page.actionBarHidden = true;
        this.user = new User();


        firebase.getCurrentPushToken().then((token: string) => {
            // may be null if not known yet
            console.log(`Current push token: ${token}`);
        });
        this.user.email = "frpatino6@gmail.com";
        this.user.password = "1234546"
    }
    private updateMessage(text: String) {

        this.message += text + "\n";
        alert(this.message);
    }
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
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
        this.userService.login(this.user)
        .subscribe((result) => {
            this.processing = false;
            this.routerExtensions.navigate(["/home"],  { relativeTo: this.activeRoute });
        }, (error) => {
            console.log(error.message)
            alert("Unfortunately we could not find your account." + error.message);
            this.processing=false;
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

