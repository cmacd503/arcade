// Portal ID, Feature Layer, Feature Layer ID
var p = Portal('https://arcgis-server.psc.local/portal');

var qu_fl = 'd78e3575837c457b9b657257f1d89b71';  //qu_data
var qu_id = 8;

var fqu_fl = '68d26841830f43029f79f5b84961d28d'; // fqu_data
var fqu_id = 7;

var qu_fs = Filter(FeatureSetByPortalItem(p,qu_fl,qu_id,['*'],false),"hold_time IS NULL AND case_type <> 'INFO'"); //qu_fs
var fqu_fs = Filter(FeatureSetByPortalItem(p,fqu_fl,fqu_id,['*'],false),"hold_time IS NULL AND call_type <> 'INFO'"); //fqu_fs

// Create and populate a dictionary to combine data from the above feature layers

// Create empty array for features, feat object to populate array
var features = [];
var feat;

var combinedDict = {
    fields: [
        { name: 'source', type: 'esriFieldTypeString' },
        { name: 'jurisdiction', type: 'esriFieldTypeString' },
        { name: 'hold_date', type: 'esriFieldTypeDate' },
        { name: 'case_type', type: 'esriFieldTypeString' },
        { name: 'call_type', type: 'esriFieldTypeString' },
        { name: 'force_name', type: 'esriFieldTypeString' },
    ],
    geometryType: '',
    features: features,
};

// Loop through each of the FeatureSets and populate feature array.
for (var m in qu_fs) {
    feat = {
        attributes: {
            source: 'qu_data Police',
            jurisdiction: m['jurisdiction'],
            hold_date: m['hold_date'],
            case_type: m['case_type'],
            force_name: When(m['jurisdiction']=='BF','SAN BRUNO FIRE',m['jurisdiction']=='BP','BROADMOOR POLICE',m['jurisdiction']=='CF','CENTRAL COUNTY FIRE',m['jurisdiction']=='CO',"CORONER'S OFFICE",m['jurisdiction']=='DA','DISTRICT ATTORNEY',m['jurisdiction']=='DF','COUNTY FIRE',m['jurisdiction']=='DM','DEPARTMENT OF EMERGENCY',m['jurisdiction']=='DP','DALY CITY POLICE',m['jurisdiction']=='EF','SOUTH SF CITY EMS',m['jurisdiction']=='EM','EMS',m['jurisdiction']=='EP','EAST PALO ALTO POLICE',m['jurisdiction']=='FF','SOUTH SF CITY FRE',m['jurisdiction']=='FM','FIRE MUTUAL AID',m['jurisdiction']=='GT','GANG TASK FORCE',m['jurisdiction']=='HF','COASTSIDE FIRE',m['jurisdiction']=='LF','COLMA FIRE',m['jurisdiction']=='LM','LAW MUTUAL AID',m['jurisdiction']=='MF','MENLO PARK FIRE',m['jurisdiction']=='NF','NORTH COUNTY FIRE',m['jurisdiction']=='OE','OTHER EMS',m['jurisdiction']=='OF','OTHER FIRE',m['jurisdiction']=='OJ','OTHER POLICE',m['jurisdiction']=='PB','PROBATION',m['jurisdiction']=='PH','ANIMAL CONTROL',m['jurisdiction']=='PS','PUBLIC SAFETY COMMUNICATIONS',m['jurisdiction']=='PW','PUBLIC WORKS',m['jurisdiction']=='RF','REDWOOD CITY FIRE',m['jurisdiction']=='SF','SAN MATEO CONSOLIDATED FIRE',m['jurisdiction']=='SH','SHERIFF OFFICE',m['jurisdiction']=='SP','SPECIAL EVENTS',m['jurisdiction']=='TF','NTF/VTTF',m['jurisdiction']=='TP','TRANSIT POLICE',m['jurisdiction']=='WF','WOODSIDE FIRE','other'),
        },
    };
    Push(features, feat);
};

for (var p in fqu_fs) {
    feat = {
        attributes: {
            source: 'fqu_data Fire',
            jurisdiction: p['jurisdiction'],
            hold_date: p['hold_date'],
            case_type: p['call_type'],
            force_name: When(m['jurisdiction']=='BF','SAN BRUNO FIRE',m['jurisdiction']=='BP','BROADMOOR POLICE',m['jurisdiction']=='CF','CENTRAL COUNTY FIRE',m['jurisdiction']=='CO',"CORONER'S OFFICE",m['jurisdiction']=='DA','DISTRICT ATTORNEY',m['jurisdiction']=='DF','COUNTY FIRE',m['jurisdiction']=='DM','DEPARTMENT OF EMERGENCY',m['jurisdiction']=='DP','DALY CITY POLICE',m['jurisdiction']=='EF','SOUTH SF CITY EMS',m['jurisdiction']=='EM','EMS',m['jurisdiction']=='EP','EAST PALO ALTO POLICE',m['jurisdiction']=='FF','SOUTH SF CITY FRE',m['jurisdiction']=='FM','FIRE MUTUAL AID',m['jurisdiction']=='GT','GANG TASK FORCE',m['jurisdiction']=='HF','COASTSIDE FIRE',m['jurisdiction']=='LF','COLMA FIRE',m['jurisdiction']=='LM','LAW MUTUAL AID',m['jurisdiction']=='MF','MENLO PARK FIRE',m['jurisdiction']=='NF','NORTH COUNTY FIRE',m['jurisdiction']=='OE','OTHER EMS',m['jurisdiction']=='OF','OTHER FIRE',m['jurisdiction']=='OJ','OTHER POLICE',m['jurisdiction']=='PB','PROBATION',m['jurisdiction']=='PH','ANIMAL CONTROL',m['jurisdiction']=='PS','PUBLIC SAFETY COMMUNICATIONS',m['jurisdiction']=='PW','PUBLIC WORKS',m['jurisdiction']=='RF','REDWOOD CITY FIRE',m['jurisdiction']=='SF','SAN MATEO CONSOLIDATED FIRE',m['jurisdiction']=='SH','SHERIFF OFFICE',m['jurisdiction']=='SP','SPECIAL EVENTS',m['jurisdiction']=='TF','NTF/VTTF',m['jurisdiction']=='TP','TRANSIT POLICE',m['jurisdiction']=='WF','WOODSIDE FIRE','other'),
        },
    };
    Push(features, feat);
};

// Return dictionary cast as a feature set 
 return FeatureSet(combinedDict);
