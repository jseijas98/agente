import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiReplicasResgistry } from '../../../interfaces/model.apis/model.apiReplicasResgistry';
import StringUtils from '../../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-registrys-apis-replicas',
  templateUrl: './registrys-apis-replicas.component.html',
  styleUrls: ['./registrys-apis-replicas.component.css']
})
export class RegistrysApisReplicasComponent implements OnInit {

  constructor(private http:HttpClient) { }

  baseUrl = environment.baseUrl;

  displayedColumns: string[] = ["api_id","nameSpace","test_interval","label_app","response_time","last_test","status","health"];

 data: any[]=[];

 //configuración del dataSource
 dataSource = new MatTableDataSource<any>(this.data);

 //paginacion del las tablas
 @ViewChild(MatPaginator, { static: true }) paginator!:MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.Api(1);
  }

  Api(index: number){
    this.http.get<ApiReplicasResgistry>(`${this.baseUrl}registry/apis/replica/${index}/10.244.2.141`).subscribe({
      next: this. getApiReplicasResgistry.bind(this),
      error: this.getApiReplicasResgistryError.bind(this)
    });
  }

  getApiReplicasResgistry(respose:any){
    let apisList: Array<ApiReplicasResgistry>=respose
    console.log(apisList)
  }

  getApiReplicasResgistryError(error:any){
    console.log(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
