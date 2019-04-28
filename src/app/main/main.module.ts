import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";


@NgModule({
    imports: [

        NativeScriptCommonModule,
        MainRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        MainComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class MainModule { }