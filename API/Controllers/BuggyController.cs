using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Controller for buggy
    /// </summary>
    public class BuggyController: BaseApiController
    {
        /// <summary>
        /// 404 -- This always happen when the resource is not found
        /// </summary>
        /// <returns></returns>
        [HttpGet("not-found")]
        public ActionResult GetNotFound() { 
            return NotFound();
        }
        /// <summary>
        /// 400 -- This always happen when the request is not valid
        /// </summary>
        /// <returns></returns>
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() { 
            return BadRequest(new ProblemDetails { 
                Title = "This is a bad request",
                Status = 400,
                Detail = "Reason why this is a bad request"
            });
        }

       /// <summary>
       /// 400 -- Validation error
       /// </summary>
       /// <returns></returns>
        [HttpGet("validation-error")]
        public ActionResult GetValidationError() { 
          ModelState.AddModelError("problem 1", "This is problem 1");
          ModelState.AddModelError("problem 2", "This is problem 2");
       
       return ValidationProblem();

        }
        /// <summary>
        /// 500 -- Internal server error
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet("server-error")]
        public ActionResult GetServerError() { 
          throw new Exception("This is some server error");
        }
    }
}