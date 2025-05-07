using API.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net.Http;

namespace API.Filter
{
    public class HttpExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is HttpRequestException ex)
            {
                var statusCode = ex.StatusCode.HasValue ? (int)ex.StatusCode.Value : 500; // Default to 500 if StatusCode is null

                context.Result = new ObjectResult(new ErrorResponse<string>(ex.Message))
                {

                    StatusCode = statusCode
                };
                context.ExceptionHandled = true;
            }
        }
    }
}