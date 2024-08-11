// fetchDataTest.js

let fetchDataTest = async () => {
    // Mock data for testing purposes
    return {
        timestamp: new Date().toISOString(),
        data: [
            {
                priority: 1,
                symbol: 'AAPL',
                identifier: 'AAPL',
                open: 150.0,
                dayHigh: 155.0,
                dayLow: 148.0,
                lastPrice: 152.0,
                previousClose: 150.0,
                change: 2.0,
                pChange: 1.33,
                ffmc: 1000,
                yearHigh: 180.0,
                yearLow: 130.0,
                totalTradedVolume: 50000,
                totalTradedValue: 7600000,
                lastUpdateTime: new Date().toISOString(),
                nearWKH: 5.0,
                nearWKL: -2.0,
                perChange365d: 15.0,
                date365dAgo: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
                chart365dPath: '/path/to/chart365d',
                date30dAgo: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
                perChange30d: 3.0,
                chart30dPath: '/path/to/chart30d',
                chartTodayPath: '/path/to/chartToday'
            }
        ]
    };
};

module.exports = fetchDataTest;
