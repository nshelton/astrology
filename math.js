
function jitter(line, amount) {
    return [
        [line[0][0] + Math.random() * amount, line[0][1] + Math.random() * amount],
        [line[1][0] + Math.random() * amount, line[1][1] + Math.random() * amount] ]
}

function trimLine(line, a) {
    p0 = [ line[0][0] * a + line[1][0] * (1 - a), 
            line[0][1] * a + line[1][1] * (1 - a)]
    p1 = [ line[1][0] * a + line[0][0] * (1 - a), 
            line[1][1] * a + line[0][1] * (1 - a)]
    return [p0,p1]
}


function length(p) {
    return sqrt(p[0] * p[0] + p[1] * p[1])
}

function distance(p1,p2) {
    var dx =  p1[0] - p2[0]
    var dy =  p1[1] - p2[1]
    return length([dx,dy])
}

function setDistance(p, rad, c = center) {
    var _cx = (p[0] - c[0])
    var _cy = (p[1] - c[1])

    var angle = atan2(_cy, _cx)
    
    var result = [0,0]
    result[0] = rad * cos(angle) + c[0];
    result[1] = rad * sin(angle) + c[1];
    return result;
}

function getDistance(p, c = center) {
    var _cx = (p[0] - c[0])
    var _cy = (p[1] - c[1])
   return length([_cx, _cy])
}

function getAngle(p, c = center) {
    var _cx = (p[0] - c[0])
    var _cy = (p[1] - c[1])
    var angle = atan2(_cy, _cx)
    return angle;
}

function fromRadial(theta, rad, c = center) {
    var result = [0,0]
    result[0] = rad * cos(theta) + c[0];
    result[1] = rad * sin(theta) + c[1];
    return result;

}

/////////////////////transforms

function transform(hor) {
    return [
        1000 * (hor.azimuth) / 200,
        1000 * (hor.altitude + 90 )/180 ]
}

function transformDegreesCelestialToEarth(p) {
    p[0] *= 24/360 //convert degrees to hours
    // p[1] *= 0.5
    let hor = Astronomy.Horizon(_Time, _Observer, p[0], p[1], "normal")
    return transform(hor);
}

function transformHourCelestialToEarth(p) {
    let hor = Astronomy.Horizon(_Time, _Observer, p[0], p[1], "normal")
    return transform(hor);
}

// function fransformEQJtoELI(horiz) {
//     var horizVector =  Astronomy.VectorFromHorizon(horiz, _Time);
//     var EQJ  = Astronomy.RotateVector(Rotation_HOR_EQJ, horizVector);
//     var EQJ2000 = Astronomy.EquatorFromVector(EQJ, _Time, null)
//     return fromCelestialHour(EQJ2000.ra, EQJ2000.dec)
// }

function EllipticFromCelestialHour(ra, dec) {
    return EllipticFromCelestialLonLat(ra * 360/24, dec)
}

function EllipticFromCelestialLonLat(lon, lat) {
    //spherical takes lat lon
    const lonlat = new Astronomy.Spherical(lat, lon, 100.0);                 
    var sph =  Astronomy.VectorFromSphere(lonlat, _Time);
    var ECLvec  = Astronomy.RotateVector(Rotation_EQJ_ECL, sph);
    var ECL2000 = Astronomy.EquatorFromVector(ECLvec)
    return fromCelestialHour(ECL2000.ra, ECL2000.dec)
}

let polar = true
function fromCelestialLonLat(lon, lat) {
    // wrap
    if ( lon> 180) 
        lon -= 360

    if(polar) {
        var lambda = lon * deg2rad ;
        var phi = lat * deg2rad ;
    
        var rho = Math.PI/2 - phi
        var theta = lambda;
    
        return [
            scale * rho * cos (theta) + center[0] ,
            -scale * rho * sin (theta) + center[1] ]
    } else {
        return [
            10 * scale * lon/360 + center[0],
            5 * scale * lat/180 + center[1]]

    }
}

function fromCelestialHour(ra, dec) {
    return fromCelestialLonLat(ra * 360/24 , dec )
}

function getColor(body) {
    let colors = {
        'Sun' : "#ff6", 
        'Moon' : "#555",
        'Mercury' : "#841",
        'Venus' : "#f90", 
        'Mars' : "#0f0", 
        'Jupiter' : "#482",
        'Saturn' : "#0ff", 
        'Uranus' : "#f0f",
        'Neptune' : "#00f",
        'Pluto': "#bbb",
    }
    return colors[body]
}
