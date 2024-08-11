const TELEGRAM_MESSAGE_LIMIT = 500;
const MAX_ALLOWED_PARTS = 2; // Maximum number of allowed parts

// Function to split a message into parts based on length and part limit
const splitMessage = (message, limit) => {
    const parts = [];
    let currentPart = '';

    // Helper function to add the current part to the parts array
    const addCurrentPart = () => {
        if (currentPart.trim().length > 0) {
            parts.push(currentPart.trim());
        }
        currentPart = '';
    };

    // Split the message by lines and build parts
    message.split('\n').forEach(line => {
        // Check if adding the current line exceeds the limit
        if ((currentPart + line + '\n').length > limit) {
            // If the number of parts is not yet at the limit, add the current part and start a new one
            if (parts.length < MAX_ALLOWED_PARTS) {
                addCurrentPart();
                currentPart = line + '\n';
            } else {
                // If the maximum number of parts is reached, discard the rest of the message
                return;
            }
        } else {
            currentPart += line + '\n';
        }
    });

    // Add the last part if it's within the limit and the maximum number of parts is not exceeded
    if (parts.length < MAX_ALLOWED_PARTS && currentPart.trim().length > 0) {
        parts.push(currentPart.trim());
    }

    return parts;
};

// Function to get message parts considering the limit
const getMessageInParts = (message) => {
    const parts = splitMessage(message, TELEGRAM_MESSAGE_LIMIT);

    // If there are no valid parts, return an empty array
    if (parts.length === 0) {
        console.warn('Message exceeds the limit and no parts were added.');
    }

    return parts;
};

module.exports = { getMessageInParts };
