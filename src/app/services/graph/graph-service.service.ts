import { Injectable } from '@angular/core';
import StringUtils from 'src/app/common/util/stringUtils';
import { Multi, Series } from 'src/app/modules/interfaces/multi';

@Injectable({
  providedIn: 'root',
})
export class GraphServiceService {
  constructor(public utils: StringUtils) {}



  dataGraph(response: any, name: any): Object[] {
    let datanew: Array<any> = response;
    let multi: Object[] = [];
    let series: Series[] = [];
    let multi2: Multi;

    datanew.filter(x=>x.lastTestDate != null).map((element) => {
      series.push({
        value: this.utils.converPorcent(element.health),
        name: this.utils.parseDate(this.utils.formatDate(element.lastTestDate)),
      });
      multi2 = { name: name, series: series };
      multi = [multi2];
    });

    console.log('service', multi);

    return multi;
  }

  dataGraph_load_balancer(response: any, name: any): Object[] {

    // console.log('input series',response,name);
    
    let datanew: Array<any> = response;
    const series: Series[] = [];
    let multi: Object[] = [];
    let multi2: Multi;

    datanew.filter(x=>x.lastTestDate != null).map((element) => {
      series.push({
        value: element.response_time,
        name: this.utils.parseDate(this.utils.formatDate(element.lastTestDate)),
      });
      multi2 = { name: name, series: series };
      multi = [multi2];
    });
    console.log('series services', multi);
    return multi;
  }

  dataGraph_(response: any, name: any): Object[] {
    let datanew: Array<any> = response;

    let multi: Object[] = [];
    let series: Series[] = [];
    let multi2: Multi;

    datanew.filter(x=>x.lastTestDate != null).map((element) => {
      series.push({
        value: element.response_time,
        name: this.utils.parseDate(this.utils.formatDate(element.lastTestDate)),
      });
      multi2 = { name: name, series: series };
      multi = [multi2];
    });

    console.log('service', multi);

    return multi;
  }

}
