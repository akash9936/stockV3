let Mapper = {
    dataMapper: (data) => {
        return {
            timestamp: data.timestamp,
            data: data.data.map(stock => ({
                priority: stock.priority,
                symbol: stock.symbol,
                identifier: stock.identifier,
                open: stock.open,
                dayHigh: stock.dayHigh,
                dayLow: stock.dayLow,
                lastPrice: stock.lastPrice,
                previousClose: stock.previousClose,
                change: stock.change,
                pChange: stock.pChange,
                ffmc: stock.ffmc,
                yearHigh: stock.yearHigh,
                yearLow: stock.yearLow,
                totalTradedVolume: stock.totalTradedVolume,
                totalTradedValue: stock.totalTradedValue,
                lastUpdateTime: stock.lastUpdateTime,
                nearWKH: stock.nearWKH,
                nearWKL: stock.nearWKL,
                perChange365d: stock.perChange365d,
                date365dAgo: stock.date365dAgo,
                chart365dPath: stock.chart365dPath,
                date30dAgo: stock.date30dAgo,
                perChange30d: stock.perChange30d,
                chart30dPath: stock.chart30dPath,
                chartTodayPath: stock.chartTodayPath
            }))
        };
    }
};

module.exports = { Mapper };
