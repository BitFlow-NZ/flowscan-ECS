using API.Models.DTOs.Requests.Img;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Img
{

    public class ImgController : BaseApiController
    {
        private readonly ImgService _imgService;

        public ImgController(ImgService imgService)
        {
            _imgService = imgService;
        }

        /// <summary>
        /// Recognize image
        /// </summary>
        /// <param name="imgRequestDto"></param>
        /// <returns></returns>
        [HttpPost("recognize")]
        [ProducesResponseType(typeof(SuccessResponse<List<ItemOCRResponseDto>>), 200)]
        public async Task<ActionResult<SuccessResponse<List<ItemOCRResponseDto>>>> RecognizeImg([FromBody] ImgRequestDto imgRequestDto)
        {

            List<ItemOCRResponseDto> responseContent = await _imgService.RecognizeImgAsync(imgRequestDto);
            var result = new SuccessResponse<List<ItemOCRResponseDto>>(responseContent);
            return Ok(result);

        }
        /// <summary>
        /// Extract text from image
        /// </summary>
        /// <param name="imgRequestDto"></param>
        /// <returns></returns>
        [HttpPost("extract-text")]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        public async Task<ActionResult<SuccessResponse<string>>> ExtractText([FromBody] ImgRequestDto imgRequestDto)
        {
            string extractedText = await _imgService.ExtractTextAsync(imgRequestDto);
            var result = new SuccessResponse<string>(extractedText);
            return Ok(result);
        }
    }
}