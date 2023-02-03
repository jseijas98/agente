import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GetApis } from '../../interfaces/model.apis/model.getApis';
import StringUtils from '../../../common/util/stringUtils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.css']
})
export class ApiListComponent implements OnInit {

  baseUrl = environment.baseUrl;

  index:number= 2


  constructor(private http:HttpClient, private router:Router, public utils:StringUtils) { }

  ngOnInit(): void {

    this.Api(this.index);
  }

  //columnsas que se muestran
  displayedColumns: string[] = ["applId","api_id","nameSpace","test_interval","label_app","response_time","last_test","status","health","registros"];

  data: any[]=[];

  juan: any[]=[];


  //configuración del dataSource
  dataSource = new MatTableDataSource<any>(this.data);

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  Api(index: number){
    this.http.get<GetApis>(`${this.baseUrl}list/application/${index}/apis`).subscribe({
      next: this. getApisSuccess.bind(this),
      error: this.getApisError.bind(this)
    });
  }

  registro:string = "registros historicos";
  replicas:string = "replicas del api "


  getApisSuccess(respose:any){
    let apisList: Array<GetApis>=respose

    apisList.forEach(api => {

      this.data.push({
        api_id: api.apiId,
        status: api.status,
        nameSpace: api.nameSpace,
        test_interval: api.testInterv,
        label_app: api.label_app,
        response_time: api.response_time,
        last_test:this.utils.convertDate(api.lastTestDate),
        health: api.health,
        applId: api.applicationId
      })
      console.log(this.data);      
    });

      this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;
  }

  getApisError(error:any){
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  rowGetApiId(api_id: any){
    this.router.navigateByUrl(`apis-replicas/${api_id}`);
  }


   ApiRegiistry(registry:any, applId:any){
    this.router.navigateByUrl(`apis-registry/${applId}`);
   }



  }
