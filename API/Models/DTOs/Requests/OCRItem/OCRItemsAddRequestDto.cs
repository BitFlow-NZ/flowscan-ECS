

namespace API.Models.DTOs.Requests.OCRItem
{
    /// <summary>
    /// Request DTO for adding OCR items when creating a new item
    /// </summary>
    public class AddOCRItemsRequestDto
    {
        public required string OCRKeyword { get; set; }

        public string? UnitName { get; set; }
    }
}