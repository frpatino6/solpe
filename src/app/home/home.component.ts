import { Component, OnInit } from "@angular/core";
import firebase = require('nativescript-plugin-firebase')
import * as pushPlugin from "nativescript-push-notifications";
import { Page } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
registerElement('CardView', () => CardView);

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ['./home.component.css'],
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    data = [];
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
    constructor(private page: Page) {
        this.page.actionBarHidden = true;
        this.onRegisterButtonTap();
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.onInitializaDataSolpe();
    }
    onRegisterButtonTap() {
        let self = this;
        pushPlugin.register(this.pushSettings, (token: String) => {
            console.log("Device registered. Access token: " + token);
            // token displayed in console for easier copying and debugging durng development
            console.log("Device registered. Access token: " + token);

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

    onInitializaDataSolpe() {
        this.data.push({ heading: "Bulbasaur", content: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun’s rays, the seed grows progressively larger." });
        this.data.push({ heading: "Ivysaur", content: "To support its weight, Ivysaur’s legs and trunk grow thick and strong. If it starts spending more time lying in the sunlight, it’s a sign that the bud will bloom into a large flower soon." });
        this.data.push({ heading: "Venusaur", content: "There is a large flower on Venusaur’s back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight. The flower’s aroma soothes the emotions of people." });
        this.data.push({ heading: "Charmander", content: "The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely." });
        this.data.push({ heading: "Charmeleon", content: "Charmeleon mercilessly destroys its foes using its sharp claws. If it encounters a strong foe, it turns aggressive. In this excited state, the flame at the tip of its tail flares with a bluish white color." });
        this.data.push({ heading: "Charizard", content: "Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself." });
        this.data.push({ heading: "Squirtle", content: "Squirtle’s shell is not merely used for protection. The shell’s rounded shape and the grooves on its surface help minimize resistance in water, enabling this Pokémon to swim at high speeds." });
        this.data.push({ heading: "Wartortle", content: "Its tail is large and covered with a rich, thick fur. The tail becomes increasingly deeper in color as Wartortle ages. The scratches on its shell are evidence of this Pokémon’s toughness as a battler." });
        this.data.push({ heading: "Blastoise", content: "Blastoise has water spouts that protrude from its shell. The water spouts are very accurate. They can shoot bullets of water with enough accuracy to strike empty cans from a distance of over 160 feet." });

    }
}
