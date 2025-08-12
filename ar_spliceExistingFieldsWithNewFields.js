// Portal ID; Feature Layer; Feature Layer ID:
var p = Portal('https://arcgis-server.psc.local/portal');
var fl = 'ce17a2ca4b3943be9cccd7b6966fd1c3';  //feature layer name = cl_data
var id = 4;

// load Filtered featureset data
var fs = FeatureSetByPortalItem(p, fl, id, ['rin','occ_year','dispatch_time','time_queued','jurisdiction','how_received','queued_type','priority'],false);
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
