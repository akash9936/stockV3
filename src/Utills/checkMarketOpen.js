export let isInTradingHours = () => {
    let now = new Date();
    const istOptions = { timeZone: 'Asia/Kolkata' }; // 'Asia/Kolkata' is the time zone for IST

    let dayOfWeek = now.getUTCDay();
    let hours = parseInt(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, ...istOptions }));
    let minutes = parseInt(now.toLocaleString('en-US', { minute: 'numeric', ...istOptions }));

    console.log('IST Day of Week:', dayOfWeek);
    console.log('IST Hours:', hours);
    console.log('IST Minutes:', minutes);
    // Check if it's a weekday (Monday to Friday) and within trading hours
    let isAllowed = (dayOfWeek >= 1 && dayOfWeek <= 5 && hours >= 9 && hours <= 15)
    //&& (hours !== 15 || minutes <= 35));
    console.log("isAllowed is " + isAllowed);
    return isAllowed;
};