

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
var _Time = new Date('June 21, 1959 23:05:00')
// _Time.setMonth( Math.round(Math.random() * 11) )
// _Time.setDate(Math.floor(Math.random() * 30))
// _Time.setHours(Math.floor(Math.random() * 24))
// _Time.setFullYear(Math.floor(Math.random() *40 + 1980))
_Time.setHours(_Time.getHours() + 8)

// const _Observer = new Astronomy.Observer(90, 0, 0);
const _Observer = new Astronomy.Observer(90, 80.68064645176072, 0);
// const _Observer = new Astronomy.Observer(33.02019285171668, -76.68064645176072, 0);


var scale = 200
var center = [700,500]
var eclipticCenterICSC = [-90,65] // just guessed at this 

eclipticCenter = transformToEarth(eclipticCenterICSC)

let drawStars = true;
let drawOrbits = true;

function transform(hor) {
    // return [
    //     1000 * (hor.azimuth) / 200,
    //     1000 * (hor.altitude + 90 )/180 ]

    var lambda = hor.azimuth * deg2rad ;
    var phi = hor.altitude * deg2rad ;

    var rho = Math.PI/2 - phi
    var theta = Math.PI - lambda;

    return [
         scale * rho * cos (theta) + center[0] ,
        -scale * rho * sin (theta) + center[1] ]
}

function transformToEarth(p) {
    p[0] *= 24/360 //convert degrees to hours
    // p[1] *= 0.5
    let hor = Astronomy.Horizon(_Time, _Observer, p[0], p[1], "normal")
    return transform(hor);
}

function drawGrid(chart, zodiacRAs) {

    var bg = chart.rect(0,0).size(2000,2000).fill("#000")

    // for(var x = 0; x < 12; x ++) {
    //     var px = x /12 * 360 - 180
    //     var lasty = -80
    //     for(var y = 1; y < 51; y ++) {

    //         var py = y / 50 * 180 - 90;

    //         var a = transformToEarth([px, lasty])
    //         var b = transformToEarth([px, py])

    //         var line = chart.line(a[0], a[1], b[0], b[1]).stroke('#aaa').fill("none")
    //         lasty = py;
    //     }
    // }

    for(var x = 0; x < 6; x ++) {
        var theta = x * Math.PI / 6 ;
        var pos0 = fromRadial(theta, 500,  eclipticCenter)
        var pos1 = fromRadial(theta, -500,  eclipticCenter)
        chart.line([pos0, pos1]).stroke('#aaa').fill("none").style("dot")
    }

    chart.circle(100).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(200).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(450).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(900).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    chart.circle(700).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")

    // chart.circle(174).cx(center[0]).cy(center[1]).stroke('#aaa').fill("none")

    pos0 = transformToEarth([0, 85])
    pos1 = transformToEarth([0, 95])
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)
    pos0 = transformToEarth([90, 85])
    pos1 = transformToEarth([90, 95])
    
    chart.line(pos0[0], pos0[1], pos1[0], pos1[1]).stroke('#f00').fill("none").scale(4)

    // chart.circle(20).cx(pos0[0]).cy(pos0[1]).stroke('#aaa').fill('#f00')
    // chart.circle(350).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
    // chart.circle(450).cx(eclipticCenter[0]).cy(eclipticCenter[1]).stroke('#aaa').fill("none")
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

function createPlot() {

    var chart = SVG().addTo("body").size( 2000, 2000)

    if ( drawStars) {
        $.getJSON("./stars.6.json", function(json) {

            for(var i = 0; i < json.features.length; i ++) {
                var coord = json.features[i].geometry.coordinates
                var mag = parseFloat(json.features[i].properties.mag);
    
                if (mag > 4)
                    continue;
     
                r = 2 * Math.pow(4 - mag, 0.7); // replace 20 with dimmest magnitude in the data
                coord = transformToEarth(coord)
                rect = chart.circle(r).cx(coord[0]).cy(coord[1]).stroke('#f06').fill("none")
            }
    
        });
    }

    $.getJSON("./constellations.lines.json", function(json) {

        var zodiac = ["Vir","Ari","Cap","Cnc","Leo","Gem","Lib","Psc","Aqr","Sgr", "Sco", "Tau"]
        var symbols = ["♍︎", "♈︎", "♑︎", "♋︎",  "♌︎", "♊︎", "♎︎", "♓︎", "♒︎", "♐︎", "♏︎", "♉︎"]
        var elements = ["🜃", " 🜂", "🜃", "🜄",  " 🜂", "🜁", "🜁", "🜄", "🜁", " 🜂", "🜄", "🜃"]
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
                    var lastPoint = transformToEarth(coord[0])

                    for(var j = 1; j < coord.length; j++) {
                        
                        var p = transformToEarth(coord[j])

                        // if ( name == "Psc" && coord[j][0] < 180 ) {
                        //     coord[j][0] += 360
                        // }

                        // cRA += coord[j][0]
                        var line = chart.line(lastPoint[0], lastPoint[1], p[0], p[1]).stroke('#0f0').fill("none")
                        
                        n++;
                        c[0] += p[0]
                        c[1] += p[1]

                        lastPoint = p
                    }
                }

                var centroid = [c[0]/n, c[1]/n]

                var angle = getAngle(centroid, eclipticCenter)

                label = setDistance(centroid, 500, eclipticCenter);

                var text = chart.text(symbols[index]).cx(label[0]).cy(label[1]).scale(3).fill("none").stroke({ color: '#0f0', width: 0.3}).font("Family", "Menlo")
                var ra = cRA/n * 24/360
                // zodiacRAs.push(ra)
                // label = setDistance(centroid, 130, eclipticCenter);
                // var text = chart.text(elements[index]).cx(label[0]).cy(label[1]).scale(2).fill("none").stroke({ color: '#0f0', width: 0.3}).font("Family", "Menlo")
                chart.text( ra.toFixed(2)).move(label[0]+ 30,label[1]).fill("#0f0").font("Family", "Menlo")

                // var text = chart.text(name).move(c[0]/n, c[1]/n).scale(1).fill("#fff")
            }
        }
    
        drawGrid(chart, zodiacRAs)


        let planetSymbols = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "⛢", "♆", "♇"]
        let planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']


        i = 0

        var planetLocations = {};
        var planetRAs = {};

        for (let body of planetNames) {
            let equ_2000 = Astronomy.Equator(body, _Time, _Observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, _Time, _Observer, true, true);
            let hor = Astronomy.Horizon(_Time, _Observer, equ_ofdate.ra, equ_ofdate.dec, 'normal');
            coord = transform(hor)

            chart.circle(1).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')
            chart.circle(10).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill('none')
            chart.circle(15).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")
            chart.circle(20).cx(coord[0]).cy(coord[1]).stroke('#0ff').fill("none")

            // chart.text(hor.azimuth).move(coord[0],coord[1]).fill("#0f0").font("Family", "Menlo")

            console.log(planetRAs)
            planetLocations[body] = coord
            planetRAs[body] = hor

          
        
        }

function layoutPlanetLabels(positions)  {

    let newPositions = {}

    // move to fixed radius
    let angles = {}
    for (var i = 0; i < planetNames.length; i ++) {
        angles[planetNames[i]] =  getAngle(positions[planetNames[i]], eclipticCenter)
    }

    for ( var k = 0; k < 10; k ++) {
        for (var i = 0; i < planetNames.length; i ++) {
            for (var j = 0; j < planetNames.length; j++) {
                var dist = abs(angles[planetNames[i]]- angles[planetNames[j]])
                if(i != j && dist < 0.1) {
                    
                    var ai = angles[planetNames[i]];
                    var aj = angles[planetNames[j]];
                   
                    var delta = sign(ai - aj) * 0.02;
                
                    angles[planetNames[i]] += delta;
                    angles[planetNames[j]] -= delta;

                
                    // var sign = rad_i > rad_j ?  0.8 : 1.2

                    // newPositions[planetNames[j]] = setDistance(newPositions[planetNames[j]], rad  * sign )
                    // newPositions[planetNames[i]] = setDistance(newPositions[planetNames[i]], rad * 1/sign )

                }
            }

        }
    }

    for (var i = 0; i < planetNames.length; i ++) {
        newPositions[planetNames[i]] = fromRadial(angles[planetNames[i]], 400, eclipticCenter)
    }


    return newPositions
}

function findConjunctions(positions, thresh)  {
    conj = []

    // move to fixed radius
    let angles = {}
    for (var i = 0; i < planetNames.length; i ++) {
        angles[planetNames[i]] =  getAngle(positions[planetNames[i]], eclipticCenter)
        if ( angles[planetNames[i]] < 0 )
            angles[planetNames[i]] += Math.PI * 2
        console.log(angles[planetNames[i]] )
    }
    
    for (var i = 0; i < planetNames.length; i ++) {
        for (var j = 0; j < planetNames.length; j ++) {

            if(i != j && (
                abs(angles[planetNames[i]] - angles[planetNames[j]]) < thresh ||
                abs(abs(angles[planetNames[i]] - angles[planetNames[j]]) - Math.PI) < thresh   ||
                abs(abs(angles[planetNames[i]] - angles[planetNames[j]]) - 2 * Math.PI / 3) < thresh  ||
                abs(abs(angles[planetNames[i]] - angles[planetNames[j]]) - Math.PI/2) < thresh  )) {
                    conj.push([positions[planetNames[i]], positions[planetNames[j]]]) 
            }
        }
    }
    return conj;
}


        console.log(planetLocations)
        conjunctions = findConjunctions(planetLocations, 0.1)
        
        console.log(conjunctions)
        for (var i = 0; i < conjunctions.length; i ++) {
            chart.line(conjunctions[i]).stroke({ color: '#ff0', width: 1}) 
        }
        conjunctions = findConjunctions(planetLocations, 0.2)
        for (var i = 0; i < conjunctions.length; i ++) {
            chart.line(conjunctions[i]).stroke({ color: '#ff0', width: 1, dasharray : "5,5"}) 
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
                    // coord = transformToEarth([(equ_2000.ra), (equ_2000.dec)])
                    coord = transform(hor)
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

