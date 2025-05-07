
using API.Models.DTOs.Base;

namespace API.Models.DTOs.Requests.EventItem
{
    public class EventItemAddIntoNewEventRequestDto : BaseEventItemDto
    {
        public int ItemId { get; set; }

        public int UnitId { get; set; }
    }
}