export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z]).{6,}/

export const isEmail = (value: string): boolean => EMAIL_PATTERN.test(value)
export const isPassword = (value: string): boolean => PASSWORD_PATTERN.test(value)
