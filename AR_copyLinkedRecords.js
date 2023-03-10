//Connect to the parent table, MasterStreetName, and use it to populate all relevant fields in RoadCenterline. 

//solution is modeled after the Esri solution to update multiple fields within a single attribute rule:
//https://community.esri.com/t5/attribute-rules-videos/update-multiple-fields-with-a-single-attribute/m-p/1016597

//the Esri solution uses FeatureSetByName with a Filter to access the Primary Key/Foreign Key relationship. 
//to be more flexible, the method below uses FeatureSetByRelationshipName so that the key is identified by the relationship class itself rather than being hard coded through FeatureSetByName and a Filter.

//access the parent table MasterStreetName. FeatureSetByRelationshipName accesses the PK/FK automatically - in this case, STCODE between RoadCenterline and MasterStreetName.
var rel = FeatureSetByRelationshipName($feature, 'MasterStreetNameHasRoadCenterline')
var nm=First(rel)

//code for leveraging the FeatureSetByName method:
//var key = $feature.STCODE
//var msFS = FeatureSetByName($datastore, "MasterStreetName")
//var filtered_target = Filter(msFS, "STCODE = @key")
//var nm=First(filtered_target)
//
//if(nm != null) {
//
//return {
//     "result" : {  <...continue with the dictionary and objects, as above>

if(nm != null) { //do not process records where a relationship does not exist

return {
     "result" : {  //make the result an object of a dictionary to capture multiple fields
          "attributes" : {
               "FULLNAME" : nm.FULLNAME, //"target field to be calculated" : feature.object as source for calculation
               "LSt_Name" : nm.LSt_Name,
               "LSt_PosDir" : nm.LSt_PosDir,
               "LSt_PreDir" : nm.LSt_PreDir,
               "LSt_Type" : nm.LSt_Type,
               "MSAGFULLNAME" : nm.MSAGFULLNAME,
               "MSAGNAME" : nm.MSAGNAME,
               "MSAGPOSTDIR" : nm.MSAGPOSTDIR,
               "MSAGPREDIR" : nm.MSAGPREDIR,
               "MSAGTYPE" : nm.MSAGTYPE,
               "ROADNAME" : nm.ROADNAME,
               "ROADPOSTDIR" : nm.ROADPOSTDIR,
               "ROADPREDIR" : nm.ROADPREDIR,
               "ROADTYPE" : nm.ROADTYPE,
               "St_Name" : nm.St_Name,
               "St_PosDir" : nm.St_PosDir,
               "St_PosMod" : nm.St_PosMod,
               "St_PosTyp" : nm.St_PosTyp,
               "St_PreDir" : nm.St_PreDir,
               "St_PreMod" : nm.St_PreMod,
               "St_PreSep" : nm.St_PreSep,
               "St_PreTyp" : nm.St_PreTyp
       }
}

}
}
