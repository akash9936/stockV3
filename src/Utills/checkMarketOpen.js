const isInTradingHours = () => {
    let now = new Date();
    const istOptions = { timeZone: 'Asia/Kolkata' }; // 'Asia/Kolkata' is the time zone for IST

    let dayOfWeek = now.getUTCDay();
    let hours = parseInt(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, ...istOptions }));
    let minutes = parseInt(now.toLocaleString('en-US', { minute: 'numeric', ...istOptions }));

    console.log('IST Day of Week:', dayOfWeek);
    console.log('IST Hours:', hours);
    console.log('IST Minutes:', minutes);

    let isAllowed = true;

    // Check if it's a weekday (Monday to Friday)
    if (dayOfWeek < 1 || dayOfWeek > 5) {
        console.log('Market is closed because today is not a weekday.');
        isAllowed = false;
    }
    // Check if hours are within trading hours
    else if (hours < 9 || hours > 15) {
        console.log('Market is closed because it is outside of trading hours.');
        isAllowed = false;
    }
    // Check if it's the last hour and minutes exceed 35
    else if (hours === 15 && minutes > 35) {
        console.log('Market is closed because it is past 3:35 PM.');
        isAllowed = false;
    }

    console.log("isAllowed is " + isAllowed);
    return isAllowed;
};

module.exports = { isInTradingHours };
