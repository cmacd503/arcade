// Portal ID, Feature Layer, Feature Layer ID
var p = Portal('https://arcgis-server.psc.local/portal');

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
