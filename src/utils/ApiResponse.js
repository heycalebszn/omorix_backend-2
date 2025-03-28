class ApiResponse {
  constructor(success, statusCode, message, data = null) {
    this.success = success
    this.statusCode = statusCode
    this.message = message
    this.data = data
    this.timestamp = new Date()
  }

  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(true, statusCode, message, data))
  }

  static error(res, message, statusCode = 400, errors = null) {
    return res.status(statusCode).json(new ApiResponse(false, statusCode, message, { errors }))
  }
}

export default ApiResponse
