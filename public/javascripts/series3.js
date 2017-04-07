var series3_battery_data = [];
var series3_inverter_data = [];
var series3_chamber_data = [];
var series3_outside_data = [];

// Battery voltage chart options
var series3_chart_battery = new CanvasJS.Chart("graph-battery", {
    title: { text: "Battery voltage" },
    data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} V",
        dataPoints: series3_battery_data
    }],
    axisX: {
        title: 'Time',
        valueFormatString: " ",
        interval: 3600,
    },
    axisY: {
        title: 'Voltage',
        minimum: 0,
        maximum: 60,
        interval: 10,
        stripLines: [{
            startValue: 48,
            endValue: 58,
            color: "#C5E3BF"
        }]
    }
});

// Inverter voltage chart options
var series3_chart_inverter = new CanvasJS.Chart("graph-inverter", {
    title: { text: "Inverter voltage" },
    data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} V",
        dataPoints: series3_inverter_data
    }],
    axisX: {
        title: 'Time',
        valueFormatString: " ",
        interval: 3600,
    },
    axisY: {
        title: 'Voltage',
        minimum: 0,
        maximum: 300,
        interval: 50,
        stripLines: [{
            startValue: 220,
            endValue: 250,
            color: "#C5E3BF"
        }]
    }
});

// Temperature chart options
var series3_chart_temp = new CanvasJS.Chart("graph-temp", {
    title: { text: "Temperature °C" },
    legend: {
        horizontalAlign: "right", // "center" , "right"
        verticalAlign: "top",  // "top" , "bottom"
        fontSize: 15
    },
    data: [{
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series3_chamber_data,
        showInLegend: true,
        legendText: "Chamber",
    }, {
        type: "line",
        markerType: 'none',
        toolTipContent: "{y} °C",
        dataPoints: series3_outside_data,
        showInLegend: true,
        legendText: "Outside",
    }],
    axisX: {
        title: 'Time',
        valueFormatString: " ",
        interval: 3600,
    },
    axisY: {
        title: 'Temperature °C',
        minimum: 0,
        maximum: 60,
        interval: 10,
        stripLines: [{
            startValue: 10,
            endValue: 40,
            color: "#C5E3BF"
        }]
    }
});


$.get('/api/monitor/history').then(function (data) {
    var last = (Date.now() / 1000 | 0) - 86400;
    if ('series3' in data) {
        while (data.series3[0].Time > last) {
            series3_battery_data.push({ x: last, y: 0 });
            series3_inverter_data.push({ x: last, y: 0 });
            series3_chamber_data.push({ x: last, y: 0 });
            series3_outside_data.push({ x: last, y: 0 });
            last += 10;
        }
        for (var i = 0; i < data.series3.length; i++) {
            series3_battery_data.push({ x: data.series3[i].Time, y: +(data.series3[i].raw[10].row_info) });
            series3_inverter_data.push({ x: data.series3[i].Time, y: +(data.series3[i].raw[6].row_info) });
            series3_chamber_data.push({ x: data.series3[i].Time, y: +(data.series3[i].raw[0].row_info) });
            series3_outside_data.push({ x: data.series3[i].Time, y: +(data.series3[i].raw[2].row_info) });
        }
    }
    else {
        for (var i = 0; i < dataLength; i++) {
            series3_battery_data.push({ x: last, y: 0 });
            series3_inverter_data.push({ x: last, y: 0 });
            series3_chamber_data.push({ x: last, y: 0 });
            series3_outside_data.push({ x: last, y: 0 });
            last += 10;
        }
    }

    series3_chart_battery.render();
    series3_chart_inverter.render();
    series3_chart_temp.render();
});


function updateSeries3(data) {
    // Updates each element in each table with data from the api
    $('.row-mode').text(data.mode);

    $('#table-system-info').find('.row-info').each(function (index, element) {
        $(element).text(data.raw[index].row_info + ' ' + data.raw[index].row_unit);
    });

    // Get data from api relevent for the charts,
    // updates the chart data, and renders the new data
    series3_battery_data.push({ x: Date.now() / 1000 | 0, y: +(data.raw[10].row_info) });
    series3_inverter_data.push({ x: Date.now() / 1000 | 0, y: +(data.raw[6].row_info) });
    series3_chamber_data.push({ x: Date.now() / 1000 | 0, y: +(data.raw[0].row_info) });
    series3_outside_data.push({ x: Date.now() / 1000 | 0, y: +(data.raw[2].row_info) });

    if (series3_battery_data.length > dataLength) { series3_battery_data.shift(); }
    if (series3_inverter_data.length > dataLength) { series3_inverter_data.shift(); }
    if (series3_chamber_data.length > dataLength) { series3_chamber_data.shift(); }
    if (series3_outside_data.length > dataLength) { series3_outside_data.shift(); }

    series3_chart_battery.render();
    series3_chart_inverter.render();
    series3_chart_temp.render();
}