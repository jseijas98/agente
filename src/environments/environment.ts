// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl :'http://180.183.170.56:30446/monitor-agent-service/',
  Cisnerosip:'http://180.183.85.70:80/',
  listAplications:'/list/application/',

  url:{
        delete:'http://180.183.170.56:30446/monitor-agent-service/edit/delete',
        add:'http://180.183.170.56:30446/monitor-agent-service/edit/newElement',
        newValue:'http://180.183.170.56:30446/monitor-agent-service/edit/newValue',
        newDB:'http://180.183.170.56:30446/monitor-agent-service/edit/newPersistence',
        element:'http://180.183.170.56:30446/monitor-agent-service/v2/get/element',
        modify:'http://180.183.170.56:30446/monitor-agent-service/edit/editElement'

  },

  admin:{
    appList:'admin/apps',
    findUser:'admin/findUser',
    saveAlias: 'admin/saveAlias',
    getPathsForUserAndApp:'admin/findPaths'
},
properties:{
  bdvpersonasMaxUsersActives:100000,
  bdvempresasMaxUsersActives:1000,
  maxValuesForLineGraph:50,
  maxReconectValues:5
}


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
