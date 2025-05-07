namespace API.Models.Response
{
    public class BaseResponse<T>:IResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; }

        public BaseResponse(bool success, T? data, string message)
        {
            Success = success;
            Data = data;
            Message = message;
        }
    }
}