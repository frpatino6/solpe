import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import firebase = require('nativescript-plugin-firebase')
import * as pushPlugin from "nativescript-push-notifications";
import { Page } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
import { HomeService } from "../shared/home.service";
import { Orders } from "../shared/models/Orders";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as _ from 'lodash';


registerElement('CardView', () => CardView);

@Component({
    selector: "Home",
    moduleId: module.id,
    styleUrls: ['./home.component.css'],
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public dataSolpe: Orders[] = new Array();
    public dataPedidos: Orders[] = new Array();
    public dataGroupPedidos: Orders[] = new Array();
    public processing = false;
    private _token: String;
    private emailUser: String;
    public TitleTabSolpe;
    public TitleTabPedidos;
    public totalSolpe = 0;
    public totalPedidos = 0

    constructor(private page: Page, private homeServices: HomeService,
        private route: ActivatedRoute, private routerExtensions: RouterExtensions,
        private ref: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
        this.onRegisterButtonTap();

        this.route.queryParams.subscribe(params => {
            this.emailUser = params["email"];
        });

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
            this.GetOrderByUser();
        }
    };
    setTitleTabSolpe() {
        this.totalSolpe = this.dataSolpe.length;
        this.totalPedidos = this.dataGroupPedidos.length;
        this.TitleTabSolpe = { title: "Solicitud de pedidos " + this.totalSolpe, iconSource: "res://icon" };
        this.TitleTabPedidos = { title: "Pedidos " + this.totalPedidos, iconSource: "res://pedidos" };
    }
    ngOnInit(): void {
        firebase.addOnMessageReceivedCallback((message) => {
            console.log('addOnMessageReceivedCallback')
            this.GetOrderByUser();
        }).then(
            (instance) => {
                console.log("Mensaje recibido");
            },
            (error) => {
                console.log("Error al recibir el mensaje: " + error);
            }
        );
        this.setTitleTabSolpe();
        this.GetOrderByUser();
    }

    GetOrderByUser() {
        this.processing = true;

        this.homeServices.getOrders(this.emailUser)
            .subscribe((result) => {
                this.processing = false;
                this.dataSolpe = result.filter(type => type.tipo_Doc == "S");    
                this.dataPedidos = result.filter(type => type.tipo_Doc != "S");
                this.dataGroupPedidos = _.chain(this.dataPedidos).groupBy("numero").map(function (v, i) {                   
                    return {
                      numero: i,
                      id: _.get(_.find(v, 'numero'), 'numero'),
                      cantidad: _.get(_.find(v, 'cantidad'), 'cantidad'),
                      valorLiteral: _.get(_.find(v, 'valorLiteral'), 'valorLiteral'),
                      tipo_Doc: _.get(_.find(v, 'tipo_Doc'), 'tipo_Doc'),
                      texto: _.get(_.find(v, 'texto'), 'texto')
                    };
              
                  }).value();

                if (this.dataSolpe.length == 0 && this.dataPedidos.length == 0)
                    alert("No tienen pendiente pedidos por aprobar")
                else
                    this.setTitleTabSolpe()

                this.ref.detectChanges();
            }, (error) => {
                console.log(error.message)
                alert("Unfortunately we could not find your account." + error.message);
                this.processing = false;
            });
    }

    onClick(number) {
        this.processing = true;
        this.homeServices.updateOrdersState(number)
            .subscribe((result) => {
                this.processing = false;
                this.GetOrderByUser();            
            }, (error) => {
                console.log(error.message)
                alert("Unfortunately we could not find your account." + error.message);
                this.processing = false;
            });
    }
    onRegisterButtonTap() {
        let self = this;
        pushPlugin.register(this.pushSettings, (token: String) => {
            console.log("Device registered. Access token: " + token);
            self._token = token;

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
    onClickDetailView(numeroPedido) {
        console.log(numeroPedido);
        let navigationExtras = {
            queryParams: { 
                'pedidoDetails': JSON.stringify(this.dataPedidos.filter(e => e.numero == numeroPedido)) ,
                'groupPedidoDetails': JSON.stringify(this.dataGroupPedidos.filter(e => e.numero == numeroPedido))
            
            }
        }
        this.routerExtensions.navigate(["/detail"], navigationExtras);
    }
}
