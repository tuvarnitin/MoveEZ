export const validate = (fields) => {
    const errors = {}
    for (const field in fields){
        if (!fields[field]) {
            errors[field] = `${field} is required`
        }
    }
    return Object.entries(errors)
} 