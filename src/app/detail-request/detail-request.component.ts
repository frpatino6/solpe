import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { Orders } from '../shared/models/Orders';
import { ActivatedRoute } from '@angular/router';
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { HomeService } from '../shared/home.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'ns-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.css']
})
export class DetailRequestComponent implements OnInit {

  public dataPedidos: Orders[] = new Array();
  public dataGroupPedidos: Orders[] = new Array();
  public processing = false;
  public numeroPedido = ""
  public totalPedido=0;
  constructor(
    private currencyPipe: CurrencyPipe,
    private router: RouterExtensions,
    private page: Page,
    private route: ActivatedRoute,
    private homeServices: HomeService) {

    this.page.actionBarHidden = true;
    var self = this;
    this.route.queryParams.subscribe(params => {
      self.dataPedidos = JSON.parse(params["pedidoDetails"]);
      self.dataGroupPedidos = JSON.parse(params["groupPedidoDetails"]);
      self.totalPedido=params["totalPedido"];

      if (self.dataPedidos.length > 0)
        self.numeroPedido = self.dataPedidos[0].numero;

    });

  }
  onSetupItemView(args: SetupItemViewArgs) {
    args.view.context.third = (args.index % 3 === 0);
    args.view.context.header = ((args.index + 1) % this.dataPedidos.length === 1);
    args.view.context.footer = (args.index + 1 === this.dataPedidos.length);
  }
  ngOnInit() {

  }
  onClick() {
    this.processing = true;

    this.homeServices.updateOrdersState(this.numeroPedido)
      .subscribe((result) => {
        this.processing = false;
        this.router.back();
      }, (error) => {

        alert("Unfortunately we could not find your account." + error.message);
        this.processing = false;
      });
  }
  onBack() {
    this.router.back();
  }

}
