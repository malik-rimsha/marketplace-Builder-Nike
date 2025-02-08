export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-16'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  "skXmR2vqa5kktbv5kl6pDvSR63Y5p4cyiOnNVdGnD1B2ueqPWzqIkmLmdaUEpPge2SiXlTX135xj4seM946law8JxWCvK9T8MEELhmBRFOs7GYRcmwRyj3hUEoURa9RJiWcDHskie4bkAMIg75bStQnTq0zceU6oXVB3pEF1ZbZYDGwHiuyZ",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}