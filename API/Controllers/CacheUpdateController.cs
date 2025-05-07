
using API.Models.Response;
using API.Utils.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CacheUpdateController : BaseApiController
    {
        private readonly HttpRequestHelper _httpRequestHelper;

        public CacheUpdateController(HttpRequestHelper httpRequestHelper)
        {
            _httpRequestHelper = httpRequestHelper;
        }

        [HttpPost("update-cache")]
        public async Task<SuccessResponse<string>> UpdateCache()
        {
            var res = await _httpRequestHelper.SendPostRequestWithRetryAsync<string>("/update-cache");
            return new SuccessResponse<string>(res);
        }

        [HttpPost("clear-cache")]
        public async Task<SuccessResponse<string>> ClearCache()
        {
            var res = await _httpRequestHelper.SendPostRequestWithRetryAsync<string>("/clear-cache");
            return new SuccessResponse<string>(res);
        }
    }
}