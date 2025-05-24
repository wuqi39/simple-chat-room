// timUtils.js
let timInstance = null;
let initialized = false;

export const setTIM = (tim) => {
    timInstance = tim;
};

export const getTIM = () => {
    return timInstance;
};

export const setInitialized = (value) => {
    initialized = value;
};

export const isInitialized = () => {
    return initialized;
};