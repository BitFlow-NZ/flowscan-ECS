

namespace API.Models.DTOs.Responses.Event
{
    public class EventListResponseDto(List<EventResponseDto> events, int total)
    {
        public List<EventResponseDto> EventList { get; set; } = events;
        public int Total { get; set; } = total;
    }
}