import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import StringUtils from 'src/app/common/util/stringUtils';
import { PicList } from 'src/app/modules/interfaces/model.pic/model.pic-list';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pic-list',
  templateUrl: './pic-list.component.html',
  styleUrls: ['./pic-list.component.css'],
})
export class PicListComponent implements OnInit {
  baseUrl = environment.baseUrl;

  index: number = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    public utils: StringUtils
  ) {}

  ngOnInit(): void {
    this.Pic(this.index);
  }

  //columnsas que se muestran
  displayedColumns: string[] = [
    'pic_id',
    'applId',
    'channel',
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

  Pic(index: number) {
    this.http
      .get<PicList>(`${this.baseUrl}list/application/${index}/integration`)
      .subscribe({
        next: this.getPicSuccess.bind(this),
        error: this.getPicError.bind(this),
      });
  }

  registro: string = 'registros historicos';
  replicas: string = 'replicas de pic ';

  getPicSuccess(respose: any) {
    let picList: Array<PicList> = respose;

    picList.forEach((pic) => {
      this.data.push({
        pic_id: pic.integrationId,
        status: pic.status,
        channel: pic.channel,
        test_interval: pic.testInterv,
        response_time: pic.response_time,
        last_test: this.utils.convertDate(pic.lastTestDate),
        applId: pic.applicationId,
        consecutiveFailedTest: pic.consecutiveFailedTest,
        consecutiveSuccessfulTest: pic.consecutiveSuccessfulTest,
        description: pic.description,
      });
      console.log(this.data);
    });

    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  getPicError(error: any) {
    console.error(error);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
  PicRegistry(applId: any) {
    this.router.navigateByUrl(`pic-registry/${applId}`);
  }
}
