const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const ACCESS_ENDPOINT = `${API_BASE_URL}/users/validate`
const LISTENING_SUBMIT_ENDPOINT = `${API_BASE_URL}/test/submit`
const ADMIN_UPLOAD_ENDPOINT = `${API_BASE_URL}/admin/upload-config`
const HR_INVITE_ENDPOINT = `${API_BASE_URL}/hr/invite`

export const requestAccess = async ({ email, code }) => {
  try {
    const response = await fetch(ACCESS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, accessCode: code }),
    })

    if (!response.ok) {
      let message = 'Unable to verify access. Please check your email and access code.'
      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const errorBody = await response.json()
          if (errorBody?.message) {
            message = errorBody.message
          }
        } else {
          const fallbackMessage = await response.text()
          if (fallbackMessage) {
            message = fallbackMessage
          }
        }
      } catch {
        // ignore parse errors and fall back to default message
      }
      throw new Error(message)
    }

    return response.json()
  } catch (error) {
    // Handle network errors (CORS, connection refused, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the server. Please check your internet connection and ensure the backend is running.'
      )
    }
    throw error
  }
}

export const submitListeningResponses = async (payload) => {
  const response = await fetch(LISTENING_SUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = 'Unable to submit listening responses. Please try again.'
    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const errorBody = await response.json()
        if (errorBody?.message) {
          message = errorBody.message
        }
      } else {
        const fallbackMessage = await response.text()
        if (fallbackMessage) {
          message = fallbackMessage
        }
      }
    } catch {
      // ignore parse errors and fall back to default message
    }
    throw new Error(message)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  } else {
    // Handle plain text response (e.g. "Responses submitted successfully")
    const text = await response.text()
    return { message: text }
  }
}

export const uploadTestConfig = async ({ typeOfTest, file }) => {
  const formData = new FormData()
  formData.append('typeOfTest', typeOfTest)
  formData.append('file', file)

  const response = await fetch(ADMIN_UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let message = 'Unable to upload file. Please try again.'
    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const errorBody = await response.json()
        if (errorBody?.message) {
          message = errorBody.message
        }
      } else {
        const fallbackMessage = await response.text()
        if (fallbackMessage) {
          message = fallbackMessage
        }
      }
    } catch {
      // ignore parse errors and fall back to default message
    }
    throw new Error(message)
  }

  return response.json()
}

export const inviteCandidate = async ({
  email,
  accessCode,
  audioFile,
  questionSetFile,
}) => {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('accessCode', accessCode)
  if (audioFile) {
    formData.append('audio', audioFile)
  }
  if (questionSetFile) {
    formData.append('questionSet', questionSetFile)
  }

  const response = await fetch(HR_INVITE_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let message = 'Unable to submit candidate details. Please try again.'
    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const errorBody = await response.json()
        if (errorBody?.message) {
          message = errorBody.message
        }
      } else {
        const fallbackMessage = await response.text()
        if (fallbackMessage) {
          message = fallbackMessage
        }
      }
    } catch {
      // ignore parse errors and fall back to default message
    }
    throw new Error(message)
  }

  return response.json()
}

