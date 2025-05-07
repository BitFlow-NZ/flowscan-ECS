
using API.DTOs.Responses;

namespace API.Models.DTOs.Responses.Event
{
    public class EventWithItemResponseDto
    {
        public List<EventItemResponseDto> EventItems { get; set; }

        public EventResponseDto Event { get; set; }
        public EventWithItemResponseDto(EventResponseDto eventResponseDto, List<EventItemResponseDto> eventItems)
        {
            Event = eventResponseDto;
            EventItems = eventItems;
        }
    }
}