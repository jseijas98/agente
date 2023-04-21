export const environment = {
  production: true,
  baseUrl: 'http://180.183.170.56:30446/monitor-agent-service/',
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
  maxReconectValues:50
}
};
