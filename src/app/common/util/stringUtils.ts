export default class StringUtils {
  public  convertDate(arrayDate: Array<number>): string {
    let dateNull: string = 'monitoring intialized';

    if (arrayDate == null) {
      return dateNull;
    }

    return `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]} ${arrayDate[3]}:${arrayDate[4]}:${arrayDate[5]}`;
  }

  public formatDate(dateString: any): string {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }


  public converPorcent(porcent: string): number {
    let newPorcent: number = parseInt(porcent.split('$').join(''));

    return newPorcent;
  }

  public convertDatetograph(arrayDate: Array<number>): string {
    let dateNull: string = 'null';

    if (arrayDate == null) {
      return dateNull;
    }
    return `${arrayDate[0]}-${arrayDate[1]}-${arrayDate[2]}T${arrayDate[3]}:${arrayDate[4]}:${arrayDate[5]}Z`;
  }

  dateultils(arrayDate: Array<number>): Date {
    let date: Date = new Date(
      arrayDate[0],
      arrayDate[1] - 1,
      arrayDate[2],
      arrayDate[3],
      arrayDate[4],
      arrayDate[5],
      arrayDate[6] / 1000000
    );

    console.log('date', date);

    return date;
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split(/[\s/:]+/); // dividir la cadena en partes usando expresiones regulares
    const year = parseInt(parts[2]) + 2000; // obtener el año y sumar 2000 para obtener el siglo correcto
    const month = parseInt(parts[1]) - 1; // los meses empiezan desde cero en JavaScript
    const day = parseInt(parts[0]);
    const hours = parseInt(parts[3]);
    const minutes = parseInt(parts[4]);
    const seconds = parseInt(parts[5]);
    return new Date(year, month, day, hours, minutes, seconds);
  }

  numberRegEx = /\-?\d*\.?\d{1,2}/;

  formatDateAXis(): string {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  formatearFecha(fechaISO: string): string {
    // Crear un objeto de fecha a partir del formato ISO
    const fecha: Date = new Date(fechaISO);

    // Obtener los componentes de fecha necesarios
    const dia: number = fecha.getUTCDate();
    const mes: number = fecha.getUTCMonth() + 1; // Los meses comienzan desde cero, por lo que se debe agregar 1
    const año: number = fecha.getUTCFullYear() % 100; // Obtener solo los últimos dos dígitos del año
    const hora: number = fecha.getUTCHours();
    const minutos: number = fecha.getUTCMinutes();
    const segundos: number = fecha.getUTCSeconds();

    // Formatear la fecha y hora en el formato deseado
    const fechaFormateada: string = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;

    return fechaFormateada;
  }




}
