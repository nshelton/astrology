

var center = [1000,1000]

function createPlot() {

    var chart = SVG().addTo("body").size( 2000, 2000)
    
    for ( var x = 0; x< 2000; x +=100) {
        for ( var y = 0; y< 2000; y +=100) {
            chart.circle(20).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(40).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(60).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(80).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(100).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(120).cx(x).cy(y).stroke('#aaa').fill("none")
            chart.circle(140).cx(x).cy(y).stroke('#aaa').fill("none")
        }
    }



}

$( document ).ready(function() {
    createPlot();


});

