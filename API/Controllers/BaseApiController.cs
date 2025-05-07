
using API.Models.Response;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ProducesResponseType(typeof(ErrorResponse<string>), 400)]
    [ProducesResponseType(typeof(ErrorResponse<string>), 500)]
    public class BaseApiController : ControllerBase
    {

    }
}