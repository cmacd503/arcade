// GOOGLE STREET OR EARTH VIEW
// Opens Google Street View or Google Earth location in a new web browser tab via point, line, or polygon features in ArcGIS Online Web Map layer

// For point features
var geom = Geometry($feature);

// For line features - will return the start of the line
var geom = Geometry($feature).paths[0][0];

// For polygon features - will return centroid of polygon
// var geom = Centroid(Geometry($feature));

var ArcadeX = geom.x;
var ArcadeY = geom.y;
var ArcadeSr = geom.spatialReference.wkid;
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
  
// For Google Street View:
//var url = "http://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + text(Latitude) + "," + text(Longitude);

// For Google Earth:
  // parameters: @{lat},{long},{alt}a,{dist}d,{fov}y,{heading}h,{tilt}t,{roll}r
var url = "https://earth.google.com/web/@" + text(Latitude) + "," + text(Longitude) + "," + '2000a';

return url;
