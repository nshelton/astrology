

function sin(x) { return Math.sin(x) }
function cos(x) { return Math.cos(x) }
function sqrt(x) { return Math.sqrt(x) }
function acos(x) { return Math.acos(x) }
function abs(x) { return Math.abs(x) }
function sign(x) { return Math.sign(x) }
function atan2(x,y) { return Math.atan2(x,y) }


deg2rad =  0.01745329252;
rad2deg = 1/deg2rad;


_Time = new Date('Aug 24, 1989 2:10:00 PDT') //reza


// var _Time = new Date('June 11, 1989 23:05:00')
// _Time = new Date('June 21, 1959 23:05:00')
// _Time = new Date('April 10, 1991 23:05:00 CDT')
// _Time = new Date('Feb 22, 1986 7:00:00 EST')
// _Time = new Date('Dec 2, 1987 05:00:00 EST')
// _Time = new Date('December 23, 2014 16:20:00 GMT')
// _Time = new Date();
// _Time = new Date('September 19, 1990 07:47:00 PST')
// _Time = new Date('October 22, 1987 05:10:00 MDT')
_Time.setMonth( Math.round(Math.random() * 11) )
_Time.setDate(Math.floor(Math.random() * 30))
_Time.setHours(Math.floor(Math.random() * 24))
_Time.setFullYear(Math.floor(Math.random() *40 + 1980))

// const _Observer = new Astronomy.Observer(90, 0, 0);
// _Observer = new Astronomy.Observer(90, 0, 0);
// cityname = "oakland"
// _Observer = new Astronomy.Observer(37.840270071049474, -122.24752870381347, 0); // oakland
// _Time.setHours(_Time.getHours() + 6)
// cityname = "dallas"
// _Observer = new Astronomy.Observer(33.014996366375, -96.67997803873509, 0); // dallas


cityname = "santa cruz"
_Observer = new Astronomy.Observer(36.977887203085494, -121.90832941577683, 0); 



// cityname = "miami"
// _Observer = new Astronomy.Observer(25.811984528073324, -80.26892302691793, 0); // dallas


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
    point2 = fromRadial(angle, rad - length)
    point1 = setDistance(point, rad)

    arr0 = fromRadial(angle + arrowWidth, rad - 50)
    arr1 = fromRadial(angle - arrowWidth, rad - 50)

    chart.line(point1[0], point1[1], arr0[0], arr0[1]).stroke(QUAD_COLOR)
    chart.line(point1[0], point1[1], arr1[0], arr1[1]).stroke(QUAD_COLOR)
    chart.line(point1[0], point1[1], point2[0], point2[1]).stroke(QUAD_COLOR)
}

function drawLineFromPoints(chart, points, color) {
    lastPoint = points[0]
    for (var i = 1; i < points.length; i ++) {
        var point = points[i]
        chart.line(lastPoint[0], lastPoint[1], point[0], point[1]).stroke(color)
        lastPoint = point
    }
}


let QUAD_COLOR = "#ff0"
let STAR_COLOR = "#0ff"
let ORBIT_COLOR = "#f0f"
let PLANET_COLOR = "#f00"
let TEXT_COLOR = "#f0f"


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


function printText(chart, str, x, y) {
    var width = 15
    var orig = [x,y]
    for(var i = 0; i < str.length; i++) {
        var p = fontGlyphs[str[i]]
        var yoff = getGlyphOffset(str[i]) 
        if ( p != null) {
            chart.path(p).move(x, y + yoff).stroke("#fff").fill("none")
        }

        x += getGlyphWidth(str[i])
    }

    chart.line(orig[0], orig[1]+ 20, x, y+ 20 ).stroke("#fff").fill("none")

}


function printTextAngle(chart, str, x, y ) {
    var angle = getAngle([x,y])
    var rad = getDistance([x,y])

    for(var i = 0; i < str.length; i++) {
        var pathData = fontGlyphs[str[i]]

        if ( pathData == null) {
            rad += 20
            continue;
        }

        var yoff = GetHeightOffset(str[i])
        var angleOffset = yoff * 0.000001 * rad;
        var pathstring = ""
        rad += getGlyphWidth(str[i])/2
        var pos =  fromRadial(angle + angleOffset, rad) 

        for(var j =0; j < pathData.length; j+=3) {
            pathstring += pathData[j] + " " +  pathData[j+1] + " " + (pathData[j+2]).toFixed(0) + " "
        }
        chart.path(pathstring).cx(pos[0]).cy(pos[1]).stroke("#0f0").fill("none").rotate(angle *  rad2deg)
        rad += getGlyphWidth(str[i])/2
    }
}


function printTextRadial(chart, str, rad, theta ) {
    var angle = theta
    var scale = 0.6

    for(var i = 0; i < str.length; i++) {
        var pathData = fontGlyphs[str[i]]

        if ( pathData == null) {
            angle += 0.01
            continue;
        }

        var rOff = scale * GetRadiusOffset(str[i])
        var pathstring = ""
        var angleScale = scale /rad
        angle += angleScale * getGlyphWidth(str[i])/2

        var pos = fromRadial(angle, rad + rOff) 

        for(var j =0; j < pathData.length; j+=3) {
            pathstring += pathData[j] + " " +  pathData[j+1] + " " + (pathData[j+2])+ " "
        }

        chart.path(pathstring).cx(pos[0]).cy(pos[1]).stroke("#0f0").fill("none").rotate(angle * rad2deg + 90).scale(scale)
        angle += angleScale * getGlyphWidth(str[i])/2
    }
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


function printGlyphRing(chart, angles, radius, length, color, textsize) {
    chart.circle(radius).cx(center[0]).cy(center[1]).stroke(color).fill("none")
    chart.circle(radius + length*2).cx(center[0]).cy(center[1]).stroke(color).fill("none")

    var centers = bisectAngles(angles);

    for (let i = 0; i < angles.length; i++) {
        const angle = angles[i];

        var p0 = fromRadial(angle , radius/2 + length/2)
        // chart.text(names[i]).cx(p0[0]).cy(p0[1]).scale(textsize).rotate(angle * rad2deg + 90 ).fill("none").stroke({ color: color, width: 0.3}) 
        chart.path(zodiacGlyph[i]).cx(p0[0]).cy(p0[1]).scale(textsize*2).rotate(angle * rad2deg + 90 ).fill("none").stroke({ color: color, width: 0.3}) 
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
        
        chart.circle(400).cx(center[0]).cy(center[1]).stroke(STAR_COLOR).fill("none")
        chart.circle(400 + 100).cx(center[0]).cy(center[1]).stroke(STAR_COLOR).fill("none")
    
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

            var lineDst = setDistance(planetLocation, planetRad);
 
            var pos3 = setDistance(location, getDistance(location) + 70);
            var angle = getAngle(location)

            outerPlanet = setDistance(planetLocation, getDistance(planetLocation) + 30)
            chart.line(lineDst[0], lineDst[1], outerPlanet[0], outerPlanet[1]).stroke(PLANET_COLOR)

            inner0 = setDistance(planetLocation, getDistance(planetLocation) - 30)
            inner1 = setDistance(planetLocation, 210)
            chart.line(inner0[0], inner0[1], inner1[0], inner1[1]).stroke(PLANET_COLOR)

            chart.path(planetGlyph[i]).cx(location[0]).cy(location[1]).scale(8).rotate(angle * rad2deg - 90 ).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}) 

            // chart.text( getPlanetInfo([planetNames[i]])).cx().cy(pos3[1]).scale(1).rotate(angle * rad2deg ).fill(TEXT_COLOR)

            printTextAngle(chart, getPlanetInfo([planetNames[i]]), pos3[0], pos3[1])

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

        // for ( var i = 0 ; i < 361; i +=10) {
        //     var horizonPoints = []

        //         for ( var j= -90 ; j < 90; j += 1 ) {
        //         const horiz = new Astronomy.Spherical(  j, i , 100.0);                   /* any positive distance value will work fine. */
        //         coord = transfromHorizToScreen(horiz)
        //         horizonPoints.push(coord)
        //     }
        //     drawLineFromPoints(chart, horizonPoints, QUAD_COLOR)
        // }

        const horiz = new Astronomy.Spherical(  90 , 90, 100.0);                   /* any positive distance value will work fine. */
        directlyUp = transfromHorizToScreen(horiz)
        northpole = EllipticFromCelestialLonLat(0, 90)

        // chart.line(northpole[0], northpole[1], directlyUp[0], directlyUp[1]).stroke('#fff').fill("none")

        var MCangle = getAngle(directlyUp, northpole);


        var outerRadius = 800/2 + 25
        // /--------------------------------------------ASCendant
        var textOffset = 40
        var EText = setDistance(accPos, outerRadius + textOffset)
        var angle = getAngle(EText)
        chart.text( "AC").cx(EText[0]).cy(EText[1]).fill(QUAD_COLOR).rotate(angle * rad2deg + 90 ).font("size", 35)

        DrawArrow(chart, accPos, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------Descendant
        var WText = setDistance(decPos, outerRadius + textOffset)
        var angle = getAngle(WText) 
        chart.text( "DC").cx(WText[0]).cy(WText[1]).fill(QUAD_COLOR).rotate(angle * rad2deg + 90).font("size", 35)
        
        DrawArrow(chart, decPos, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------MC
        var mcPoint = fromRadial(MCangle, outerRadius)
        var SText = setDistance(mcPoint, outerRadius + textOffset)
        var angle = getAngle(SText)
        chart.text( "MC").cx(SText[0]).cy(SText[1]).fill(QUAD_COLOR).rotate(angle * rad2deg + 90 ).font("size", 35)


        DrawArrow(chart, mcPoint, 300, outerRadius + 25, 0.07)

        // /--------------------------------------------IC
        var icPoint = fromRadial(MCangle + Math.PI, outerRadius)


        var NText = setDistance(icPoint, outerRadius + textOffset)
        var angle = getAngle(NText) 
        chart.text( "IC").cx(NText[0]).cy(NText[1]).fill(QUAD_COLOR).rotate(angle * rad2deg + 90).font("size", 35)

        DrawArrow(chart, icPoint, 300, outerRadius + 25, 0.07)

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

            var a0 = housePositions[x];
            var a1 = housePositions[(x + 1) %12];
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
                // if ( i% 6 == 0)
                //     length += 10

                var alpha = (i/30)
                var angle = alpha * mina + (1-alpha) * maxa
                q0 = fromRadial(angle, outerRadius - 25 )
                q1 = fromRadial(angle, outerRadius - 35 - length )
                chart.line(q0[0], q0[1], q1[0], q1[1]).stroke('#aaa').fill("none")
            }

            var textString = " " + ra.toFixed(0) + " " + getHouseInfo2(ra);

            thetaText = housePositions[x] 
            label = fromRadial(thetaText, outerRadius - 50)


            chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke(TEXT_COLOR).fill("none")
            // chart.text(textString).cx(label[0]).cy(label[1]).rotate(thetaText * rad2deg + 90).fill(TEXT_COLOR)
            printTextRadial(chart, textString,  outerRadius - 65, thetaText)
        }

        chart.circle(2 * (outerRadius - 75)).cx(center[0]).cy(center[1]).stroke(TEXT_COLOR).fill("none")

        var offs = 1

       
        function drawOppSymbol(x,y) {
            chart.line(x,y, x+10, y+10).stroke("#0ff");
            chart.circle(5).cx(x).cy(y).stroke("#0ff");
            chart.circle(5).cx(x+10).cy(y+10).stroke("#0ff"); 
        }       
        

        if ( drawConjunctions) {

            conjunctions = findConjunctions(planetLocations, 0.1, Math.PI, center)

            for (var i = 0; i < conjunctions.length; i ++) {
                conj_line = [planetLocations[conjunctions[i][0]], planetLocations[conjunctions[i][1]]]
            
                console.log(conj_line)
                var l = trimLine(conj_line, 0.9)
                chart.line(l[0][0] + offs, l[0][1] + offs, l[1][0] + offs, l[1][1]+offs).stroke({ color: '#ff0'})                 
            }

            /// Draw text infos
            var lineHeight = 35
            var y = 400
            y += lineHeight
            var x = 300
            chart.text("Conjunctions").move(x,y).fill("#0ff")
            
            for( var i =0; i < conjunctions.length; i++) {
                var x = 300

                y += lineHeight
                drawOppSymbol(x,y); x += 30

                chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][0])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 30
                chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][1])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 0
            }

   /////////////////////////////////////////////////////////////////////////////////////////////////////
            conjunctions = findConjunctions(planetLocations, 0.1, Math.PI/2, center)

            for (var i = 0; i < conjunctions.length; i ++) {
                conj_line = [planetLocations[conjunctions[i][0]], planetLocations[conjunctions[i][1]]]
            
                console.log(conj_line)
                var l = trimLine(conj_line, 0.9)
                chart.line(l[0][0] + offs, l[0][1] + offs, l[1][0] + offs, l[1][1]+offs).stroke({ color: PLANET_COLOR, width: 0.3});          
            }

            y += lineHeight
            var x = 300
            
            for( var i =0; i < conjunctions.length; i++) {
                var x = 300

                y += lineHeight
                chart.rect(20,20).cx(x).cy(y+5).fill("none").stroke( PLANET_COLOR); x += 30

                chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][0])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 30
                chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][1])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 0
            }
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////////
        conjunctions = findConjunctions(planetLocations, 0.1, 2 * Math.PI/3, center)

        for (var i = 0; i < conjunctions.length; i ++) {
            conj_line = [planetLocations[conjunctions[i][0]], planetLocations[conjunctions[i][1]]]
        
            console.log(conj_line)
            var l = trimLine(conj_line, 0.9)
            chart.line(l[0][0] + offs, l[0][1] + offs, l[1][0] + offs, l[1][1]+offs).stroke({ color: PLANET_COLOR, width: 0.3});          
        }

        y += lineHeight
        var x = 300
        
        for( var i =0; i < conjunctions.length; i++) {
            var x = 300

            y += lineHeight
            // todo draw conjunctions
            
            chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][0])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 30
            chart.path(planetGlyph[planetNames.indexOf(conjunctions[i][1])]).move(x,y).fill("none").stroke({ color: PLANET_COLOR, width: 0.3}).scale(3); x += 0
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

