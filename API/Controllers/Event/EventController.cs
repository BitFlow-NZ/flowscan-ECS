
using API.Data;
using API.Models.DTOs.Requests.Combination;
using API.Models.DTOs.Requests.Event;
using API.Models.DTOs.Responses.Event;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    /// <summary>
    /// Controller for managing events
    /// </summary>
    /// <returns></returns>

    public class EventController(StoreContext storeContext) : BaseApiController
    {
        private readonly StoreContext _context = storeContext;
        private readonly EventService _eventService = new(storeContext);


        /// <summary>
        /// Get events by pagenation, start and end time,filter by Name, doctor name and patient name, sorted by time desc order
        /// </summary>
        /// <param name="startTime">YYYY-MM-DD</param>
        /// <param name="endTime">YYYY-MM-DD</param>
        /// <param name="search"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet()]
        [ProducesResponseType(typeof(SuccessResponse<EventListResponseDto>), 200)]
        public async Task<ActionResult<SuccessResponse<EventListResponseDto>>> GetEventsByPageAndTime(DateTime? startTime, DateTime? endTime, int page, int pageSize, string? search)
        {
            if (string.IsNullOrEmpty(search)) search = "";
            EventListResponseDto eventResponseList = await _eventService.GetEventsByfilterDescAsync(page, pageSize, search, startTime ?? DateTime.MinValue, endTime ?? DateTime.MaxValue);
            return Ok(new SuccessResponse<EventListResponseDto>(eventResponseList));
        }
        /// <summary>
        /// Get event and eventItem list by event id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SuccessResponse<EventWithItemResponseDto>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 400)]
        public async Task<ActionResult<SuccessResponse<EventWithItemResponseDto>>> GetEvent(int id)
        {

            var eventResponse = await _eventService.GetEventById(id);
            var eventItemService = new EventItemService(_context, new UnitService(_context));
            var eventItems = await eventItemService.GetEventItemsByEventId(id);
            var result = new EventWithItemResponseDto(eventResponse, eventItems);
            return Ok(new SuccessResponse<EventWithItemResponseDto>(result));

        }

        /// <summary>
        /// Create a new event (including bulk add eventItems to the event)
        /// </summary>
        /// <returns></returns>
        [HttpPost()]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 400)]
        public async Task<ActionResult<SuccessResponse<string>>> CreateEvent([FromBody] CreateEventRequestDto createEventRequest)
        {
            int eventId = await _eventService.CreateEvent(createEventRequest.Event);
            var eventItemService = new EventItemService(_context);
            await eventItemService.BulkAddEventItemIntoAnEvent(createEventRequest.EventItems, eventId);

            return Ok(new SuccessResponse<string>($"Event {eventId} created successfully"));
        }

        /// <summary>
        /// Update event (EventItemList should be the new one)
        /// </summary>
        /// <returns></returns>
        [HttpPut()]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        [ProducesResponseType(typeof(ErrorResponse<string>), 400)]

        public async Task<ActionResult<SuccessResponse<string>>> UpdateEvent([FromBody] UpdateEventRequestDto updateEventRequest)
        {

            await _eventService.UpdateEvent(updateEventRequest.Event);

            var EventId = updateEventRequest.Event.Id;

            var eventItemService = new EventItemService(_context);

            await eventItemService.BulkUpdateEventItem(updateEventRequest.EventItems, EventId);

            return Ok(new SuccessResponse<string>($"Event {EventId} updated successfully"));

        }


        /// <summary>
        /// Delete event by event id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        [ProducesResponseType(typeof(ProblemDetails), 400)]
        public async Task<ActionResult<SuccessResponse<string>>> DeleteEvent(int id)
        {
            var result = await _eventService.DeleteEvent(id);
            return Ok(result);
        }
    }


}