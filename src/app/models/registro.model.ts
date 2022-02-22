export class Registro {

    public format: string; //El formato del texto a sacar
    public text: string; //Contenido del texto
    public type: string; //Ver si es un mapa o un código de barras, página web
    public icon: string; //Logo para indicar si es un mapa u otra cosa  
    public created: Date; //Variable que almacena cuando se ha creado el modal

    constructor(format: string, text: string) {
        this.format = format;
        this.text = text;

        this.created = new Date(); //indicamos la fecha en que se ha creado

        this.determintarTipo();
    }


    //metodo que me sirve para saber que tipo de qr es
    private determintarTipo() {
        const inicioTexto = this.text.substring(0, 4); //Ver si es "http" o "geo"
        console.log('TIPO', inicioTexto);

        switch (inicioTexto) {
            case 'http':
                this.type = 'Página Web'; //indicamos que es una página web
                this.icon = 'globe'; //indicamos cual va ser el icono
                break;

            case 'geo:':
                this.type = 'Geolocalizacion'; //indicamos que es una página web
                this.icon = 'pin'; //indicamos cual va ser el icono
                break;

            default:
                this.type = 'No reconocido';
                this.icon = 'created';

        }
    }
}