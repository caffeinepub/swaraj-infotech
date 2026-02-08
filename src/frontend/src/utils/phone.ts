/**
 * Validates a phone number format
 * Returns an error message if invalid, or empty string if valid
 */
export function validatePhoneNumber(phoneNumber: string): string {
    if (!phoneNumber || phoneNumber.trim() === '') {
        return 'Phone number is required';
    }

    // Remove spaces and dashes for validation
    const cleaned = phoneNumber.replace(/[\s-]/g, '');

    // Check if it contains only digits
    if (!/^\d+$/.test(cleaned)) {
        return 'Phone number must contain only digits';
    }

    // Check length (most phone numbers are between 7-15 digits)
    if (cleaned.length < 7) {
        return 'Phone number is too short';
    }

    if (cleaned.length > 15) {
        return 'Phone number is too long';
    }

    return '';
}

/**
 * Normalizes a phone number by combining country code and local number
 * Returns an E.164-like format: +[country code][local number]
 */
export function normalizePhoneNumber(countryCode: string, localNumber: string): string {
    // Remove any spaces, dashes, or parentheses from local number
    const cleaned = localNumber.replace(/[\s\-()]/g, '');
    
    // Ensure country code starts with +
    const code = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
    
    return `${code}${cleaned}`;
}
