function getHouseInfo(i) {
    var houses =  {
        1 : "self-image",
        2 : "posessions",
        3 : "communication",
        4 : "family",
        5 : "pleasure",
        6 : "health",
        7 : "parthership",
        8 : "death",
        9 : "philosophy",
        10 : "status",
        11 : "friendship",
        12 : "unconscious",
    }
    return houses[i]

}

function getPlanetInfo(name) {
    var planetMeaning = {
        'Sun' : "self",
        'Moon' : "emotion",
        'Mercury' : "reason",
        'Venus' : "pleasure",
        'Mars' : "action",
        'Jupiter' : "success",
        'Saturn' : "restriction",
        'Uranus' : "rebellion",
        'Neptune' : "imagination",
        'Pluto' : "power"
    }
    return planetMeaning[name]

}