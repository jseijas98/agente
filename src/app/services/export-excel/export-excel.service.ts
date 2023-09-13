import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {


exportToExcel(dataSource:MatTableDataSource<any>,displayedColumns:any[] = [], fileName:string): void {
  const data = dataSource.filteredData; // Obtén los datos filtrados de la MatTableDataSource

  // Define las columnas que deseas exportar en el orden que prefieras
  const columnsToExport = displayedColumns

  // Crea una matriz de objetos que contenga solo las columnas seleccionadas
  const dataArray = data.map(item => {
    const rowData: { [key: string]: any } = {};
    columnsToExport.forEach(column => {
      rowData[column] = item[column];
    });
    return rowData;
  });

  // Crea una hoja de cálculo
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray);

  // Crea un libro de trabajo y agrega la hoja de datos
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');

  // Genera un archivo Excel y descárgalo
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

}
