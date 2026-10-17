using Microsoft.EntityFrameworkCore;
using Npgsql;
using OnlineShop.Domain.Common;

/// <summary>
/// Turns unhandled exceptions into the ServiceResult JSON shape the frontend already reads
/// (isSuccess / error), so the admin UI can show a real message instead of "HTTP 500".
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex) when (!context.Response.HasStarted)
        {
            await WriteErrorAsync(context, ex);
        }
    }

    private async Task WriteErrorAsync(HttpContext context, Exception ex)
    {
        int status;
        object body;

        switch (ex)
        {
            case FieldLengthExceededException lengthEx:
                status = StatusCodes.Status400BadRequest;
                body = new
                {
                    isSuccess = false,
                    error = lengthEx.Message,
                    errorCode = lengthEx.Code,
                    fieldErrors = lengthEx.Violations,
                };
                break;

            // Fallback for columns whose limit is not in the EF model (string_data_right_truncation).
            case DbUpdateException { InnerException: PostgresException { SqlState: PostgresErrorCodes.StringDataRightTruncation } }:
                status = StatusCodes.Status400BadRequest;
                body = new
                {
                    isSuccess = false,
                    error = "A field is longer than allowed.",
                    errorCode = "FIELD_TOO_LONG",
                };
                break;

            default:
                _logger.LogError(ex, "Unhandled exception for {Method} {Path}",
                    context.Request.Method, context.Request.Path);
                status = StatusCodes.Status500InternalServerError;
                body = new
                {
                    isSuccess = false,
                    error = "Internal server error",
                    errorCode = "INTERNAL_ERROR",
                };
                break;
        }

        context.Response.Clear();
        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(body);
    }
}
