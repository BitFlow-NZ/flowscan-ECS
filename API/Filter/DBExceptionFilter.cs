using API.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace API.Filter
{
    public class DBExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is DbUpdateException dbUpdateException)
            {
                if (dbUpdateException.InnerException is MySqlException mySqlException)
                {

                    var errorResponse = new ErrorResponse<string>(null, $"A database error occurred: {mySqlException.Message}");
                    context.Result = new ObjectResult(errorResponse)
                    {
                        StatusCode = 400 // Bad Request
                    };
                    context.ExceptionHandled = true;
                }
            }
        }
    }
}