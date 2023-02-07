import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { PersistenceList } from 'src/app/modules/interfaces/model.persistence/model.persistence-list';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-persistence-list',
  templateUrl: './persistence-list.component.html',
  styleUrls: ['./persistence-list.component.css']
})
export class PersistenceListComponent implements OnInit {

  baseUrl = environment.baseUrl;

  index: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils
  ) {}

  ngOnInit(): void {
    this.persistence(this.index);
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'persistence_id',
    'applId',
    'test_interval',
    'description',
    'response_time',
    'last_test',
    'status',
    'consecutiveFailedTest',
    'consecutiveSuccessfulTest',
  ];

  data: any[] = [];

  juan: any[] = [];

  //configuración del dataSource
  dataSource = new MatTableDataSource<any>(this.data);

  //paginacion del las tablas
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  persistence(index: number) {
    this.http
      .get<PersistenceList>(`${this.baseUrl}list/application/${index}/persistence`)
      .subscribe({
        next: this.getPersistenceSuccess.bind(this),
        error: this.getPersistenceError.bind(this),
      });
  }

  registro: string = 'registros historicos';

  getPersistenceSuccess(respose: any) {
    let PersistenceList: Array<PersistenceList> = respose;

    PersistenceList.forEach((persistence) => {
      this.data.push({
        persistence_id: persistence.dbId,
        status: persistence.status,
        test_interval: persistence.testInterv,
        response_time: persistence.response_time,
        last_test: this.utils.convertDate(persistence.lastTestDate),
        applId: persistence.applicationId,
        consecutiveFailedTest: persistence.consecutiveFailedTest,
        consecutiveSuccessfulTest: persistence.consecutiveSuccessfulTest,
        description: persistence.description,
      });
      console.log(this.data);
    });

    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getPersistenceError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
  persistenceRegistry(applId: any) {
    this.router.navigateByUrl(`persistence-registry/${applId}`);
  }

}
