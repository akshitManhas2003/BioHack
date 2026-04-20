"""
Enhanced Error Handling Module for One Health Surveillance System
Provides standardized error responses and logging
"""

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
from enum import Enum
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ErrorSeverity(str, Enum):
    """Error severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class APIException(HTTPException):
    """Custom API exception with enhanced error information"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        severity: ErrorSeverity = ErrorSeverity.ERROR,
        details: dict = None,
        error_code: str = None
    ):
        self.message = message
        self.status_code = status_code
        self.severity = severity
        self.details = details or {}
        self.error_code = error_code or self._get_error_code(status_code)
        self.timestamp = datetime.utcnow().isoformat()
        
        super().__init__(status_code=status_code, detail=message)

    @staticmethod
    def _get_error_code(status_code: int) -> str:
        """Generate error code from HTTP status"""
        error_codes = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "VALIDATION_ERROR",
            429: "RATE_LIMITED",
            500: "INTERNAL_ERROR",
            502: "BAD_GATEWAY",
            503: "SERVICE_UNAVAILABLE",
            504: "GATEWAY_TIMEOUT"
        }
        return error_codes.get(status_code, "UNKNOWN_ERROR")

    def to_dict(self):
        """Convert exception to dictionary response"""
        return {
            "error": {
                "code": self.error_code,
                "message": self.message,
                "severity": self.severity,
                "timestamp": self.timestamp,
                "details": self.details
            }
        }


class ValidationError(APIException):
    """Validation error"""
    def __init__(self, message: str, field: str = None, details: dict = None):
        d = details or {}
        if field:
            d["field"] = field
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            severity=ErrorSeverity.ERROR,
            details=d,
            error_code="VALIDATION_ERROR"
        )


class NotFoundError(APIException):
    """Resource not found error"""
    def __init__(self, resource: str, identifier: str = None):
        details = {"resource": resource}
        if identifier:
            details["identifier"] = identifier
        super().__init__(
            message=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND,
            severity=ErrorSeverity.WARNING,
            details=details,
            error_code="NOT_FOUND"
        )


class DatabaseError(APIException):
    """Database operation error"""
    def __init__(self, message: str = "Database operation failed", operation: str = None):
        details = {}
        if operation:
            details["operation"] = operation
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            severity=ErrorSeverity.CRITICAL,
            details=details,
            error_code="DATABASE_ERROR"
        )


class DataIntegrityError(APIException):
    """Data integrity constraint violation"""
    def __init__(self, message: str = "Data integrity violation"):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            severity=ErrorSeverity.ERROR,
            error_code="DATA_INTEGRITY_ERROR"
        )


class ErrorLogger:
    """Centralized error logging"""
    
    @staticmethod
    def log_error(
        error: Exception,
        context: str = "",
        user_id: str = None,
        request_path: str = None
    ):
        """Log error with context"""
        error_info = {
            "timestamp": datetime.utcnow().isoformat(),
            "context": context,
            "error_type": type(error).__name__,
            "message": str(error),
            "user_id": user_id,
            "request_path": request_path,
            "traceback": traceback.format_exc()
        }
        
        if isinstance(error, APIException):
            logger.log(
                level=logging.WARNING if error.severity == ErrorSeverity.WARNING else logging.ERROR,
                msg=f"API Error: {error.error_code}",
                extra=error_info
            )
        else:
            logger.error(f"Unexpected error in {context}", extra=error_info)
        
        return error_info


def create_error_response(
    message: str,
    status_code: int = 500,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    details: dict = None
) -> JSONResponse:
    """Create standardized error response"""
    response = {
        "error": {
            "code": APIException._get_error_code(status_code),
            "message": message,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat(),
        }
    }
    
    if details:
        response["error"]["details"] = details
    
    return JSONResponse(
        status_code=status_code,
        content=response
    )


async def exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    if isinstance(exc, APIException):
        ErrorLogger.log_error(exc, context=f"API: {request.url.path}")
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict()
        )
    
    # Handle generic exceptions
    error_info = ErrorLogger.log_error(
        exc,
        context=f"Unhandled: {request.url.path}",
        request_path=str(request.url)
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later.",
                "severity": "critical",
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    )
