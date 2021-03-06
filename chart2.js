

function sin(x) { return Math.sin(x) }
function cos(x) { return Math.cos(x) }
function sqrt(x) { return Math.sqrt(x) }
function acos(x) { return Math.acos(x) }
function abs(x) { return Math.abs(x) }
function sign(x) { return Math.sign(x) }
function atan2(x,y) { return Math.atan2(x,y) }


deg2rad =  0.01745329252;
rad2deg = 1/deg2rad;

// var _Time = new Date('June 11, 1989 23:05:00')
// _Time = new Date('June 21, 1959 23:05:00')
// _Time = new Date('April 10, 1991 23:05:00 CDT')
_Time = new Date('Dec 2, 1987 05:00:00 EST')
// _Time = new Date('December 23, 2014 16:20:00 GMT')
// _Time = new Date();
// _Time = new Date('September 19, 1990 07:47:00 PST')
// _Time = new Date('October 22, 1986 17:10:00 PST')
// _Time.setMonth( Math.round(Math.random() * 11) )
// _Time.setDate(Math.floor(Math.random() * 30))
// _Time.setHours(Math.floor(Math.random() * 24))
// _Time.setFullYear(Math.floor(Math.random() *40 + 1980))

// const _Observer = new Astronomy.Observer(90, 0, 0);
// _Observer = new Astronomy.Observer(90, 0, 0);
// cityname = "oakland"
// _Observer = new Astronomy.Observer(37.840270071049474, -122.24752870381347, 0); // oakland
// _Time.setHours(_Time.getHours() + 6)
// cityname = "dallas"
// _Observer = new Astronomy.Observer(33.014996366375, -96.67997803873509, 0); // dallas
// _Time.setHours(_Time.getHours() + 5)

cityname = "washington, DC"
_Observer = new Astronomy.Observer(38.9240400110907, -77.00558584122027, 0); // dallas

// cityname = "paris"
// _Observer = new Astronomy.Observer(48.862420104011264, 2.356997754939505, 0); 
// _Time.setHours(_Time.getHours() + 1)

// const _Observer = new Astronomy.Observer(33.02019285171668, -76.68064645176072, 0);
const Rotation_HOR_EQJ = Astronomy.Rotation_HOR_EQJ( _Time, _Observer);

var radialProjection = true
var scale = 200
var center = [1000,1000]

ellipticCenter = fromCelestialHour(18,66.5)

let drawraditionalHouses = false
let drawStars = true;
let drawOrbits = true;
let drawConjunctions = true;

function drawGrid(chart, zodiacCenters) {

    var zodiacAngles = []

    for(var i = 0; i < zodiacCenters.length; i++) {
        zodiacAngles.push(getAngle(zodiacCenters[i], ellipticCenter))
    }
        
    zodiacAngles.sort(function(a,b) {
        return (+a) - (+b);
    });

    zodiacBoundaries = []

    for(var i = 0; i < zodiacAngles.length; i++) {
        if ( i != 11) {
            zodiacBoundaries.push((zodiacAngles[i] + zodiacAngles[(i+1) % 12])/2)
        } else {
            zodiacBoundaries.push((zodiacAngles[i] + Math.PI*2 + zodiacAngles[(i+1) % 12])/2)
        }
    }

    var oldSchoolRad = 150
    

    chart.circle(800).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(850).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(750).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")

    // chart.circle(900).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    chart.circle(oldSchoolRad*2).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    chart.circle(oldSchoolRad*2 + 100).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")

    

    if ( radialProjection ) {

        // astronomical symbols
        for(var x = 0; x < 12; x ++) {
            var pos = fromRadial(zodiacAngles[x], 410, ellipticCenter);
            var index = (11 - x - 7 + 12) %12;

            var off =  90 - 360/24
            chart.text(symbols[index]).cx(pos[0]).cy(pos[1]).rotate(zodiacAngles[x] * rad2deg + 90).scale(2).fill("none").stroke({ color: '#0f0', width: 0.3})
        }

        // traditional symbols
        for(var x = 0; x < 12; x ++) {
            var angle = Math.PI * 2 * (x + 0.5) / 12 
            var pos = fromRadial(angle, oldSchoolRad + 25, center);
            var index = 11 - x

            var off =  90 - 360/24
            chart.text(symbols[index]).cx(pos[0]).cy(pos[1]).rotate(angle * rad2deg + 90).scale(2).fill("none").stroke({ color: '#0f0', width: 0.3})
        }


    } else {
        for(var x = 0; x < 12; x ++) {
            var px = x /12 * 360 - 180
            var lasty = -80
            for(var y = 1; y < 51; y ++) {

                var py = y / 50 * 180 - 90;

                var a = fromCelestialLonLat([px, lasty])
                var b = fromCelestialLonLat([px, py])

                chart.line(a[0], a[1], b[0], b[1]).stroke('#aaa').fill("none")
                lasty = py;
            }
        }
    }
   
    pos0 = fromCelestialLonLat(0, 75)
    pos1 = fromCelestialLonLat(0, 105)
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")
    pos0 = fromCelestialLonLat(90, 75)
    pos1 = fromCelestialLonLat(90, 105)
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")

    chart.circle(5).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(166).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(400).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")

    
    chart.circle(5).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    chart.circle(200).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    // chart.circle(400).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    // chart.circle(500).cx(ellipticCenter[0]).cy(ellipticCenter[1]).stroke('#aaa').fill("none")

    // heres where we project the horizon and houses on
    function transfromHorizToScreen(horiz) {
        var horizVector =  Astronomy.VectorFromHorizon(horiz, _Time);
        var EQJ  = Astronomy.RotateVector(Rotation_HOR_EQJ, horizVector);
        var EQJ2000 = Astronomy.EquatorFromVector(EQJ, _Time, null)
        return fromCelestialHour(EQJ2000.ra, EQJ2000.dec)
    }

    var lastPoint = []

    for ( var i = 10 ; i < 200; i ++ ) {
        const horiz = new Astronomy.Spherical(  i , 0, 1.0);                   /* any positive distance value will work fine. */
        coord = transfromHorizToScreen(horiz)
        
        if ( i > 10) {
            chart.line(lastPoint[0], lastPoint[1], coord[0], coord[1]).stroke('#f0f').fill("none").scale(2)

        }
        lastPoint = coord;
    }

    for ( var i = 0 ; i < 361; i ++ ) {
        const horiz = new Astronomy.Spherical(  0, i , 100.0);                   /* any positive distance value will work fine. */
        coord = transfromHorizToScreen(horiz)

        if ( i > 0) {
            chart.line(lastPoint[0], lastPoint[1], coord[0], coord[1]).stroke('#f0f').fill("none").scale(2)

        }
        lastPoint = coord;
    }

    for ( var i = 0 ; i < 180; i ++ ) {
        const horiz = new Astronomy.Spherical(  i , 90, 100.0);                   /* any positive distance value will work fine. */
        coord = transfromHorizToScreen(horiz)

        if ( i > 0) {
            chart.line(lastPoint[0], lastPoint[1], coord[0], coord[1]).stroke('#f0f').fill("none").scale(2)

        }
        lastPoint = coord;
    }


    function DrawArrow(point, length, rad, arrowWidth, center) {

        angle = getAngle(point, center)
        point2 = fromRadial(angle, rad - length *0.5, center)
        point1 = setDistance(point, rad + length *0.5, center)

        arr0 = fromRadial(angle + arrowWidth, rad + length*0.5-20, center)
        arr1 = fromRadial(angle - arrowWidth, rad + length*0.5-20, center)

        chart.line(point1[0], point1[1], arr0[0], arr0[1]).stroke('#f00').fill("none").scale(1)
        chart.line(point1[0], point1[1], arr1[0], arr1[1]).stroke('#f00').fill("none").scale(1)
        chart.line(point1[0], point1[1], point2[0], point2[1]).stroke('#f00').fill("none").scale(1)

    }

    newSchoolRad = 400


    // /--------------------------------------------ASCendant
    var textOffset = 30
    var ascPoint = transfromHorizToScreen(new Astronomy.Spherical(  0 , 90, 100.0))
    var EText = setDistance(ascPoint, newSchoolRad + textOffset, ellipticCenter)
    var angle = getAngle(EText, ellipticCenter)
    chart.text( "AC").cx(EText[0]).cy(EText[1]).fill("#f00").rotate(angle * rad2deg + 90 ).font("Family", "Menlo").font("size", 35)

    DrawArrow(ascPoint, 100, oldSchoolRad + 25, 0.05)
    DrawArrow(ascPoint, 100, newSchoolRad + 25, 0.02, ellipticCenter)


    // /--------------------------------------------Descendant
    var dscPoint = transfromHorizToScreen(new Astronomy.Spherical(  0 , -90, 100.0))
    var WText = setDistance(dscPoint, newSchoolRad + textOffset, ellipticCenter)
    var angle = getAngle(WText, ellipticCenter) 
    chart.text( "DC").cx(WText[0]).cy(WText[1]).fill("#f00").rotate(angle * rad2deg + 90).font("Family", "Menlo").font("size", 35)

    DrawArrow(dscPoint, 100, oldSchoolRad + 25, 0.05)
    DrawArrow(dscPoint, 100, newSchoolRad + 25, 0.02, ellipticCenter)

    // /--------------------------------------------MC
    var mcPoint = transfromHorizToScreen(new Astronomy.Spherical(  90 , 0, 100.0))
    var SText = setDistance(mcPoint, newSchoolRad + textOffset, ellipticCenter)
    var angle = getAngle(SText, ellipticCenter)
    chart.text( "MC").cx(SText[0]).cy(SText[1]).fill("#f00").rotate(angle * rad2deg + 90 ).font("Family", "Menlo").font("size", 35)

    DrawArrow(mcPoint, 100, oldSchoolRad + 25, 0.05)
    DrawArrow(mcPoint, 100, newSchoolRad + 25, 0.02, ellipticCenter)


    // /--------------------------------------------IC
    var icPoint = transfromHorizToScreen(new Astronomy.Spherical( -90 , 0, 100.0))
    var NText = setDistance(icPoint, newSchoolRad + textOffset, ellipticCenter)
    var angle = getAngle(NText, ellipticCenter) 
    chart.text( "IC").cx(NText[0]).cy(NText[1]).fill("#f00").rotate(angle * rad2deg + 90).font("Family", "Menlo").font("size", 35)
    DrawArrow(icPoint, 100, oldSchoolRad + 25, 0.05)
    DrawArrow(icPoint, 100, newSchoolRad + 25, 0.02, ellipticCenter)


    // QUADRTANTS>??

    function createPorphyryHouses() {
        var a0 = getAngle(ascPoint, ellipticCenter)
        var a1 = getAngle(mcPoint, ellipticCenter)
        var a2 = getAngle(dscPoint, ellipticCenter)
        var a3 = getAngle(icPoint, ellipticCenter)
        markers = [a0, a1, a2, a3]
        markers.sort(function(a,b) {
            return (+a) - (+b);
        });

        console.log(markers)
        var houses = [
            markers[0],
            markers[0] * 0.666 + markers[1] * 0.333,
            markers[0] * 0.333 + markers[1] * 0.666,
            markers[1],
            markers[1] * 0.666 + markers[2] * 0.333,
            markers[1] * 0.333 + markers[2] * 0.666,
            markers[2],
            markers[2] * 0.666 + markers[3] * 0.333,
            markers[2] * 0.333 + markers[3] * 0.666,
            markers[3],
            markers[3] * 0.666 + (markers[0] + Math.PI * 2) * 0.333,
            markers[3] * 0.333 + (markers[0] + Math.PI * 2) * 0.666
        ]

        var ACIndex = houses.indexOf(a0)

        // rotate so Asc is 0 
        houses = houses.slice(ACIndex, houses.length).concat(houses.slice(0,ACIndex));

        return houses
    }

    // zodiac ticks
    for(var x = 0; x < zodiacBoundaries.length; x ++) {
        pos0 = fromRadial(zodiacBoundaries[x], 425, ellipticCenter)
        pos1 = setDistance(pos0, 400, ellipticCenter)

        chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")

        theta = Math.PI * 2 * x / zodiacBoundaries.length
        pos0 = fromRadial(theta, oldSchoolRad + 50, center)
        pos1 = setDistance(pos0, oldSchoolRad, center)

        chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")
        // chart.text(x.toFixed(2)).move(pos1[0]+ 30,pos1[1]).fill("#aaa").font("Family", "Menlo")
    }


    var housePositions = createPorphyryHouses()
    var houseLabels = []
    for ( var i = 0 ; i < housePositions.length; i ++) {
        var a0 = housePositions[i];
        var a1 = housePositions[(i + 1) %12];
        var mina = Math.min(a0, a1)
        var maxa = Math.max(a0, a1)
        if (maxa - mina > Math.PI ) {
            mina += Math.PI * 2
        }
        houseLabels.push((mina + maxa)/2)
    }

     // house numbers
     for(var x = 0; x < 12; x ++) {

        var ra = 12 - x 

        thetaTick = housePositions[x]
        pos0 = fromRadial(thetaTick, newSchoolRad - 25, ellipticCenter)
        pos1 = fromRadial(thetaTick, newSchoolRad , ellipticCenter)

        var textString = ra.toFixed(0) + " : " + getHouseInfo(ra);

        thetaText = housePositions[x] + 0.01 * textString.length
        label = fromRadial(thetaText, newSchoolRad-15, ellipticCenter)


        chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")
        chart.text(textString).cx(label[0]).cy(label[1]).scale(1).rotate(thetaText * rad2deg + 90).fill("#aaa").font("Family", "Menlo")
    }


}

function createPlot() {

    var chart = SVG().addTo("body").size( 2000, 2000)
    var bg = chart.rect(0,0).size(2000,2000).fill("#000")

    if ( drawStars) {
        $.getJSON("./stars.6.json", function(json) {

            for(var i = 0; i < json.features.length; i ++) {
                var coord = json.features[i].geometry.coordinates
                var mag = parseFloat(json.features[i].properties.mag);
    
                if (mag > 5)
                    continue;
     
                r = 2 * Math.pow(5 - mag, 1.2); // replace 20 with dimmest magnitude in the data
                coord = fromCelestialLonLat(coord[0], coord[1])
                rect = chart.circle(r).cx(coord[0]).cy(coord[1]).stroke('#f06').fill("none")
            }
        });
    }

    $.getJSON("./constellations.lines.json", function(json) {

         var zodiacRAs = []
         var zodiacCenters = []

        for(var i = 0; i < json.features.length; i ++) {
            var name = json.features[i].id;
            var index = zodiac.indexOf(name)
            if (index > -1){

                var lines = json.features[i].geometry.coordinates
                var c = [0,0]
                var n = 0
                var cRA = 0
                
                for(var k = 0; k < lines.length; k++) {
                    var coord = json.features[i].geometry.coordinates[k]
                     var lastPoint = fromCelestialLonLat(coord[0][0], coord[0][1])

                    for(var j = 1; j < coord.length; j++) {
                      
                        var p = fromCelestialLonLat(coord[j][0], coord[j][1])

                        if ( abs(p[0] - lastPoint[0]) < 100) {
                            chart.line(lastPoint[0], lastPoint[1], p[0], p[1]).stroke('#0f0').fill("none")
                            cRA += coord[j][0]
                            n++;
                            c[0] += p[0]
                            c[1] += p[1]
                        } 

                        lastPoint = p
                    }
                }

                var centroid = [c[0]/n, c[1]/n]

                zodiacCenters.push([centroid[0], centroid[1]])
                // label = setDistance(centroid, 130, ellipticCenter);
                // var text = chart.text(elements[index]).cx(label[0]).cy(label[1]).scale(2).fill("none").stroke({ color: '#0f0', width: 0.3}).font("Family", "Menlo")
                // chart.text( ra.toFixed(2)).move(label[0]+ 30,label[1]).fill("#0f0").font("Family", "Menlo")

                // var text = chart.text(name).move(c[0]/n, c[1]/n).scale(1).fill("#fff")
            }
        }
    
        drawGrid(chart, zodiacCenters)

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

        i = 0

        var planetLocations = {};
        var planetRAs = {};

        for (let body of planetNames) {
            let equ_2000 = Astronomy.Equator(body, _Time, _Observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, _Time, _Observer, true, true);
            let hor = Astronomy.Horizon(_Time, _Observer, equ_ofdate.ra, equ_ofdate.dec, 'normal');
            coord = fromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
            chart.circle(1).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')
            chart.circle(10).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')

            chart.circle(50).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")
            chart.circle(60).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")

            planetLocations[body] = coord
            planetRAs[body] = hor
        }

        if ( drawConjunctions) {
            conjunctions = findConjunctions(planetLocations, 0.1, ellipticCenter)
        
            console.log(conjunctions)
            for (var i = 0; i < conjunctions.length; i ++) {
                for (var j = 0; j < 2; j ++) {
                    chart.line(jitter(trimLine(conjunctions[i],0.9), 3)).stroke({ color: '#ff0'}) 
                 }
            }
            conjunctions = findConjunctions(planetLocations, 0.2, ellipticCenter)
            for (var i = 0; i < conjunctions.length; i ++) {
                chart.line(jitter(trimLine(conjunctions[i],0.9), 3)).stroke({ color: '#ff0'}) 
            }
        }

        var planetRad = 700
        if ( drawraditionalHouses) {
            labels = layoutPlanetLabels(planetLocations, planetRad, center)

            for (var i = 0; i < planetNames.length; i ++) {
    
                var name = planetNames[i]
                var location = labels[name]
                var planetLocation = planetLocations[name]
                var startLine = setDistance(planetLocation, 550);
    
                chart.text(planetSymbols[i]).cx(location[0]).cy(location[1]).scale(4).fill("none").stroke({ color: '#0ff', width: 0.3}) 
    
                var lineDst = setDistance(planetLocation, planetRad);
     
                chart.line(lineDst[0], lineDst[1], startLine[0], startLine[1]).stroke("#888").fill("none").scale(1)
    
                var hor = planetRAs[name]
    
                var pos3 = setDistance(location, getDistance(location) + 60);
                // chart.text( hor.ra.toFixed(2)).cx(pos3[0]).cy(pos3[1]).scale(1.5).rotate(-hor.ra * (360/24)).fill("#0ff").font("Family", "Menlo")
            }
        }

        planetRad = 500
        labels = layoutPlanetLabels(planetLocations, planetRad, ellipticCenter)

        for (var i = 0; i < planetNames.length; i ++) {

            var name = planetNames[i]
            var location = labels[name]
            var planetLocation = planetLocations[name]


            var lineDst = setDistance(planetLocation, planetRad, ellipticCenter);
 
            var hor = planetRAs[name]

            var pos3 = setDistance(location, getDistance(location, ellipticCenter) + 70, ellipticCenter);
            var angle = getAngle(location, ellipticCenter)

            chart.line(lineDst[0], lineDst[1], planetLocation[0], planetLocation[1]).stroke("#888").fill("none")

            chart.text(planetSymbols[i]).cx(location[0]).cy(location[1]).scale(4).rotate(angle * rad2deg - 90 ).fill("none").stroke({ color: '#0ff', width: 0.3}) 

            chart.text( getPlanetInfo([planetNames[i]])).cx(pos3[0]).cy(pos3[1]).scale(1.5).rotate(angle * rad2deg ).fill("#0ff").font("Family", "Menlo")
        }

        if (drawOrbits) {
            for (let body of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
                var newDate = new Date(_Time) 
                newDate.setDate(newDate.getDate() - 180);
                lastpos = [0,0]
                for(var i = 0; i < 360; i ++) {
                    newDate.setDate(newDate.getDate() + 1);
                    let equ_2000 = Astronomy.Equator(body, newDate, _Observer, false, true);
                   let equ_ofdate = Astronomy.Equator(body, newDate, _Observer, true, true);
                   let hor = Astronomy.Horizon(_Time, _Observer, equ_ofdate.ra, equ_ofdate.dec, 'normal');
                    // console.log(body.padEnd(8), (equ_2000.ra), (equ_2000.dec), (hor.azimuth), (hor.altitude));
                    // coord = transformDegreesCelestialToEarth([(equ_2000.ra), (equ_2000.dec)])
                    coord = fromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
                    if (i > 0)
                        chart.line(lastpos[0], lastpos[1], coord[0], coord[1]).stroke(getColor(body)).fill("none").scale(1)
                    lastpos = coord
                }
            }
        }

        // var lat = 50.5;
        // var lng = 30.5;
        // var height = 2000;

        // var sunPos = SunCalc.getPosition(now, lat, lng);
        // coord = [sunPos.azimuth, sunPos.altitude]
        // coord = transform(coord)
        // chart.circle(40).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("#f90")

        // var moonPos = SunCalc.getMoonPosition(now, lat, lng);
        // coord = [moonPos.azimuth, moonPos.altitude]
        // coord = transform(moonPos)
        // chart.circle(20).cx(coord[0]).cy(coord[1]).stroke('#ff0').fill("none")


        /// Draw text infos
        var lineHeight = 25
        var y = 900
        chart.text("Porphyry Houses, Elliptic Pole").move(300,y).fill("#0ff").font("Family", "Menlo")
        y += lineHeight
        chart.text( _Time.toString()).move(300,y).fill("#0ff").font("Family", "Menlo")
        y += lineHeight
        chart.text( "lat, lon = \t (" +  _Observer.latitude.toFixed(2) + " " + _Observer.longitude.toFixed(2) +") \t" + cityname).move(300,y).fill("#0ff").font("Family", "Menlo")

    });


}


$( document ).ready(function() {
    createPlot();
});

