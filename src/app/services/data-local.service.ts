import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

import { Storage } from '@ionic/storage-angular'; //importacion del storage local
import { NavController } from '@ionic/angular';

import { Browser } from '@capacitor/browser'; //Abrir web con el navegador que quiera el usuario

//Poder crear y manipular archivos
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  //Creamos nuestra variable local para guardar todos los registros
  public guardados: Registro[] = [];

  //Variable local para los registros del almacenamiento
  private _storage: Storage | null = null;

  //inyectamos el servicio para el almacenamiento
  //Inyectamos el plugin para componer correos electrónicos (ec)
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private file: File,
    private ec: EmailComposer
  ) {

    this.init(); //iniciamos la base de datos

    this.cargarRegistros();
  }

  //Metodo para iniciar la base de datos local
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  //metodo asincrono para recoger nuestras peliculas
  async cargarRegistros() {

    //Las insertamos dentro de nuestro arreglo local, Puede ser null ( insertamos arreglo vacio )
    this.guardados = (await this.storage.get('registros')) || [];
  }

  //metodo para guardar registros de forma persistente
  async guargarRegistro(format: string, text: string) {

    //nos aseguramos que no tenemos informacion pendiente de ser introducida
    await this.cargarRegistros()

    //Creamos un nuevo registro
    const nuevoRegistro = new Registro(format, text);

    //Lo insertamos como primer valor
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);

    //Guardamos los registros en nuestra base de datos
    this._storage.set('registros', this.guardados);

    //Redireccionamos al usuario al historial y le abrimos el registro
    this.abrirRegistro(nuevoRegistro)

  }

  //metodo que nos abre en el navegador el registro
  async abrirRegistro(registro: Registro) {

    //movemos el usuario a la parte de registros
    this.navCtrl.navigateForward('/home/tab2');

    switch (registro.type) {
      case 'Página Web':
        await Browser.open({ url: registro.text });
        break;
      case 'Geolocalizacion':
        this.navCtrl.navigateForward(`/home/tab2/mapa/${registro.text}`);
        // await Browser.open({ url: registro.text });
        break;
    }
  }

  enviarCorreo() {

    const arrTemp = [] //arreglo temporal
    // \n es un salto de linea
    const titulos = 'Tipo,Formato,Creado en,Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach(registro => {

      const fila = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`
      arrTemp.push(fila)
    });

    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string) {

    this.file.checkFile(this.file.externalDataDirectory, 'registros.csv')
      .then(existe => {
        //Aqui dentro existe el archivo
        console.log(existe);
        return this.escribirEnArchivo(text);
      })
      .catch(err => {
        //No existe el archivo
        console.log(err);
        //El primer campo es el directorio donde queremos crearlo, el segundo el nombre del directorio, el tercer si queremos reemplazar el archivo dentro del directorio
        return this.file.createFile(this.file.externalDataDirectory, 'registros.csv', false)
          .then(creado => {
            console.log(creado);
            //Esto quiere decir que el archivo se ha creado
            return this.escribirEnArchivo(text);
          })
          .catch(err => {
            console.log('No se ha podido crear el archivo');
          });
      })

  }

  async escribirEnArchivo(text: string) {
    await this.file.writeExistingFile(this.file.externalDataDirectory, 'registros.csv', text)

    const archivo = this.file.externalDataDirectory + '/registros.csv';

    let email = {

      to: 'harvestveterano@gmail.com',
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aqui tienes todos tus backapss de la aplicacion',
      isHtml: true
    }
    console.log('antes de abrir lo del mensaje');
    // Send a text message using default options
    this.ec.open(email)

  }
}
