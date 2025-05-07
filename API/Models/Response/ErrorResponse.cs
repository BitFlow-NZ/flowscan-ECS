

namespace API.Models.Response
{
    public class ErrorResponse<T> : BaseResponse<T>
    {
        public ErrorResponse(string message = "Error", T? data = default)
            : base(false, data, message)
        {
        }
    }
}