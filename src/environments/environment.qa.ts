export const environment = {
  production: false,
    domainStream:"https://bdvmetricas.banvenez.com.ve/",
    baseUrl:"https://bdvmetricas.banvenez.com.ve/",
  streamPath:"bdvanalitycs",
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
    maxReconectValues:1,
    maxReconect:100000000
  }
}
