
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class HealthCheckController : BaseApiController
    {
        /// <summary>
        /// Health check endpoint
        /// </summary>
        /// <returns></returns>
        [HttpGet("/health")]
        public ActionResult HealthCheck()
        {
            return Ok("Healthy");
        }
    }
}