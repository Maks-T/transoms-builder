export const cloneObjectDeep = (obj) => {
        if (obj === null || typeof obj !== 'object') {
            console.error('Error during deep cloning:', obj);
            return;
        }

        return JSON.parse(JSON.stringify(obj));
}