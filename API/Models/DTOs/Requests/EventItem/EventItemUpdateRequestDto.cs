
using API.DTOs;

namespace API.Models.DTOs.Requests
{
    public class EventItemUpdateRequestDto : EventItemAddRequestDto
    {
        public int Id { get; set; }
    }
}