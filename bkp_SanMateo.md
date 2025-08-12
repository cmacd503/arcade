San Mateo 911 Dashboard – Arcade Data Expressions
https://arcgis-server.psc.local/portal/home/
https://arcgis-server.psc.local/server/manager/#

CAD_at_data
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
//at_data_Spatial
var fl = '0c3c4b86eb45437aa0c0a2460c9bb302';
var id = 1;

var fs = FeatureSetByPortalItem(p,fl,id,['*'],false);

return (fs);
CAD_cc_data
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
//cc_data
var fl = '25c4b7ec65be40128896d1aa76945c41';
var id = 2;

var fs = FeatureSetByPortalItem(p,fl,id, ['rin','jurisdiction','occ_year','case_type'],false);
return fs;

CAD_cl_data
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// cl_data
var fl = 'ce17a2ca4b3943be9cccd7b6966fd1c3';
var id = 4;

var fs = FeatureSetByPortalItem(p,fl,id, ['*'],false);

return fs;

CAD_fat_data
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// fat_data_Spatial
var fl = 'ada5ae89d5734e1ebf8f837792a21350';
var id = 5;

var fs = FeatureSetByPortalItem(p,fl,id,['*'],false);

return (fs);

CAD_fdp_data
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
//fdp_data
var fl = '50e669abc3d44d2fabe2a065aca20b16';
var id = 6;

// load featureset
var fs = 
Filter(FeatureSetByPortalItem(p,fl,id,['*'],false),"enroute_time IS NOT NULL AND (recom_for_type IN ('B17', 'BC', 'LFB', 'E', 'EO', 'LFE', 'T', 'Q', 'LFT', 'RW', 'SQM', 'SQ4', 'RN', 'USR'))");

// get existing fields
var fields = Schema(fs)['fields'];

// define new field(s)
var new_fields = [
    {name: "ChuteTime", type: "esriFieldTypeInteger"},
    {name: "r0", type: "esriFieldTypeString"},
    {name: "r10", type: "esriFieldTypeString"},
    {name: "r20", type: "esriFieldTypeString"},
    {name: "r30", type: "esriFieldTypeString"},
    {name: "r40", type: "esriFieldTypeString"},
    {name: "r50", type: "esriFieldTypeString"},
    {name: "r60", type: "esriFieldTypeString"},
    {name: "r70", type: "esriFieldTypeString"},
    {name: "r80", type: "esriFieldTypeString"},
    {name: "r90", type: "esriFieldTypeString"},
    {name: "r100", type: "esriFieldTypeString"},
    {name: "r110", type: "esriFieldTypeString"},
]

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// populate the featureset
for (var i in fs) {
    var att = {}
    // for each existing field, load rows/values
    for(var field in i) {
        att[field] = i[field]
    }
    // insert the values for the new field(s)
    var chuteTime = DateDiff(i.enroute_time, i.dispatch_time, 'seconds');
    att["ChuteTime"] = chuteTime
       
    // append the features to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);


CAD_stats
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// stats_table
var fl = '1c1429343c4541d8ad84d6ec76825e55';
var id = 10;

// load featureset
var fs = FeatureSetByPortalItem(p,fl,id,['*'],false);

return fs;

PendingCalls
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
var qu_fl = 'd78e3575837c457b9b657257f1d89b71'; //qu_data
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

AverageAnswerTimeByLineGroup
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// load GrafanaCallView_Table
var c_fs = Filter(FeatureSetByPortalItem(p,"efc5481170e04db9b8f59a4f1c490cb0",11, ['*'],false),"CallType=0");
// load LineGroup_Table
var linegroup_fs = FeatureSetByPortalItem(p,"da86685b9c6843648eea8c1b636f8a73",12, ['*'],false);
// load Line_Table
var line_fs = FeatureSetByPortalItem(p,"65ad87a1d6d74228aab3bbe1ffeb38ea",13, ['*'],false);

// Create and populate a dictionary to combine data from the above feature layers

// Create empty features array and feat object
var features = [];
var feat;

// Populate Feature Array, join tables
for (var c in c_fs) {
  var tableID = c["Line"]
  for (var l in Filter(line_fs, "ID = "+tableID)){
      feat = {
        attributes: {
            ID: tableID,
            Line: c["Line"],
            TotalRingTime: c["TotalRingTime"],
            LineGroup: l["LineGroup"],
        }
      }
  Push(features,feat)
  }
};

var joinedDict = {
    fields: [
      {name: "ID", type: "esriFieldTypeString"},
      {name: "Line", type: "esriFieldTypeString"},
      {name: "TotalRingTime", type: "esriFieldTypeInteger"},
      {name: "LineGroup", type: "esriFieldTypeString"},
    ],
    'geometryType': '',
    'features':features
};

//Return dictionary cast as a feature set
return FeatureSet(joinedDict);


CallsByClass
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

AverageAnswerTime
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
var c_fs = Filter(FeatureSetByPortalItem(p,"efc5481170e04db9b8f59a4f1c490cb0",11, ['*'],false),"TotalRingTime>0 AND TotalRingTime<300000 AND CallType=0");  // GrafanaCallView
var l_fs = FeatureSetByPortalItem(p,"65ad87a1d6d74228aab3bbe1ffeb38ea",13, ['*'],false);  // Line

// Create and populate a dictionary to combine data from the above feature layers:

// Create empty features array and feat object
var features = [];
var feat;

var joinedDict = {
    fields: [
      {name: "ID", type: "esriFieldTypeInteger"},
      {name: "Line", type: "esriFieldTypeInteger"},
      {name: "TotalRingTime", type: "esriFieldTypeInteger"},
      {name: "TotalRingTimeSec", type: "esriFieldTypeDouble"},
      {name: "CallType", type: "esriFieldTypeInteger"},
      {name: "LineGroup", type: "esriFieldTypeInteger"},
    ],
    'geometryType': '',
    'features':features
};

// Populate Feature Array; join tables
for (var c in c_fs) {
  var tableID = c["Line"]
  for (var l in Filter(l_fs, "ID = "+tableID)){
      feat = {
        attributes: {
            ID: tableID,
            Line: c["Line"],
            TotalRingTime: c["TotalRingTime"],
            TotalRingTimeSec: c["TotalRingTime"]/1000,
            CallType: c["CallType"],
            LineGroup: l["LineGroup"],
        }
      }
  Push(features,feat)
  }
};

//Return dictionary cast as a feature set
return FeatureSet(joinedDict);

Telephone_GrafanaCallView
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// GrafanaCallView
var fl = 'efc5481170e04db9b8f59a4f1c490cb0';
var id = 11;

var fs = FeatureSetByPortalItem(p,fl,id, ['*'],false);

return fs;

NumberOfTelephoneCallsAnsweredByDispatchers
// set Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
var c_fs = Filter(FeatureSetByPortalItem(p,"efc5481170e04db9b8f59a4f1c490cb0",11, ['*'],false),"CallType=0"); // GrafanaCallView
var a_fs = FeatureSetByPortalItem(p,"b9cc1a6e31fa42269faeca238a8e7a7c",14, ['Id','ObjectId','Name'],false); // Agent

// Create and populate a dictionary to combine data from the above feature layers:

// Create empty features array and feat object
var features = [];
var feat;

// Populate Feature Array; Join tables
for (var c in c_fs) {
  var tableID = c["Agent"]
  for (var a in Filter(a_fs, "ObjectID = "+tableID)){
      feat = {
        attributes: {
            ID: tableID,
            Agent: a["Name"],
            AgentID: a["Id"],
        }
      }
  Push(features,feat)
  }
};

var joinedDict = {
    fields: [
      {name: "ID", type: "esriFieldTypeString"},
      {name: "Agent", type: "esriFieldTypeString"},
      {name: "AgentID", type: "esriFieldTypeInteger"},
    ],
    'geometryType': '',
    'features':features
};

//Return dictionary cast as a feature set
return FeatureSet(joinedDict);

ActiveResponseTimePolice
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
var f = '19ba22010e684ccc8fa495d1d5a7faa1';
var id = 3;

// load featureset
var fs2 = FeatureSetByPortalItem(p, f, id, ['rin','occ_date','jurisdiction','at_scene_time','dispatch_time','priority'], false);

var fs1 = Filter(fs2,"dispatch_time IS NOT NULL AND at_scene_time IS NOT NULL")
var fs = Filter(fs1,"response_time>1")

// Create a featureset that combines existing fields with new fields to categorize the data:

// get existing fields
var fields = Schema(fs)['fields'];

// define new field(s)
var new_fields = [
    {name: "ResponseTimeSec", type: "esriFieldTypeInteger"},
    {name: "ResponseTimeMin", type: "esriFieldTypeDouble"},
];

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// populate the featureset
for (var i in fs) { // set for counter 'i'
    var att = {} // set attribute container
    // copy existing field values
    for(var field in i) {
        var value = i[field]
        att[field] = value
    }
    // insert the values for the new field(s)
    var timeDiffSec = DateDiff(i.at_scene_time, i.dispatch_time, 'seconds');
    var timeMilliseconds = Number(i.at_scene_time)-Number(i.dispatch_time)

    att["ResponseTimeSec"] = timeDiffSec
    att["ResponseTimeMin"] = timeMilliseconds/1000/60
    // append the features to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);



ENTER TITLE HERE – CC DATA?
// set Portal ID
var p = Portal('https://arcgis-server.psc.local/portal')

// load cc_data
var cc_fs = FeatureSetByPortalItem(p,"25c4b7ec65be40128896d1aa76945c41",2, ['*'],false);
// load site_config
var sc_fs = FeatureSetByPortalItem(p,"12b33b211d974c1a95be290626d4113f",9, ['*'],false);
return cc_fs

// Create empty features array and feat object
var features = [];
var feat;

// Populate Feature Array; Join tables
for (var cc in cc_fs) {
  var tableID = cc["Jurisdiction"]
  for (var sc in Filter(sc_fs, "Jurisdiction = "+tableID)){
      feat = {
        attributes: {
            ID: tableID,
            Agent: sc["Name"],
            AgentID: sc["Id"],
        }
      }
  Push(features,feat)
  }
}

var joinedDict = {

    fields: [
      {name: "ID", type: "esriFieldTypeString"},
      {name: "Agent", type: "esriFieldTypeString"},
      {name: "AgentID", type: "esriFieldTypeInteger"},
    ],
    'geometryType': '',
    'features':features
};

//Return dictionary cast as a feature set
return FeatureSet(joinedDict);


LawReceivedToEntry
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// cc_data_summary_view
var fl = '19ba22010e684ccc8fa495d1d5a7faa1';
var id = 3;

var fs = Filter(
    FeatureSetByPortalItem(p,fl,id,['rin','occ_year','priority','orig_time_queued','time_received','jurisdiction','how_received','queued_type'],false),
         "occ_year = 25 AND queued_type = 'R' AND (how_received IN ('T','9')) AND jurisdiction <> 'PS'"
         );

// Create a featureset that combines existing fields with new fields to categorize the data:

// get existing fields
var fields = Schema(fs)['fields'];

// define new field(s)
var new_fields = [
    {name: "ElapsedTimeSec", type: "esriFieldTypeInteger"},
    {name: "RecdToEntry_Times", type: "esriFieldTypeString"},
    {name: "PriorityName", type: "esriFieldTypeString"},
];

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// populate the featureset
for (var i in fs) { // set for counter 'i'
    var att = {} // set attribute container
    // copy existing field values
    for(var field in i) {
        var value = i[field]
        att[field] = value
    }
    // insert the values for the new field(s)
    var timeDiff = DateDiff(i.orig_time_queued, i.time_received, 'seconds');
    var timeCat = When(timeDiff >= 0 && timeDiff <= 30, '0 to 30 seconds', timeDiff >= 31 && timeDiff <= 60, '31 to 60 seconds', timeDiff >= 61 && timeDiff <= 90, '61 to 90 seconds', timeDiff >= 91 && timeDiff <= 120, '90 to 120 seconds', timeDiff > 120, 'Over 120 seconds', '')
    att["ElapsedTimeSec"] = timeDiff // load the elapsed time in seconds
    att["RecdToEntry_Times"] = timeCat // load the categories for elapsed time in seconds

    var pri = i.priority;
    var prio = When(pri == 1, 'Priority 1', pri == 2, 'Priority 2',pri == 3, 'Priority 3',pri == 4, 'Priority 4',pri == 5, 'Priority 5',pri == 6, 'Priority 6',pri == 7, 'Priority 7',pri == 8, 'Priority 8',pri == 9, 'Priority 9','')
    att["PriorityName"] = prio

    // append the features to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);


LawEntrytoDispatch
// Portal ID
var p = Portal('https://arcgis-server.psc.local/portal');

var fl = '19ba22010e684ccc8fa495d1d5a7faa1';
var id = 3;

// load featureset data
var fs = Filter(
    FeatureSetByPortalItem(p,fl,id,['rin','occ_year','dispatch_time','orig_time_queued','jurisdiction','how_received','queued_type','priority'],false),
         "occ_year = 25 AND (how_received IN ('T','9')) AND queued_type = 'R' AND jurisdiction <> 'PS'"
         );


// Create a featureset that combines existing fields with new fields to categorize the data:

// get existing fields
var fields = Schema(fs)['fields'];

// define new field(s)
var new_fields = [
    {name: "ElapsedTimeSec", type: "esriFieldTypeInteger"},
    {name: "EntryToDispatch_Times", type: "esriFieldTypeString"},
    {name: "PriorityName", type: "esriFieldTypeString"},
];

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// populate the featureset
for (var i in fs) { // set for counter 'i'
    var att = {} // set attribute container
    // copy existing field values
    for(var field in i) {
        var value = i[field]
        att[field] = value
    }
    // insert the values for the new field(s)
    var timeDiff = DateDiff(i.dispatch_time, i.orig_time_queued, 'seconds');
    var timeCat = When(IsEmpty(i.dispatch_time), 'Not Dispatched', timeDiff<0,'data entry error',timeDiff >= 0 && timeDiff <= 30, '0 to 30 seconds', timeDiff >= 31 && timeDiff <= 60, '31 to 60 seconds', timeDiff >= 61 && timeDiff <= 90, '61 to 90 seconds', timeDiff >= 91 && timeDiff <= 120, '91 to 120 seconds', timeDiff > 120, 'Over 120 seconds', '')
    att["ElapsedTimeSec"] = timeDiff // load the elapsed time in seconds
    att["EntryToDispatch_Times"] = timeCat // load the categories for elapsed time in seconds

    var pri = i.priority;
    var prio = When(pri == 1, 'Priority 1', pri == 2, 'Priority 2',pri == 3, 'Priority 3',pri == 4, 'Priority 4',pri == 5, 'Priority 5',pri == 6, 'Priority 6',pri == 7, 'Priority 7',pri == 8, 'Priority 8',pri == 9, 'Priority 9','')
    att["PriorityName"] = prio

    // append the features to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);


FireEMSReceivedToEntry
// Portal info
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// cl_data
var fl = 'ce17a2ca4b3943be9cccd7b6966fd1c3';
var id = 4;

// load Filtered featureset data
var fs = Filter(FeatureSetByPortalItem(p, fl, id, ['rin','occ_year','time_queued','time_received','priority','jurisdiction','how_received','queued_type'],false),
"occ_year = 25 AND queued_type = 'R' AND (how_received IN ('T','9')) AND jurisdiction <> 'PS'");

// Create a featureset that combines existing fields with new fields to categorize the data:

// get existing fields
var fields = Schema(fs)['fields'];
//return fields
// define the new field(s)
var new_fields = [
    {name: "ElapsedTimeSec", type: "esriFieldTypeString"},
    {name: "RecdToEntry_Times", type: "esriFieldTypeString"},
    {name: "PriorityName", type: "esriFieldTypeString"},
];

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// fill the featureset
for (var i in fs) {
    var att = {}
    // copy existing field values
    for(var field in i) {
        var value = i[field]
        att[field] = value
    }
    // insert the new value(s)
    var diff = DateDiff(i.time_queued, i.time_received, 'seconds');
    var new_value1 = When(diff >= 0 && diff <= 30, '0 to 30 seconds', diff > 30 && diff <= 60, '30 to 60 seconds', diff > 60 && diff <= 90, '60 to 90 seconds', diff > 90 && diff <= 120, '90 to 120 seconds', 'Over 120 seconds')
    att["RecdToEntry_Times"] = new_value1
    att["ElapsedTimeSec"] = diff

    var pri = i.priority;
    var prio = When(pri == 1, 'Priority 1', pri == 2, 'Priority 2',pri == 3, 'Priority 3',pri == 4, 'Priority 4',pri == 5, 'Priority 5',pri == 6, 'Priority 6',pri == 7, 'Priority 7',pri == 8, 'Priority 8',pri == 9, 'Priority 9','')
    att["PriorityName"] = prio

    // append the feature to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);




FireEMSEntrytoDispatch
// Portal info
var p = Portal('https://arcgis-server.psc.local/portal');

// Feature Layer
// cl_data
var fl = 'ce17a2ca4b3943be9cccd7b6966fd1c3';
var id = 4;

// load Filtered featureset data
var fs = FeatureSetByPortalItem(p, fl, 4, ['rin','occ_year','dispatch_time','time_queued','jurisdiction','how_received','queued_type','priority'],false);
var fs = Filter(fs, "occ_year = 25 AND queued_type = 'R' AND (how_received IN ('T','9')) AND jurisdiction <> 'PS'");

// Create a featureset that combines existing fields with new fields to categorize the data:

// get existing fields
var fields = Schema(fs)['fields'];

// define new field(s)
var new_fields = [
    {name: "ElapsedTimeSec", type: "esriFieldTypeInteger"},
    {name: "EntryToDispatch_Times", type: "esriFieldTypeString"},
    {name: "PriorityName", type: "esriFieldTypeString"},
];

// splice the existing and new fields into single schema
var out_fs = {
    fields: Splice(fields, new_fields),
    geometryType: '',
    features: []
};

// populate the featureset
for (var i in fs) { // set for counter 'i'
    var att = {} // set attribute container
    // copy existing field values
    for(var field in i) {
        var value = i[field]
        att[field] = value
    }
    // insert the values for the new field(s)
    var timeDiff = DateDiff(i.dispatch_time, i.time_queued, 'seconds');
    var timeCat = When(IsEmpty(i.dispatch_time), 'Not Dispatched', timeDiff<0,'data entry error', timeDiff >= 0 && timeDiff <= 30, '0 to 30 seconds', timeDiff >= 31 && timeDiff <= 60, '31 to 60 seconds', timeDiff >= 61 && timeDiff <= 90, '61 to 90 seconds', timeDiff >= 91 && timeDiff <= 120, '91 to 120 seconds', timeDiff > 120, 'Over 120 seconds', '')
    att["ElapsedTimeSec"] = timeDiff // load the elapsed time in seconds
    att["EntryToDispatch_Times"] = timeCat // load the categories for elapsed time in seconds

    var pri = i.priority;
    var prio = When(pri == 1, 'Priority 1', pri == 2, 'Priority 2',pri == 3, 'Priority 3',pri == 4, 'Priority 4',pri == 5, 'Priority 5',pri == 6, 'Priority 6',pri == 7, 'Priority 7',pri == 8, 'Priority 8',pri == 9, 'Priority 9','')
    att["PriorityName"] = prio

    // append the features to the featureset
    Push(out_fs.features, {attributes: att, geometry: Geometry(i)})
};

return Featureset(out_fs);



Fire Chute Times Graph – Arcade visualization per category
var ct = $datapoint.avg_ChuteTime

var statusColor = When(
  $datapoint.avg_ChuteTime <= 60, '#3EC200',
  $datapoint.avg_ChuteTime > 90, '#B53D02', '#C6C300'
  )

return {
  cells: {
    recom_for_type: {
      displayText : $datapoint.recom_for_type,
      textColor: '',
      backgroundColor: '',
      textAlign: 'left',
      iconName: '',
      iconAlign: '',
      iconColor: '',
      iconOutlineColor: ''
    },
    
    avg_ChuteTime: {
      displayText : Round(ct,0),
      textColor: '',
      backgroundColor: statusColor,
      textAlign: 'right',
      iconName: '',
      iconAlign: '',
      iconColor: '',
      iconOutlineColor: ''
    }
  }
}

AverageAnswerTimeByLineGroup dynamic colors
 var convertedValue = Round($datapoint.avg_TotalRingTime*0.001,1);

var threshold1 = 10; //seconds
var threshold2 = 30; //seconds

if (convertedValue <= 10) {
return {
  topText: convertedValue,
  topTextColor: '#00FF00', //green
  topTextOutlineColor: '',
  topTextMaxSize: 'medium',
  bottomText: "sec",
  bottomTextColor: '#00FF00', //green
  bottomTextOutlineColor: '',
  bottomTextMaxSize: 'x-small',
  }
}

else if (convertedValue >= 30) {
return {
  topText: convertedValue,
  topTextColor: '#FF0000', //red
  topTextOutlineColor: '',
  topTextMaxSize: 'medium',
  bottomText: "sec",
  bottomTextColor: '#FF0000', //red
  bottomTextOutlineColor: '',
  bottomTextMaxSize: 'x-small',
  }
}

else {
return {
  topText: convertedValue,
  topTextColor: '#FFFF00', //yellow
  topTextOutlineColor: '',
  topTextMaxSize: 'medium',
  bottomText: "sec",
  bottomTextColor: '#FFFF00', //yellow
  bottomTextOutlineColor: '',
  bottomTextMaxSize: 'x-small',
  }
}
Web Map Google Street View:
//https://support.esri.com/en-us/knowledge-base/why-does-arcgis-online-use-a-deprecated-spatial-referen-000013950
// link to Google Street View in Web Map popup

var PointGeometry = Geometry($feature);
var ArcadeX = PointGeometry.x;
var ArcadeY = PointGeometry.y;
var ArcadeSr = PointGeometry.spatialReference.wkid;
var Latitude, Longitude;

function AuxSphereToLatLon(x, y) 
{  Console("Converting...");

// Conversion based on http://dotnetfollower.com/wordpress/2011/07/javascript-how-to-convert-mercator-sphere-coordinates-to-latitude-and-longitude/ 
var rMajor = 6378137;
var shift = PI * rMajor;
Longitude = x / shift * 180.0;
Latitude = y / shift * 180.0;
Latitude = 180 / PI * (2 * Atan(Exp(Latitude * PI / 180.0)) - PI / 2.0);
}

if (ArcadeSr == 4326) {  Console("4326 Spatial Reference - No conversion necessary");  Latitude = ArcadeY;  Longitude = ArcadeX;} 
  else if (ArcadeSr == 102100) {  Console("102100 Spatial Reference - Conversion to WGS_1984_Web_Mercator_Auxiliary_Sphere (WKID 3857) is necessary");  AuxSphereToLatLon(ArcadeX, ArcadeY);} 
  else {  Console(ArcadeSr + " Spatial Reference not supported - currently works with Web Maps where the basemap is in WGS84 (4326) or Web Mercator Auxiliary Sphere 102100");}
  
var url = "http://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + text(Latitude) + "," + text(Longitude);
return url;



Bookmarks
https://support.esri.com/en-us/knowledge-base/is-my-sql-server-database-version-supported-by-arcgis-e-000030039
https://enterprise.arcgis.com/en/system-requirements/11.2/windows/database-requirements-sqlserver.htm
https://www.arcgis.com/apps/dashboards/c8af9c5411814584b460cc87cb7c3780
Solved: Arcade Data Expression - Filtering Two Layers Befo... - Esri Community
Solved: Arcade Data Expression - Dictionary from multiple ... - Esri Community
Displaying time spans with Arcade in dashboards with ArcGIS Dashboards
Solved: Arcade, data expression, creating dictionary for d... - Esri Community
arcade-expressions/dashboard/dashboard_data/CalculationAcrossFields.md at master · Esri/arcade-expressions · GitHub
Data expression to add a calculated attribute to all features?
Solved: Calculating Difference Between Two Dates using Arc... - Esri Community
Solved: Arcade Expression for value ranges - Esri Community
Data expression to calculate time difference for P... - Esri Community
arcade-expressions/dashboard/dashboard_data/JoinLayerFieldsToTable.md at master · Esri/arcade-expressions · GitHub
Create a locator—Portal for ArcGIS | Documentation for ArcGIS Enterprise
Geocode services and locators—ArcGIS Server | Documentation for ArcGIS Enterprise
Geocode services—Documentation | ArcGIS Enterprise
Efficient Geocoding with ArcGIS Pro | Winter 2017 | ArcUser
How to geocode addresses dynamically? - Esri Community
Sharing a "Live" XY Event Layer to your ArcGIS server if it's from a view table? : r/gis
Solved: Using Data Expressions to make a distinct list - Esri Community
