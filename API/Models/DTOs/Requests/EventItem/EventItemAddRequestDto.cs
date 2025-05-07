using System.ComponentModel.DataAnnotations;
using API.Models.DTOs.Base;


namespace API.DTOs

{
    public class EventItemAddRequestDto: BaseEventItemDto
    {
            public int EventId { get; set; }
           
            public int ItemId { get; set; }
          
            public int UnitId { get; set; }
    }
}