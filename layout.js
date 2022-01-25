

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
        if ( radialProjection) {
            angles[planetNames[i]] =  getAngle(positions[planetNames[i]], c)
        } else {
            angles[planetNames[i]] = positions[planetNames[i]][0]
        }
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
        if ( radialProjection) {
            newPositions[planetNames[i]] = fromRadial(angles[planetNames[i]], distance, c)
        } else {
            newPositions[planetNames[i]] = [angles[planetNames[i]], 800];
        }
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
