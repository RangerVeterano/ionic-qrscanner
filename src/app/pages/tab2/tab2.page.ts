import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  //inyectamos nuestro servicio de data local
  constructor(
    public dl: DataLocalService //lo marcamos como publico para poder acceder a el desde el html
  ) { }

  ngOnInit() {
  }

  //Metodo para enviar todos los datros
  enviarCorreo() {
    this.dl.enviarCorreo();
  }

  //Metodo para abrir el navegador de la webs
  async abrirRegistro(registro) {
    await this.dl.abrirRegistro(registro)
  }

}
