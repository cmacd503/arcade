// Portal ID, Feature Layer, Feature Layer ID
var p = Portal('https://arcgis-server.psc.local/portal');

// portal ID
var portal = Portal('https://arcgis-server.psc.local/portal');

//Feature Layer
// cc_data Police
var police = Filter(FeatureSetByPortalItem(portal,'25c4b7ec65be40128896d1aa76945c41',2,['rin','jurisdiction'],false),"jurisdiction IN('BP','CO','DA','DP','EP','GT','LM','OJ','PB','PH','PS','SH','SP','TF','TP')");
// cl_data Fire
var fire = Filter(FeatureSetByPortalItem(portal,'ce17a2ca4b3943be9cccd7b6966fd1c3',4,['rin','jurisdiction'],false),"jurisdiction IN('BF','CF','DF','DM','FF','FM','HF','LF','MF','NF','OF','PW','RF','SF','WF')");
// cl_data EMS
var ems = Filter(FeatureSetByPortalItem(portal,'ce17a2ca4b3943be9cccd7b6966fd1c3',4,['rin','jurisdiction'],false),"jurisdiction IN('EF','EM','OE')");

// Create and populate a dictionary to combine data from the above feature layers:

// Create empty array for features, feat object to populate array
var features = [];
var feat;

// Loop through FeatureSets and populate feature array.
for (var p in police) {
    feat = {
        attributes: {
            force: 'Police',
            rin: p['rin'],
            jurisdiction: p['jurisdiction'],
            //service_type: WHEN(p['jurisdiction']=='BP','P',p['jurisdiction']=='CO','C',p['jurisdiction']=='DA','P',p['jurisdiction']=='DP','P',p['jurisdiction']=='EP','P',p['jurisdiction']=='GT','P',p['jurisdiction']=='LM','P',p['jurisdiction']=='OJ','P',p['jurisdiction']=='PB','R',p['jurisdiction']=='PH','A',p['jurisdiction']=='PS','D',p['jurisdiction']=='SH','P',p['jurisdiction']=='SP','P',p['jurisdiction']=='TF','P',p['jurisdiction']=='TP','P',''),
        },
    };
    Push(features, feat);
};

for (var f in fire) {
    feat = {
        attributes: {
            force: 'Fire',
            rin: f['rin'],
            jurisdiction: f['jurisdiction'],
            //service_type: WHEN(f['jurisdiction']=='BF','F',f['jurisdiction']=='CF','F',f['jurisdiction']=='DF','F',f['jurisdiction']=='DM','F',f['jurisdiction']=='FF','F',f['jurisdiction']=='FM','M',f['jurisdiction']=='HF','F',f['jurisdiction']=='LF','F',f['jurisdiction']=='MF','F',f['jurisdiction']=='NF','F',f['jurisdiction']=='OF','F',f['jurisdiction']=='PW','W',f['jurisdiction']=='RF','F',f['jurisdiction']=='SF','F',f['jurisdiction']=='WF','F',''),
        },
    };
    Push(features, feat);
};

for (var e in ems) {
    feat = {
        attributes: {
            force: 'EMS',
            rin: e['rin'],
            jurisdiction: e['jurisdiction'],
            //service_type: WHEN(e['jurisdiction']=='EF','E',e['jurisdiction']=='EM','E',e['jurisdiction']=='OE','E',''),
        },
    };
    Push(features, feat);
};

var combinedDict = {
    fields: [
        { name: 'force', type: 'esriFieldTypeString' },
        { name: 'rin', type: 'esriFieldTypeString' },
        { name: 'jurisdiction', type: 'esriFieldTypeString' },
        //{ name: 'service_type', type: 'esriFieldTypeString' },
    ],
    geometryType: '',
    features: features,
};

// Return dictionary cast as a feature set 
return FeatureSet(combinedDict);
