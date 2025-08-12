// Portal ID; Feature Layer; Feature Layer ID:
var p = Portal('https://arcgis-server.psc.local/portal');
var fl = '0c3c4b86eb45437aa0c0a2460c9bb302'; //fl name = at_data_Spatial
var id = 1;

// create Feature Set
var fs = FeatureSetByPortalItem(p,fl,id,['*'],false);
// to load select specific fields only: ['rin','jurisdiction','occ_year','case_type']
// to return geometry, not just table:        true)

/*
// to Filter the Feature Set
var fs = 
Filter(FeatureSetByPortalItem(p,fl,id,['*'],false),"enroute_time IS NOT NULL AND (recom_for_type IN ('B17', 'BC', 'LFB', 'E', 'EO', 'LFE', 'T', 'Q', 'LFT', 'RW', 'SQM', 'SQ4', 'RN', 'USR'))");

// to get a list of existing fields
var fields = Schema(fs)['fields'];
return fields
*/

return (fs);
