using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Response
{
    public interface IResponse<T>
    {
        bool Success { get; set; }
        T? Data { get; set; }
        string Message { get; set; }
    }
}