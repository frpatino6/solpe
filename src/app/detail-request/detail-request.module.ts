import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DetailRequestRoutingModule } from "./detail-request-routing.module";
import { DetailRequestComponent } from "./detail-request.component";
import {HomeService} from '../shared/home.service'

@NgModule({
    imports: [
       
        NativeScriptCommonModule,
        DetailRequestRoutingModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,        
        NativeScriptFormsModule
    ],
    declarations: [
        DetailRequestComponent
    ],
    providers:[HomeService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DetailRequestModule { }
