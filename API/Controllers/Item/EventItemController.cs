using API.Data;
using API.DTOs;
using API.DTOs.Responses;
using API.Models.DTOs.Requests;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers.Item
{
    /// <summary>
    /// Controller for event items
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>

    public class EventItemController(StoreContext context) : BaseApiController
    {
        private readonly EventItemService _eventItemService = new(context, new UnitService(context));

        /// <summary>
        /// Get all event items
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(typeof(SuccessResponse<List<EventItemResponseDto>>), 200)]
        public async Task<ActionResult<IResponse<List<EventItemResponseDto>>>> GetEventItems()
        {
            var result = await _eventItemService.GetEventItems();
            return Ok(result);

        }

        /// <summary>
        /// Get event item by event item id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SuccessResponse<EventItemResponseDto>), 200)]
        public async Task<ActionResult<IResponse<EventItemResponseDto>>> GetEventItem(int id)
        {
            var result = await _eventItemService.GetEventItemById(id);
            return Ok(result);
        }

        /// <summary>
        /// Get event item list by event id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("event/{id}")]
        [ProducesResponseType(typeof(SuccessResponse<List<EventItemResponseDto>>), 200)]

        public async Task<ActionResult<IResponse<List<EventItemResponseDto>>>> GetEventItemsByEventId(int id)
        {
            var result = await _eventItemService.GetEventItemsByEventId(id);
            return Ok(new SuccessResponse<List<EventItemResponseDto>>(result));
        }

        /// <summary>
        /// Add an event item
        /// </summary>
        /// <param name="eventItemDto"></param>
        /// <returns></returns>
        [HttpPost()]
        [ProducesResponseType(typeof(SuccessResponse<EventItemResponseDto>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 400)]
        public async Task<ActionResult<IResponse<EventItemResponseDto>>> CreateEventItem([FromBody] EventItemAddRequestDto eventItemDto)
        {
            var result = await _eventItemService.AddEventItem(eventItemDto);
            return Ok(result);
        }

        /// <summary>
        /// Update an event item
        /// </summary>
        /// <param name="eventItemDto"></param>
        /// <returns></returns>
        [HttpPut()]
        [ProducesResponseType(typeof(SuccessResponse<EventItemResponseDto>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 400)]
        public async Task<ActionResult<SuccessResponse<EventItemResponseDto>>> UpdateEventItem([FromBody] EventItemUpdateRequestDto eventItemDto)
        {
            var result = await _eventItemService.UpdateEventItem(eventItemDto);
            return Ok(result);
        }



        /// <summary>
        /// Delete event item by event item id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        public async Task<ActionResult<SuccessResponse<string>>> DeleteEventItem(int id)
        {
            var result = await _eventItemService.DeleteEventItem(id);
            return Ok(result);
        }
    }
}