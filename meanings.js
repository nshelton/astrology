function getHouseInfo(i) {
    var houses =  {
        1 : "self",
        2 : "posessions",
        3 : "sharing",
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

function getHouseInfo2(i) {
    var houses =  {
        1 : "self",
        2 : "gain",
        3 : "order",
        4 : "parent",
        5 : "children",
        6 : "health",
        7 : "partner",
        8 : "death",
        9 : "purpose",
        10 : "kingdom",
        11 : "support",
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


function getZodiacInfo(i) {
    var zodiac =  {
        1 : "brave",
        2 : "drive",
        3 : "communication",
        4 : "nurturing",
        5 : "brave",
        6 : "helper",
        7 : "fair",
        8 : "passion",
        9 : "ambition",
        10 : "drive",
        11 : "eccentric",
        12 : "intuitive",
    }
    return zodiac[i]
}