
using API.Exceptions;
using API.Exceptions.BadRequestException;
using API.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;



namespace API.Filter
{
    public class ForeignKeyValidationExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            switch (context.Exception)
            {
                case EventNotExistException:
                    context.Result = new BadRequestObjectResult(new ErrorResponse<string>(context.Exception.Message));
                    break;
                case ItemNotExistException:
                    context.Result = new BadRequestObjectResult(new ErrorResponse<string>(context.Exception.Message));
                    break;
                case UnitNotExistException:
                    context.Result = new BadRequestObjectResult(new ErrorResponse<string>(context.Exception.Message));
                    break;
                case EventItemNotExistException:
                    context.Result = new BadRequestObjectResult(new ErrorResponse<string>(context.Exception.Message));
                    break;
                case OCRItemNotExistException:
                    context.Result = new BadRequestObjectResult(new ErrorResponse<string>(context.Exception.Message));
                    break;



            }
        }
    }
}