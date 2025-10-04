const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
    static info(message, data = null) {
        if (isDevelopment) {
            console.log(`ℹ️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }

    static success(message, data = null) {
        if (isDevelopment) {
            console.log(`✅ ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }

    static error(message, error = null) {
        console.error(`❌ ${message}`, error ? error.message || error : '');
    }

    static warn(message, data = null) {
        if (isDevelopment) {
            console.warn(`⚠️  ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }

    static debug(message, data = null) {
        if (isDevelopment && process.env.DEBUG === 'true') {
            console.log(`🔍 ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }
}

module.exports = Logger;
