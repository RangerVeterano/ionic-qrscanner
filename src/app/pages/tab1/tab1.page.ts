import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import SwiperCore, { SwiperOptions, FreeMode } from 'swiper';
import { DataLocalService } from '../../services/data-local.service';



@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  //opciones para el swiper
  sliderOpt: SwiperOptions = {
    slidesPerView: 1, //indicamos cuanto se ve el siguiente slider, en este caso 1 y medio mas    

  }

  //inyectamos nuestro plugin para poder leer codgios de barras y qr
  //inyecyamos nuestro servicio para guardar la informacion (dl)
  constructor(
    private barcodeScanner: BarcodeScanner,
    private dl: DataLocalService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    //Este se dispara cuando la página se va a cargar
    // console.log('ionViewWillEnter');
    // this.scan()
  }
  ionViewDidEnter() {
    //Esto se dispara cuando la página es totalmente cargada
    // console.log('ionViewDidEnter');
  }
  ionViewWillLeave() {
    //Esto se dispara antes de que la página se empieze a descargar
    // console.log('ionViewWillLeave');
  }
  ionViewDidLeave() {
    //Esto se dispara cuando la página ha sido descargada
    // console.log('ionViewDidLeave');
  }

  //Para los demás eventos se tienen que usar los que trae angular propiamente

  //Metodo que lanza el scanner de la camara 
  scan() {
    this.barcodeScanner.scan()
      .then(barcodeData => {
        // console.log('Barcode data', barcodeData);

        //Si el usuario no canceló el qr
        if (!barcodeData.cancelled) {
          this.dl.guargarRegistro(barcodeData.format, barcodeData.text)
          //Mandamos al usuario al historial de consultas y le abrimos la url
          
        }
      }).catch(err => {
        // console.log('Error', err);

        // this.dl.guargarRegistro('QRCode', 'https://ionic-curso-6486e.web.app/tabs/tab1')
        this.dl.guargarRegistro('QRCode', 'geo:40.73151796986687,-74.06087294062502')

      });
  }
}
