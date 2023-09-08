import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

interface Breadcrumb {
  url: string;
  label: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnChanges {

  @Input() breadcrumbsData: Breadcrumb[] = [];
  @Input() title: String = '';
  @Input() app: String = ''
  @Input() element: String = ''


  breadcrumbService = inject(BreadcrumbService)
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    this.breadcrumbs = this.breadcrumbService.obtenerBreadcrumbs();
    console.log(this.breadcrumbs);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['breadcrumbsData'] && this.breadcrumbsData.length > 0) {
      this.breadcrumbs = this.createBreadcrumbs(this.router.url);
    }

  }

  private createBreadcrumbs(currentUrl: string): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    for (const breadcrumbData of this.breadcrumbsData) {
      breadcrumbs.push({
        label: breadcrumbData.label,
        url: breadcrumbData.url
      });

      if (currentUrl.startsWith(breadcrumbData.url)) {
        currentUrl = currentUrl.replace(breadcrumbData.url, '');
      }
    }

    return breadcrumbs;
  }
}
