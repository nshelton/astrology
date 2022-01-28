

function sin(x) { return Math.sin(x) }
function cos(x) { return Math.cos(x) }
function sqrt(x) { return Math.sqrt(x) }
function acos(x) { return Math.acos(x) }
function abs(x) { return Math.abs(x) }
function sign(x) { return Math.sign(x) }
function atan2(x,y) { return Math.atan2(x,y) }


deg2rad =  0.01745329252;
rad2deg = 1/deg2rad;


// _Time = new Date('Aug 24, 1989 2:10:00 PDT') //reza


// var _Time = new Date('June 11, 1989 23:05:00')
// _Time = new Date('June 21, 1959 23:05:00')
// _Time = new Date('April 10, 1991 23:05:00 CDT')
// _Time = new Date('Feb 22, 1986 7:00:00 EST')
// _Time = new Date('Dec 2, 1987 05:00:00 EST')
// _Time = new Date('December 23, 2014 16:20:00 GMT'    )
// _Time = new Date();
// _Time = new Date('September 19, 1990 07:47:00 PST')
_Time = new Date('October 22, 1987 05:10:00 MDT')
_Time = new Date('May, 27 1995 09:33:00 EDT')
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


// cityname = "santa cruz"
// _Observer = new Astronomy.Observer(36.977887203085494, -121.90832941577683, 0); 



// cityname = "miami"
// _Observer = new Astronomy.Observer(25.811984528073324, -80.26892302691793, 0); // dallas


// cityname = "washington, DC"
// _Observer = new Astronomy.Observer(38.9240400110907, -77.00558584122027, 0); // dallas

cityname = "roswell"
_Observer = new Astronomy.Observer(33.40416482155773, -104.53147490972424, 0); // dallas

cityname = "mt kisco, NY"
_Observer = new Astronomy.Observer(41.20114658395757, -73.72850309013931, 0); // kurt ny


// cityname = "paris"
// _Observer = new Astronomy.Observer(48.862420104011264, 2.356997754939505, 0); 
// _Time.setHours(_Time.getHours() + 1)

// const _Observer = new Astronomy.Observer(33.02019285171668, -76.68064645176072, 0);
const Rotation_HOR_EQJ = Astronomy.Rotation_HOR_EQJ( _Time, _Observer);
const Rotation_EQJ_ECL = Astronomy.Rotation_EQJ_ECL();

var scale = 200
var center = [1000,1000]

eclipticCenter = fromCelestialHour(18,66.5)

let drawraditionalHouses = false
let drawStars = true;
let drawOrbits = true;
let drawAspects = true;
let drawHouseTable= false; /// this has some math bugs 

let maxMag = 5
let eclipticRadius = 620/2

function DrawArrow(chart, point, length, rad, arrowWidth) {

    angle = getAngle(point)
    point2 = fromRadial(angle, rad - length)
    point1 = setDistance(point, rad)

    arr0 = fromRadial(angle + arrowWidth, rad - 50)
    arr1 = fromRadial(angle - arrowWidth, rad - 50)

    chart.line(point1[0], point1[1], arr0[0], arr0[1]).stroke(QUAD_COLOR)
    chart.line(point1[0], point1[1], arr1[0], arr1[1]).stroke(QUAD_COLOR)
    chart.line(point1[0], point1[1], point2[0], point2[1]).stroke(QUAD_COLOR)
}


let QUAD_COLOR = "#ff0"
let STAR_COLOR = "#0ff"
let ORBIT_COLOR = "#f0f"
let PLANET_COLOR = "#f00"
let TEXT_COLOR = "#f0f"

function createPlot() {

    var chart = SVG().addTo("body").size( 2000, 2000)
    // var bg = chart.rect(0,0).size(2000,2000).fill("#000")

    // for (var i = 0; i < 2; i ++) {
    //     chart.circle(i* 300 + 20).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    // }
    // testing 
    // printTextRadial(chart, "abcdefghijklmnopqrstuvwxyz1234567890", 650,  - 2);
    // chart.circle(650*2).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")

    $.getJSON("./constellations.lines.json", function(json) {

        let zodiacAngles = [0,0,0,0,0,0,0,0,0,0,0,0]
        for(var i = 0; i < json.features.length; i ++) {
            var name = json.features[i].id;
            var index = zodiac.indexOf(name)
            if (index > -1){
                var lines = json.features[i].geometry.coordinates
                
                var centroid = [0,0]
                var n = 0

                for(var k = 0; k < lines.length; k++) {
                    var coord = json.features[i].geometry.coordinates[k]
                    var linePoints = []
                    for(var j = 0; j < coord.length; j++) {
                        var p = EllipticFromCelestialLonLat(coord[j][0], coord[j][1])
                        centroid[0] += p[0]
                        centroid[1] += p[1]
                        linePoints.push(p)
                        n++
                    }

                    drawLineFromPoints(chart, linePoints, STAR_COLOR)
                }
                zodiacAngles[index] = getAngle([centroid[0]/n, centroid[1]/n])
            }
        }

        printGlyphRing(chart, zodiacAngles, 800, 50, "#0f0", 2)

        var basicAngles = []
        for (let i = 0; i < 12; i++) {
            basicAngles.push(-(i/12) * 2 * Math.PI -  Math.PI/12)       
        }

        printGlyphRing(chart, basicAngles, 325, 50, "#f0f", 1)

        // ------------- zodiac description  --------------------------
         
    
        for (let i = 0; i < zodiacAngles.length; i++) {
            const angle = zodiacAngles[i];
    
            // var p0 = fromRadial(angle , radius/2 + length/2)
            // chart.text(names[i]).cx(p0[0]).cy(p0[1]).scale(textsize).rotate(angle * rad2deg + 90 ).fill("none").stroke({ color: color, width: 0.3}) 
            // chart.path(zodiacGlyph[i]).cx(p0[0]).cy(p0[1]).scale(textsize*2).rotate(angle * rad2deg + 90 ).fill("none").stroke({ color: color, width: 0.3}) 
            var textString = getZodiacInfo(i+1)
            printTextRadial(chart, textString, 420, angle+ 0.05)
        }
    

        // ------------- PLANETS --------------------------
        var planetLocations = {}

        for (let body of planetNames) {
            let equ_2000 = Astronomy.Equator(body, _Time, _Observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, _Time, _Observer, true, true);
            console.log(equ_ofdate, equ_2000,body )
            coord = EllipticFromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
            drawPlanet(chart, coord, PLANET_COLOR)
            planetLocations[body] = coord
        }

        planetRad = 525

        
        chart.circle(1000).cx(center[0]).cy(center[1]).stroke("#fff").fill("none")
        chart.circle(1100).cx(center[0]).cy(center[1]).stroke("#fff").fill("none")

        labels = layoutPlanetLabels(planetLocations, planetRad)

        for (var i = 0; i < planetNames.length; i ++) {

            var name = planetNames[i]
            var location = labels[name]
            var planetLocation = planetLocations[name]

            var lineDst = setDistance(planetLocation, 500);
 
            var angle = getAngle(location)

            outerPlanet = setDistance(planetLocation, getDistance(planetLocation) + 30)
            chart.line(lineDst[0], lineDst[1], outerPlanet[0], outerPlanet[1]).stroke(PLANET_COLOR)

            inner0 = setDistance(planetLocation, getDistance(planetLocation) - 30)
            inner1 = setDistance(planetLocation, 210)
            chart.line(inner0[0], inner0[1], inner1[0], inner1[1]).stroke(PLANET_COLOR)

            chart.path(planetGlyph[i]).cx(location[0]).cy(location[1]).scale(6).rotate(angle * rad2deg - 90 ).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}) 

            // chart.text( getPlanetInfo([planetNames[i]])).cx().cy(pos3[1]).scale(1).rotate(angle * rad2deg ).fill(TEXT_COLOR)
            var textPos = setDistance(location, getDistance(location)+ 30);

            printTextAngle(chart, getPlanetInfo([planetNames[i]]), textPos[0], textPos[1])

        }
        
        if (drawOrbits) {
            for (let body of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
                var newDate = new Date(_Time) 
                newDate.setDate(newDate.getDate() - 0);
                var points = []

                for(var i = 0; i < 360; i ++) {
                    newDate.setDate(newDate.getDate() + 1);
                    let equ_ofdate = Astronomy.Equator(body, newDate, _Observer, true, true);
                    coord = EllipticFromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
                    points.push(coord)
                }

                drawLineFromPoints(chart, points, ORBIT_COLOR)
            }
        }

        function transfromHorizToScreen(horiz) {
            var horizVector =  Astronomy.VectorFromHorizon(horiz, _Time);
            var EQJ  = Astronomy.RotateVector(Rotation_HOR_EQJ, horizVector);
            var EQJ2000 = Astronomy.EquatorFromVector(EQJ, _Time, null)
            return EllipticFromCelestialHour(EQJ2000.ra, EQJ2000.dec)
        }
    

        // HORIZON

        /// find intersection
        var lastRad = 0
        var accPos = 0
        var decPos = 0
        for ( var i = 0 ; i < 361; i ++ ) {
            const horiz = new Astronomy.Spherical(  0, i , 100.0);                   /* any positive distance value will work fine. */
            coord = transfromHorizToScreen(horiz)

            var rad = getDistance(coord);

            if (rad > eclipticRadius && lastRad < eclipticRadius) {
                accPos = coord
            }

            if (rad < eclipticRadius && lastRad > eclipticRadius) {
                decPos = coord
            }

            lastRad = rad;
        }

        // graw horizon rings

        for ( var j= 0 ; j < 2; j ++ ) {
            var horizonPoints = []

            for ( var i = 0 ; i < 361; i ++ ) {
                const horiz = new Astronomy.Spherical(  j, i , 100.0);                   /* any positive distance value will work fine. */
                coord = transfromHorizToScreen(horiz)
                horizonPoints.push(coord)
            }
            drawLineFromPoints(chart, horizonPoints, QUAD_COLOR)
        }

        const horiz = new Astronomy.Spherical(  90 , 90, 100.0);                   /* any positive distance value will work fine. */
        directlyUp = transfromHorizToScreen(horiz)
        northpole = EllipticFromCelestialLonLat(0, 90)

        // chart.line(northpole[0], northpole[1], directlyUp[0], directlyUp[1]).stroke('#fff').fill("none")

        var MCangle = getAngle(directlyUp, northpole);

        northpole = EllipticFromCelestialLonLat(0, 90)
        N = EllipticFromCelestialLonLat(90, 85)
        E = EllipticFromCelestialLonLat(0, 85)
        S = EllipticFromCelestialLonLat(180, 85)
        W = EllipticFromCelestialLonLat(270, 85)

        chart.line(northpole[0], northpole[1], N[0], N[1]).stroke('#fff').fill("none")
        chart.line(northpole[0], northpole[1], E[0], E[1]).stroke('#fff').fill("none")
        chart.line(northpole[0], northpole[1], S[0], S[1]).stroke('#fff').fill("none")
        chart.line(northpole[0], northpole[1], W[0], W[1]).stroke('#fff').fill("none")

        chart.circle(50).cx(northpole[0]).cy(northpole[1]).stroke(STAR_COLOR).fill("none")
        var eclipticRad = getDistance(northpole)
        chart.circle(eclipticRad*2).cx(center[0]).cy(center[1]).stroke(STAR_COLOR).fill("none")

        var outerRadius = 800/2 + 25
        // /--------------------------------------------ASCendant
        var textOffset = 33
        var accAngle = getAngle(accPos) 
        printTextRadial(chart, "AC", outerRadius + textOffset, accAngle - 0.05, 1.5)
        DrawArrow(chart, accPos, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------Descendant
        var dcAngle = getAngle(decPos) 
        printTextRadial(chart, "DC", outerRadius + textOffset, dcAngle - 0.05, 1.5)
        DrawArrow(chart, decPos, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------MC
        var mcPoint = fromRadial(MCangle, outerRadius)
        printTextRadial(chart, "MC", outerRadius + textOffset, MCangle - 0.05, 1.5)
        DrawArrow(chart, mcPoint, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------IC
        var icPoint = fromRadial(MCangle + Math.PI, outerRadius)
        printTextRadial(chart, "IC", outerRadius + textOffset, MCangle + Math.PI - 0.05, 1.5)

        DrawArrow(chart, icPoint, 300, outerRadius + 25, 0.07)

        var houseAngles = createPorphyryHouses(accPos, mcPoint, decPos, icPoint, center)
        var houseLabels = []
        for ( var i = 0 ; i < houseAngles.length; i ++) {
            var a0 = houseAngles[i];
            var a1 = houseAngles[(i + 1) %12];
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

            thetaTick = houseAngles[x]
            pos0 = fromRadial(thetaTick, outerRadius - 25)
            pos1 = fromRadial(thetaTick, outerRadius - 75 )

            var a0 = houseAngles[x];
            var a1 = houseAngles[(x + 1) %12];
            var mina = Math.min(a0, a1)
            var maxa = Math.max(a0, a1)
            if (maxa - mina > Math.PI ) {
                mina += Math.PI * 2
            }

            for(var i = 0; i < 30; i++) {
                var length = 0;

                if ( i % 5 == 0)
                    length += 10
                if ( i% 10 == 0)
                    length += 10    

                var alpha = (i/30)
                var angle = alpha * mina + (1-alpha) * maxa
                q0 = fromRadial(angle, outerRadius - 25 )
                q1 = fromRadial(angle, outerRadius - 35 - length )
                chart.line(q0[0], q0[1], q1[0], q1[1]).stroke('#aaa').fill("none")
            }

            var textString = " " + ra.toFixed(0) + " " + getHouseInfo2(ra);

            thetaText = houseAngles[x] 
            label = fromRadial(thetaText, outerRadius - 50)


            chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke(TEXT_COLOR).fill("none")
            // chart.text(textString).cx(label[0]).cy(label[1]).rotate(thetaText * rad2deg + 90).fill(TEXT_COLOR)
            printTextRadial(chart, textString,  outerRadius - 65, thetaText)
        }

        chart.circle(2 * (outerRadius - 75)).cx(center[0]).cy(center[1]).stroke(TEXT_COLOR).fill("none")

        if ( drawAspects) {

            doAllAspects(chart, planetLocations)
        }

        if ( drawHouseTable) {
            var x = 1700
            var y = 400

            printText(chart, "houses", x, y)
            y += 35

            for (let body of planetNames) {
                y += 45
                chart.path(planetGlyph[planetNames.indexOf(body)]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width:0.3}).scale(3);
                var angle = getAngle(planetLocations[body])
                var houseDeg = getHouse(angle, houseAngles)
                printText(chart, houseDeg[0].toFixed(0), x + 40, y-5)
                printText(chart, houseDeg[1].toFixed(0), x + 90, y-5)
            }
        }
          
        if ( drawStars) {
            $.getJSON("./stars.6.json", function(json) {
    
                for(var i = 0; i < json.features.length; i ++) {
                    var lonLat = json.features[i].geometry.coordinates
                    var mag = parseFloat(json.features[i].properties.mag);
        
                    if (mag > maxMag)
                        continue;
         
                    r = Math.pow(maxMag - mag, 1.2); 
                    coord = EllipticFromCelestialLonLat(lonLat[0], lonLat[1])
                    rect = chart.circle(r).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")
                }
            });
        }
  
    });
}


$( document ).ready(function() {
    createPlot();
});

