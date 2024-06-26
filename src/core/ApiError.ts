export enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  ACCESS_TOKEN_EXPIRED = 'AccessTokenExpiredError',
  REFRESH_TOKEN_EXPIRED = 'RefreshTokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError'
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public type: ErrorType,
    public message: string = 'error'
  ) {
    super(type)
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(400, ErrorType.UNAUTHORIZED, message)
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(400, ErrorType.INTERNAL, message)
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, ErrorType.BAD_REQUEST, message)
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(400, ErrorType.NOT_FOUND, message)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(400, ErrorType.FORBIDDEN, message)
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(400, ErrorType.NO_ENTRY, message)
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(401, ErrorType.BAD_TOKEN, message)
  }
}

export class AccessTokenExpired extends ApiError {
  constructor(message = 'Access token expired') {
    super(401, ErrorType.ACCESS_TOKEN_EXPIRED, message)
  }
}
export class RefreshTokenExpired extends ApiError {
  constructor(message = 'Refresh token expired') {
    super(401, ErrorType.REFRESH_TOKEN_EXPIRED, message)
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(400, ErrorType.NO_DATA, message)
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(400, ErrorType.ACCESS_TOKEN, message)
  }
}
