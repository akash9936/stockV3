const TELEGRAM_MESSAGE_LIMIT = 500;
const NoOfAllowParts = 2;

const splitMessage = (message, limit) => {
    const parts = [];
    let currentPart = '';

    message.split('\n').forEach(line => {
        if ((currentPart + line + '\n').length > limit) {
            parts.push(currentPart.trim());
            currentPart = line + '\n';
        } else {
            currentPart += line + '\n';
        }
    });

    if (currentPart) {
        parts.push(currentPart.trim());
    }

    if(parts.length>NoOfAllowParts){
        return parts;
    }

    return parts;
};

const getMessageInParts = (message) => {
    const parts = splitMessage(message, TELEGRAM_MESSAGE_LIMIT);
    return parts; // Return the parts instead of sending them directly
};

module.exports = { getMessageInParts };
