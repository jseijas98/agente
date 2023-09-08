import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  public breadcrumbs: { label: string; url: string }[] = [
    { label: 'Dashboard', url: '/' }
  ];

  constructor() {
    // Cuando se inicializa el servicio, cargar los breadcrumbs almacenados previamente
    this.cargarBreadcrumbs();
  }

  agregarRuta(url: string, label: string) {
    // Obtener los breadcrumbs almacenados previamente (si los hay)
    const storedBreadcrumbs = localStorage.getItem('breadcrumbs');

    // Parsear los breadcrumbs almacenados en formato JSON
    const breadcrumbs = storedBreadcrumbs ? JSON.parse(storedBreadcrumbs) : [];

    // Buscar si la ruta ya existe en los breadcrumbs
    const index = breadcrumbs.findIndex((breadcrumb: { url: string; }) => breadcrumb.url === url);

    if (index !== -1) {
      // Si la ruta ya existe, eliminamos todas las rutas después de ella
      breadcrumbs.splice(index + 1);
    } else {
      // Si la ruta no existe, agrégala
      breadcrumbs.push({ url, label });
    }

    // Guardar los breadcrumbs actualizados en LocalStorage
    localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));

    // Actualizar el arreglo local con los nuevos breadcrumbs
    this.breadcrumbs = breadcrumbs;
  }

  obtenerBreadcrumbs() {
    return this.breadcrumbs;
  }

  private cargarBreadcrumbs() {
    // Obtener los breadcrumbs almacenados previamente (si los hay)
    const storedBreadcrumbs = localStorage.getItem('breadcrumbs');

    // Parsear los breadcrumbs almacenados en formato JSON
    const breadcrumbs = storedBreadcrumbs ? JSON.parse(storedBreadcrumbs) : [];

    // Actualizar el arreglo local con los breadcrumbs almacenados
    this.breadcrumbs = breadcrumbs;
  }
}







