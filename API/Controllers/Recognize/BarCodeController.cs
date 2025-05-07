using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models.DTOs.Requests.BarCode;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.DTOs.Responses.Item;
using API.Models.Entities;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Recognize
{
    public class BarCodeController(BarCodeService barCodeService) : BaseApiController
    {

        private readonly BarCodeService _barCodeService = barCodeService;


        /// <summary>
        /// Recognize bar code
        /// </summary>
        /// <param name="barCode"></param>
        /// <returns></returns>
        [HttpPost("recognize")]
        [ProducesResponseType(typeof(SuccessResponse<List<ItemOCRResponseDto>>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 404)]
        public async Task<ActionResult<SuccessResponse<List<ItemOCRResponseDto>>>> RecognizeBarCode(BarCodeRequestDto barCode)
        {
            try
            {
                ItemOCRResponseDto? matchedItem = await _barCodeService.SearchItemByBarCode(barCode);
                if (matchedItem == null)
                {
                    return NotFound(
                    new ErrorResponse<string>("Item not found"));
                }
                List<ItemOCRResponseDto> responseContent = [matchedItem];
                var result = new SuccessResponse<List<ItemOCRResponseDto>>(responseContent);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new ErrorResponse<string>(e.Message));
            }



        }
    }
}