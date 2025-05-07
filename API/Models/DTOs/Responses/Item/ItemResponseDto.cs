
using API.Models.DTOs.Base;

using API.Models.DTOs.Responses.OCRItem;

namespace API.Models.DTOs.Responses.Item
{
    public class ItemResponseDto : BaseItemDto
    {
        public ItemResponseDto(Entities.Item item)
        {
            Id = item.Id;
            Name = item.Name;
            Description = item.Description;
            Img = item.Img;
            LastEditTime = item.LastEditTime;
            Units = item.Units?.Select(unit => new UnitResponseDto(unit)).ToList() ?? [];
            OCRItems = item.OCRItems?.Select(ocrItem => new OCRItemResponseDto(ocrItem)).ToList() ?? [];
        }
        public new int? Id { get; set; }
        public List<UnitResponseDto> Units { get; set; }
        public List<OCRItemResponseDto> OCRItems { get; set; }

    }
}