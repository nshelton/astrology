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
        1 : "Self",
        2 : "Gain",
        3 : "Order",
        4 : "Parent",
        5 : "Children",
        6 : "Health",
        7 : "Partner",
        8 : "Death",
        9 : "Purpose",
        10 : "Kingdom",
        11 : "Support",
        12 : "Unconscious",
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
        2 : "fierce",
        3 : "curious",
        4 : "nurturing",
        5 : "confident",
        6 : "healer",
        7 : "fair",
        8 : "mysterious",
        9 : "intelligent",
        10 : "driven",
        11 : "community",
        12 : "dreamy ",
    }
    return zodiac[i]
}