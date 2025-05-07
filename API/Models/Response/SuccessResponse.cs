using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Response
{
    public class SuccessResponse<T> : BaseResponse<T>
    {
        public SuccessResponse(T data, string message = "Success")
            : base(true, data, message)
        {
        }
    }
}