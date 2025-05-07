
using API.Models.DTOs.Requests.EventItem;

namespace API.Models.DTOs.Requests.Event
{
    public class CreateEventRequestDto
    {
        public EventAddRequestDto Event { get; set; }
        public List<EventItemAddIntoNewEventRequestDto> EventItems { get; set; }
    }
}