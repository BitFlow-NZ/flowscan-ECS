
using System.Text.Json.Serialization;
using API.Models.Entities;
using API.Models.DTOs.Base;
using API.Models.DTOs.Responses;
using API.Models.DTOs.Responses.Item;
using API.Utils;

namespace API.DTOs.Responses
{
    public class EventItemResponseDto : BaseEventItemDto
    {
        public int Id { get; set; }

        public ItemBasicInfoResponseDto Item { get; set; }


        public UnitResponseDto Unit { get; set; }


        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime EditTime { get; set; }

        public List<UnitResponseDto> Units { get; set; }

        public EventItemResponseDto(EventItem eventItem, List<UnitResponseDto> units)

        {
            Id = eventItem.Id;
            Item = new ItemBasicInfoResponseDto(eventItem.Item);
            Quantity = eventItem.Quantity;
            EditTime = eventItem.EditTime;
            Unit = new UnitResponseDto(eventItem.Unit);
            Units = units;

        }

        public EventItemResponseDto(EventItem eventItem)

        {
            Id = eventItem.Id;
            Item = new ItemBasicInfoResponseDto(eventItem.Item);
            Quantity = eventItem.Quantity;
            EditTime = eventItem.EditTime;
            Unit = new UnitResponseDto(eventItem.Unit);


        }
    }
}