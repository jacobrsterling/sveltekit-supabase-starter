import { isValidEmail, validatePassword } from "$lib/utils"

export interface ValidationResult {
  valid: boolean
  error?: string
  errorFields?: string[]
}

/**
 * Validate user creation form data
 */
export function validateUserCreate(data: {
  email: string
  password: string
  fullName: string
}): ValidationResult {
  const errorFields: string[] = []
  let error: string | undefined

  if (!data.email || data.email === "") {
    error = "Email is required"
    errorFields.push("email")
  } else if (!isValidEmail(data.email)) {
    error = "A valid email address is required"
    errorFields.push("email")
  }

  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.valid) {
    error = passwordValidation.error
    errorFields.push("password")
  }

  if (!data.fullName || data.fullName === "") {
    error = "Full name is required"
    errorFields.push("fullName")
  }

  return {
    valid: errorFields.length === 0,
    error,
    errorFields: errorFields.length > 0 ? [...new Set(errorFields)] : undefined,
  }
}

/**
 * Validate user update form data
 */
export function validateUserUpdate(data: {
  email: string
  fullName: string
}): ValidationResult {
  const errorFields: string[] = []
  let error: string | undefined

  if (!data.email || data.email === "") {
    error = "Email is required"
    errorFields.push("email")
  } else if (!isValidEmail(data.email)) {
    error = "A valid email address is required"
    errorFields.push("email")
  }

  if (!data.fullName || data.fullName === "") {
    error = "Full name is required"
    errorFields.push("fullName")
  }

  return {
    valid: errorFields.length === 0,
    error,
    errorFields: errorFields.length > 0 ? [...new Set(errorFields)] : undefined,
  }
}
