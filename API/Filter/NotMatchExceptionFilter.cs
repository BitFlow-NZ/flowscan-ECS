using API.Exceptions;
using API.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filter
{
    public class NotMatchExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is NoMatchException NotMatchException)
            {
                var errorResponse = new ErrorResponse<string>(NotMatchException.Message, null);
                context.Result = new ObjectResult(errorResponse)
                {
                    StatusCode = 200
                };
                context.ExceptionHandled = true;
            }
        }
    }
}