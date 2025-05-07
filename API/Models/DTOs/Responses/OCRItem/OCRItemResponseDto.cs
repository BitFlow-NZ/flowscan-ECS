
using API.Models.Entities;


namespace API.Models.DTOs.Responses.OCRItem

{
    public class OCRItemResponseDto(Entities.OCRItem ocrItem)
    {
        public int Id { get; set; } = ocrItem.Id;
        public string OCRKeyword { get; set; } = ocrItem.OCRKeyword;

        public int ItemId { get; set; } = ocrItem.ItemId;

        public int? UnitId { get; set; } = ocrItem.UnitId;
    }
}