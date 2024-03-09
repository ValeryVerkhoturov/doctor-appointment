export function sanitize<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(item => sanitize(item)) as unknown as T;
    } else if (value && typeof value === 'object' && !(value instanceof Date)) {
        const sanitizedObject: any = {};
        Object.keys(value).forEach(key => {
            if (!(key.startsWith('__') && key.endsWith('__'))) {
                sanitizedObject[key] = sanitize((value as any)[key]);
            }
        });
        return sanitizedObject;
    } else {
        return value;
    }
}