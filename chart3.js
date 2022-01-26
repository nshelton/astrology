

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
_Time = new Date('April 10, 1991 23:05:00 CDT')
// _Time = new Date('Dec 2, 1987 05:00:00 EST')
// _Time = new Date('December 23, 2014 16:20:00 GMT')
// _Time = new Date();
// _Time = new Date('September 19, 1990 07:47:00 PST')
// _Time = new Date('October 22, 1987 05:10:00 MDT')
// _Time.setMonth( Math.round(Math.random() * 11) )
// _Time.setDate(Math.floor(Math.random() * 30))
// _Time.setHours(Math.floor(Math.random() * 24))
// _Time.setFullYear(Math.floor(Math.random() *40 + 1980))

// const _Observer = new Astronomy.Observer(90, 0, 0);
// _Observer = new Astronomy.Observer(90, 0, 0);
// cityname = "oakland"
// _Observer = new Astronomy.Observer(37.840270071049474, -122.24752870381347, 0); // oakland
// _Time.setHours(_Time.getHours() + 6)
cityname = "dallas"
_Observer = new Astronomy.Observer(33.014996366375, -96.67997803873509, 0); // dallas

// cityname = "washington, DC"
// _Observer = new Astronomy.Observer(38.9240400110907, -77.00558584122027, 0); // dallas

// cityname = "roswell"
// _Observer = new Astronomy.Observer(33.40416482155773, -104.53147490972424, 0); // dallas

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
let drawConjunctions = true;

let maxMag = 5
let eclipticRadius = 620/2

function DrawArrow(chart, point, length, rad, arrowWidth) {

    angle = getAngle(point)
    point2 = fromRadial(angle, rad - length *0.5)
    point1 = setDistance(point, rad + length *0.5)

    arr0 = fromRadial(angle + arrowWidth, rad + length*0.5-20)
    arr1 = fromRadial(angle - arrowWidth, rad + length*0.5-20)

    chart.line(point1[0], point1[1], arr0[0], arr0[1]).stroke('#f00')
    chart.line(point1[0], point1[1], arr1[0], arr1[1]).stroke('#f00')
    chart.line(point1[0], point1[1], point2[0], point2[1]).stroke('#f00')

}


function bisectAngles(angles) {

    var centers = []
    for ( var i = 0 ; i < angles.length; i ++) {
        var a0 = angles[i];
        var a1 = angles[(i + 1) %12];
        var mina = Math.min(a0, a1)
        var maxa = Math.max(a0, a1)
        if (maxa - mina > Math.PI ) {
            mina += Math.PI * 2
        }
        centers.push((mina + maxa)/2)
    }
    return centers
}

function printRing(chart, names, angles, radius, length, color, textsize) {

    
    chart.circle(radius).cx(center[0]).cy(center[1]).stroke(color).fill("none")
    chart.circle(radius + length*2).cx(center[0]).cy(center[1]).stroke(color).fill("none")

    var centers = bisectAngles(angles);

    for (let i = 0; i < angles.length; i++) {
        const angle = angles[i];

        var p0 = fromRadial(angle , radius/2 + length/2)
        chart.text(names[i]).cx(p0[0]).cy(p0[1]).scale(textsize).rotate(angle * rad2deg + 90 ).fill("none").stroke({ color: color, width: 0.3}) 
    }

    for (let i = 0; i < centers.length; i++) {
        const angle = centers[i];

        var p0 = fromRadial(angle, radius/2)
        var p1 = fromRadial(angle, radius/2 + length)

        chart.line(p0[0], p0[1], p1[0], p1[1]).stroke(color)

    }
}

function drawPlanet(chart, coord, col) {
    chart.circle(1).cx(coord[0]).cy(coord[1]).stroke(col).fill('none')
    chart.circle(10).cx(coord[0]).cy(coord[1]).stroke(col).fill('none')
    chart.circle(50).cx(coord[0]).cy(coord[1]).stroke(col).fill("none")
    chart.circle(60).cx(coord[0]).cy(coord[1]).stroke(col).fill("none")
}

function createPlot() {

    var chart = SVG().addTo("body").size( 2000, 2000)
    var bg = chart.rect(0,0).size(2000,2000).fill("#000")

    // for (var i = 0; i < 2; i ++) {
    //     chart.circle(i* 300 + 20).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    // }
 


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
                    var lastPoint = EllipticFromCelestialLonLat(coord[0][0], coord[0][1])
                    centroid[0] += lastPoint[0]
                    centroid[1] += lastPoint[1]
                    n++
                    for(var j = 1; j < coord.length; j++) {
                        var p = EllipticFromCelestialLonLat(coord[j][0], coord[j][1])
                        chart.line(lastPoint[0], lastPoint[1], p[0], p[1]).stroke('#0ff').fill("none")
                        centroid[0] += p[0]
                        centroid[1] += p[1]
                        n++
                        lastPoint = p
                    }
                }
                zodiacAngles[index] = getAngle([centroid[0]/n, centroid[1]/n])
            }
        }

        printRing(chart, symbols, zodiacAngles, 850, 50, "#0f0", 2)

        var basicAngles = []
        for (let i = 0; i < 12; i++) {
            basicAngles.push(-(i/12) * 2 * Math.PI -  Math.PI/12)       
        }

        printRing(chart, symbols, basicAngles, 325, 50, "#f0f", 1)

        var planetLocations = {}
        var planetColor = "#f00"

        for (let body of planetNames) {
            let equ_2000 = Astronomy.Equator(body, _Time, _Observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, _Time, _Observer, true, true);
            console.log(equ_ofdate, equ_2000,body )
            coord = EllipticFromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
            drawPlanet(chart, coord, planetColor)
            planetLocations[body] = coord
        }

        planetRad = 550
        labels = layoutPlanetLabels(planetLocations, planetRad)

        for (var i = 0; i < planetNames.length; i ++) {

            var name = planetNames[i]
            var location = labels[name]
            var planetLocation = planetLocations[name]

            var lineDst = setDistance(planetLocation, planetRad);
 
            var pos3 = setDistance(location, getDistance(location) + 70);
            var angle = getAngle(location)

            outerPlanet = setDistance(planetLocation, getDistance(planetLocation) + 30)
            chart.line(lineDst[0], lineDst[1], outerPlanet[0], outerPlanet[1]).stroke(planetColor)


            inner0 = setDistance(planetLocation, getDistance(planetLocation) - 30)
            inner1 = setDistance(planetLocation, 210)
            chart.line(inner0[0], inner0[1], inner1[0], inner1[1]).stroke(planetColor)


            chart.text(planetSymbols[i]).cx(location[0]).cy(location[1]).scale(4).rotate(angle * rad2deg - 90 ).fill("none").stroke({ color: planetColor, width: 0.3}) 
            chart.text( getPlanetInfo([planetNames[i]])).cx(pos3[0]).cy(pos3[1]).scale(1).rotate(angle * rad2deg ).fill("#ddd").font("Family", "Menlo")
        }
        
        if (drawOrbits) {
            for (let body of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
                var newDate = new Date(_Time) 
                newDate.setDate(newDate.getDate() - 0);
                lastpos = [0,0]
                for(var i = 0; i < 360; i ++) {
                    newDate.setDate(newDate.getDate() + 1);
                   let equ_ofdate = Astronomy.Equator(body, newDate, _Observer, true, true);
                    coord = EllipticFromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
                    if (i > 0)
                        chart.line(lastpos[0], lastpos[1], coord[0], coord[1]).stroke(getColor(body)).fill("none")
                    lastpos = coord
                }
            }
        }


        function transfromHorizToScreen(horiz) {
            var horizVector =  Astronomy.VectorFromHorizon(horiz, _Time);
            var EQJ  = Astronomy.RotateVector(Rotation_HOR_EQJ, horizVector);
            var EQJ2000 = Astronomy.EquatorFromVector(EQJ, _Time, null)
            return EllipticFromCelestialHour(EQJ2000.ra, EQJ2000.dec)
        }
    
        var lastPoint = []
        var lastRad = 0
        var accPos = 0
        var decPos = 0

        // HORIZON
        for ( var i = 0 ; i < 361; i ++ ) {
            const horiz = new Astronomy.Spherical(  0, i , 100.0);                   /* any positive distance value will work fine. */
            coord = transfromHorizToScreen(horiz)
    
            if ( i > 0) {
                chart.line(lastPoint[0], lastPoint[1], coord[0], coord[1]).stroke('#fff').fill("none")
            }

            var rad = getDistance(coord);

            if (rad > eclipticRadius && lastRad < eclipticRadius) {
                accPos = coord
            }

            if (rad < eclipticRadius && lastRad > eclipticRadius) {
                decPos = coord
            }

            lastPoint = coord;
            lastRad = rad;
        }
    

        const horiz = new Astronomy.Spherical(  90 , 90, 100.0);                   /* any positive distance value will work fine. */
        directlyUp = transfromHorizToScreen(horiz)
        northpole = EllipticFromCelestialLonLat(0, 90)

        // chart.line(northpole[0], northpole[1], directlyUp[0], directlyUp[1]).stroke('#fff').fill("none")

        var MCangle = getAngle(directlyUp, northpole);


        var outerRadius = 850/2 + 25
        // /--------------------------------------------ASCendant
        var textOffset = 40
        var EText = setDistance(accPos, outerRadius + textOffset)
        var angle = getAngle(EText)
        chart.text( "AC").cx(EText[0]).cy(EText[1]).fill("#f00").rotate(angle * rad2deg + 90 ).font("Family", "Menlo").font("size", 35)

        DrawArrow(chart, accPos, 100, outerRadius + 25, 0.02)

        p = setDistance(accPos, outerRadius)
        p2 = setDistance(p, 185)
        chart.line(p[0], p[1], p2[0], p2[1]).stroke("#f00").fill("none") 

        // /--------------------------------------------Descendant
        var WText = setDistance(decPos, outerRadius + textOffset)
        var angle = getAngle(WText) 
        chart.text( "DC").cx(WText[0]).cy(WText[1]).fill("#f00").rotate(angle * rad2deg + 90).font("Family", "Menlo").font("size", 35)
        
        p = setDistance(decPos, outerRadius)
        p2 = setDistance(p, 185)
        chart.line(p[0], p[1], p2[0], p2[1]).stroke("#f00").fill("none") 

        DrawArrow(chart, decPos, 100, outerRadius + 25, 0.02)

        // /--------------------------------------------MC
        var mcPoint = fromRadial(MCangle, outerRadius)
        var SText = setDistance(mcPoint, outerRadius + textOffset)
        var angle = getAngle(SText, eclipticCenter)
        chart.text( "MC").cx(SText[0]).cy(SText[1]).fill("#f00").rotate(angle * rad2deg + 90 ).font("Family", "Menlo").font("size", 35)

        p = setDistance(mcPoint, outerRadius)
        p2 = setDistance(p, 185)
        chart.line(p[0], p[1], p2[0], p2[1]).stroke("#f00").fill("none") 

        DrawArrow(chart, mcPoint, 100, outerRadius + 25, 0.02)

        // /--------------------------------------------IC
        var icPoint = fromRadial(MCangle + Math.PI, outerRadius)


        var NText = setDistance(icPoint, outerRadius + textOffset)
        var angle = getAngle(NText) 
        chart.text( "IC").cx(NText[0]).cy(NText[1]).fill("#f00").rotate(angle * rad2deg + 90).font("Family", "Menlo").font("size", 35)

        p = setDistance(icPoint, outerRadius)
        p2 = setDistance(p, 185)
        chart.line(p[0], p[1], p2[0], p2[1]).stroke("#f00").fill("none") 

        DrawArrow(chart, icPoint, 100, outerRadius + 25, 0.02)

        var housePositions = createPorphyryHouses(accPos, mcPoint, decPos, icPoint, center)
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
            pos0 = fromRadial(thetaTick, outerRadius - 25)
            pos1 = fromRadial(thetaTick, outerRadius - 75 )

            var textString = ra.toFixed(0) + " | " + getHouseInfo2(ra);

            thetaText = housePositions[x] + 0.01 * textString.length
            label = fromRadial(thetaText, outerRadius - 50)


            chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#aaa').fill("none")
            chart.text(textString).cx(label[0]).cy(label[1]).rotate(thetaText * rad2deg + 90).fill("#ddd").font("Family", "Menlo")
        }

        chart.circle(2 * (outerRadius - 75)).cx(center[0]).cy(center[1]).stroke("#aaa").fill("none")

        var offs = 10
        if ( drawConjunctions) {
            conjunctions = findConjunctions(planetLocations, 0.1, center)
        
            console.log(conjunctions)
            for (var i = 0; i < conjunctions.length; i ++) {
                for (var j = 0; j < 2; j ++) {
                    var l = trimLine(conjunctions[i],0.9)
                    chart.line(l[0][0] + offs, l[0][1] + offs, l[1][0] + offs, l[1][1]+offs).stroke({ color: '#ff0'}) 
                 }
            }
            conjunctions = findConjunctions(planetLocations, 0.2, center)
            for (var i = 0; i < conjunctions.length; i ++) {
                chart.line(trimLine(conjunctions[i],0.9)).stroke({ color: '#ff0'}) 
            }
        }


        /// Draw text infos
        var lineHeight = 25
        var y = 1600
        y -= lineHeight
        chart.text("Porphyry Houses | Elliptic Pole").move(300,y).fill("#0ff").font("Family", "Menlo")
        y -= lineHeight
        chart.text( _Time.toString()).move(300,y).fill("#0ff").font("Family", "Menlo")
        y -= lineHeight
        chart.text( "lat, lon = \t (" +  _Observer.latitude.toFixed(2) + " " + _Observer.longitude.toFixed(2) +") \t" + cityname).move(300,y).fill("#0ff").font("Family", "Menlo")
    });
}


$( document ).ready(function() {
    createPlot();
});

