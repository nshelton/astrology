

planetSymbols = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "⛢", "♆", "♇"]
planetNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
zodiac =  ["Ari", "Tau", "Gem", "Cnc", "Leo", "Vir","Lib", "Sco","Sgr", "Cap", "Aqr","Psc"]
symbols = ["♈︎", "♉︎",  "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎",  "♑︎", "♒︎", "♓︎"]

// elements = ["🜃", " 🜂", "🜃", "🜄",  " 🜂", "🜁", "🜁", "🜄", "🜁", " 🜂", "🜄", "🜃"]

function layoutPlanetLabels(positions, distance, c)  {

    let newPositions = {}

    // move to fixed radius
    let angles = {}
    for (var i = 0; i < planetNames.length; i ++) {
        angles[planetNames[i]] =  getAngle(positions[planetNames[i]], c)

    }

    for ( var k = 0; k < 10; k ++) {
        for (var i = 0; i < planetNames.length; i ++) {
            for (var j = 0; j < planetNames.length; j++) {
                var dist = abs(angles[planetNames[i]]- angles[planetNames[j]])
                if(i != j && dist < 0.1) {
                    
                    var ai = angles[planetNames[i]];
                    var aj = angles[planetNames[j]];
                   
                    var delta = sign(ai - aj) * 0.01;
                
                    angles[planetNames[i]] += delta;
                    angles[planetNames[j]] -= delta;

                }
            }
        }
    }

    for (var i = 0; i < planetNames.length; i ++) {
        newPositions[planetNames[i]] = fromRadial(angles[planetNames[i]], distance, c)
    }

    return newPositions
}

        function findConjunctions(positions, thresh, c)  {
            conj = []

            // move to fixed radius
            let angles = {}
            for (var i = 0; i < planetNames.length; i ++) {
                angles[planetNames[i]] =  getAngle(positions[planetNames[i]], c)
                if ( angles[planetNames[i]] < 0 )
                    angles[planetNames[i]] += Math.PI * 2
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

        function createPorphyryHouses(asc_Point, mc_Point, dsc_Point, ic_Point, center) {
            var a0 = getAngle(asc_Point, center)
            var a1 = getAngle(mc_Point, center)
            var a2 = getAngle(dsc_Point, center)
            var a3 = getAngle(ic_Point, center)
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