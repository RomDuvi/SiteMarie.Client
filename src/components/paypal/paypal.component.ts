import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PaypalConfig } from '../../models/paypalConfig.model';
import { ToastGeneratorService } from '../app/services/toastGenerator.service';
import { Picture } from 'src/models/picture.model';
import { PictureService } from '../app/services/picture.service';
import { Command } from '../../models/command.model';
import { Buyer } from '../../models/buyer.model';
declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements  OnChanges {
  @Input() picture: Picture;
  options: Option[] = [];
  config: PaypalConfig;

  get fileOptions() {
    return this.options.filter((elem) => {
      return elem.isFile;
    }).sort((a, b) => {
      if (a.price < b.price) {
        return -1;
      } else if (a.price === b.price) {
        return 0;
      }
      return 1;
    });
  }
  get posterOptions() {
    return this.options.filter((elem) => {
      return !elem.isFile;
    }).sort((a, b) => {
      if (a.price < b.price) {
        return -1;
      } else if (a.price === b.price) {
        return 0;
      }
      return 1;
    });
  }

  constructor(
    private toast: ToastGeneratorService,
    protected pictureService: PictureService
  ) { }

  ngOnChanges(changes:  SimpleChanges) {
    this.config = new PaypalConfig((data, actions) => this.onAuthorize(data, actions), () => this.onCancel(), () => this.onError());
    // this.config.env = 'production';
    this.initOptions();
  }

  initButton(config: PaypalConfig) {
    document.getElementById('paypal-container').innerHTML = '';
    paypal.Button.render(config, '#paypal-container');
  }

  onAuthorize(data, actions) {
    const option = this.options.find((elem) => {
      return elem.selected;
    });

    return actions.payment.execute().then((d: any) => {
      const buyer: Buyer = d.payer.payer_info;
      // tslint:disable-next-line:max-line-length
      const buyerAddress = `${buyer.shipping_address.line1} ${buyer.shipping_address.line2}, ${buyer.shipping_address.postal_code} ${buyer.shipping_address.country_code}`;
      const command = new Command(this.picture.id, buyer.email, buyer.last_name, buyer.first_name, buyerAddress, option.price);

      this.toast.toastSucess('Order', 'Payment authorized!');
      if (option.isFile) {
        this.pictureService.donwloadPictureFile({picture: this.picture, ratio: option.ratio});
      }
      console.log(command);
      this.pictureService.saveCommand(command);
    });
  }

  onCancel() {
    this.toast.toastWarning('Order', 'Payment cancelled');
  }

  onError() {
    this.toast.toastError('Order',  'An error occured');
  }

  initOptions() {
    this.options = [];
    const price = this.picture.price;
    const width = this.picture.width;
    const height = this.picture.height;

    this.options.push(new Option(1, true, `${width} x ${height} px`, price));
    this.options.push(new Option(3, false, `${Math.floor(width / 3)} x ${Math.floor(height / 3)} px`, Math.floor(price * 0.8 )));
    this.options.push(new Option(4, false, `${Math.floor(width / 4)} x ${Math.floor(height / 4)} px`, Math.floor(price * 0.6 )));

    // Posters
    this.options.push(new Option(1, false, 'A4', 15, false));
    this.options.push(new Option(1, false, 'A3', 20, false));
    this.options.push(new Option(1, false, 'A2', 25, false));

    this.config.createPayment(price, 'EUR');
    this.initButton(this.config);
  }

  selectOption(option: Option) {
    this.options.forEach(opt => {
      opt.selected = false;
    });
    option.selected = true;
    this.config.createPayment(option.price, 'EUR');
    this.initButton(this.config);
  }
}

class Option {
  constructor(
    public ratio: number,
    public selected: boolean,
    public size: string,
    public price: number,
    public isFile: boolean = true
  ) { }
}