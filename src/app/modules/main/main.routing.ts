import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { GraphAppComponent } from './graph-app/graph-app.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'graph-app',
        component: GraphAppComponent,
      },
    ],
  },
];

export const MainRoutes = RouterModule.forChild(routes);
