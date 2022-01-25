

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
_Time = new Date('April 10, 1991 23:05:00')
// _Time.setMonth( Math.round(Math.random() * 11) )
// _Time.setDate(Math.floor(Math.random() * 30))
// _Time.setHours(Math.floor(Math.random() * 24))
// _Time.setFullYear(Math.floor(Math.random() *40 + 1980))
_Time.setHours(_Time.getHours() + 8)

// const _Observer = new Astronomy.Observer(90, 0, 0);
_Observer = new Astronomy.Observer(90, 0, 0);
// const _Observer = new Astronomy.Observer(33.02019285171668, -76.68064645176072, 0);

var radialProjection = true
var scale = 200
var center = [700,700]
var eclipticCenterICSC = [-90,65] // just guessed at this 

eclipticCenter = transformDegreesCelestialToEarth(eclipticCenterICSC)

let drawStars = true;
let drawOrbits = true;
let drawConjunctions = false;

function drawGrid(chart, zodiacRAs) {

    zodiacRAs.sort(function(a,b) {
        return (+a[1]) - (+b[1]);
    });

    console.log("zodiacRAs", zodiacRAs)
    zodiacBoundaries = []

    for(var i = 0; i < zodiacRAs.length; i++) {
        if ( i == 11){
            zodiacBoundaries.push((zodiacRAs[i][1] + 24 + zodiacRAs[(i[1]+1) %12] ) / 2) 
        } else {
            zodiacBoundaries.push((zodiacRAs[i][1] + zodiacRAs[(i[1]+1) %12] ) / 2) 
        }
    }

    console.log(zodiacBoundaries)

    for(var x = 0; x < zodiacRAs.length; x ++) {
        pos0 = fromCelestialHour(zodiacRAs[x][1], 1)
        pos1 = fromCelestialHour(zodiacRAs[x][1], -1)

        chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)
        chart.text( zodiacRAs[x][1].toFixed(2)).move(pos1[0]+ 30,pos1[1]).fill("#f00").font("Family", "Menlo")

    }

    // for(var x = 0; x < zodiacBoundaries.length; x ++) {
    //     pos0 = transformHourCelestialToEarth([zodiacBoundaries[x], 10])
    //     pos1 = transformHourCelestialToEarth([zodiacBoundaries[x], 0])
    //     chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)
    //     chart.text( zodiacBoundaries[x].toFixed(2)).move(pos1[0]+ 30,pos1[1]).fill("#f00").font("Family", "Menlo")
    // }
  
    if ( radialProjection ) {
        for(var x = 0; x < 12; x ++) {
            var theta = x*2;
            var pos0 = fromCelestialHour(theta, 90 )
            var pos1 = fromCelestialHour(theta, 10)
            chart.line([pos0, pos1]).stroke('#aaa').fill("none").style("dot")
        }
    
        // chart.circle(100).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
        // chart.circle(200).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
        // chart.circle(450).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
        // chart.circle(900).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
        // chart.circle(700).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    
        // chart.circle(174).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")
    
    } else {
        for(var x = 0; x < 12; x ++) {
            var px = x /12 * 360 - 180
            var lasty = -80
            for(var y = 1; y < 51; y ++) {

                var py = y / 50 * 180 - 90;

                var a = fromCelestialLonLat([px, lasty])
                var b = fromCelestialLonLat([px, py])

                var line = chart.line(a[0], a[1], b[0], b[1]).stroke('#aaa').fill("none")
                lasty = py;
            }
        }
    }
   
    pos0 = fromCelestialLonLat(0, 85)
    pos1 = fromCelestialLonLat(0, 95)
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)
    pos0 = fromCelestialLonLat(90, 85)
    pos1 = fromCelestialLonLat(90, 95)
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)

    // chart.circle(20).cx(pos0[0]).cy(pos0[1]).stroke('#aaa').fill('#f00')
    // chart.circle(350).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    // chart.circle(450).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
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

                label = [centroid[0], centroid[1]]
                if ( radialProjection) {
                    label = setDistance(centroid, 500, eclipticCenter);
                }   

                var text = chart.text(symbols[index]).cx(label[0]).cy(label[1]).scale(3).fill("none").stroke({ color: '#0f0', width: 0.3}).font("Family", "Menlo")
                var ra = cRA/n * 24/360

                while (ra < 0) 
                    ra += 24;

                zodiacRAs.push([name, +ra])
                // label = setDistance(centroid, 130, eclipticCenter);
                // var text = chart.text(elements[index]).cx(label[0]).cy(label[1]).scale(2).fill("none").stroke({ color: '#0f0', width: 0.3}).font("Family", "Menlo")
                chart.text( ra.toFixed(2)).move(label[0]+ 30,label[1]).fill("#0f0").font("Family", "Menlo")

                // var text = chart.text(name).move(c[0]/n, c[1]/n).scale(1).fill("#fff")
            }
        }
    
        drawGrid(chart, zodiacRAs)


        i = 0

        var planetLocations = {};
        var planetRAs = {};

        for (let body of planetNames) {
            let equ_2000 = Astronomy.Equator(body, _Time, _Observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, _Time, _Observer, true, true);
            let hor = Astronomy.Horizon(_Time, _Observer, equ_ofdate.ra, equ_ofdate.dec, 'normal');
            coord = fromCelestialHour(equ_ofdate.ra, equ_ofdate.dec)
            console.log(equ_ofdate.ra, equ_ofdate.dec, coord)
            chart.circle(1).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')
            chart.circle(10).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')
            chart.circle(15).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")
            chart.circle(20).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")

            // chart.text(hor.azimuth).move(coord[0],coord[1]).fill("#0f0").font("Family", "Menlo")

            console.log(planetRAs)
            planetLocations[body] = coord
            planetRAs[body] = hor

        
        }


        if ( drawConjunctions) {
            conjunctions = findConjunctions(planetLocations, 0.1)
        
            console.log(conjunctions)
            for (var i = 0; i < conjunctions.length; i ++) {
                chart.line(conjunctions[i]).stroke({ color: '#ff0', width: 1}) 
            }
            conjunctions = findConjunctions(planetLocations, 0.2)
            for (var i = 0; i < conjunctions.length; i ++) {
                chart.line(conjunctions[i]).stroke({ color: '#ff0', width: 1, dasharray : "5,5"}) 
            }
    
        }

        labels = layoutPlanetLabels(planetLocations)

        for (var i = 0; i < planetNames.length; i ++) {

            var name = planetNames[i]
            var location = labels[name]
            var planetLocation = planetLocations[name]

            var text = chart.text(planetSymbols[i]).cx(location[0]).cy(location[1]).scale(4).fill("none").stroke({ color: '#0ff', width: 0.3}) 
            console.log(location[0], location[1], planetLocation[0], planetLocation[1])
            chart.line(location[0], location[1], planetLocation[0], planetLocation[1]).stroke("#888").fill("none").scale(1)

            var hor = planetRAs[name]
            chart.text( hor.ra.toFixed(2) +", " +hor.azimuth.toFixed(2)).move(location[0]+ 30,location[1]).fill("#0ff").font("Family", "Menlo")

        }

        if (drawOrbits) {
            for (let body of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
                var newDate = new Date(_Time) 
                newDate.setDate(newDate.getDate() - 30);
                lastpos = [0,0]
                for(var i = 0; i < 60; i ++) {
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



    });


}


$( document ).ready(function() {
    createPlot();
});

