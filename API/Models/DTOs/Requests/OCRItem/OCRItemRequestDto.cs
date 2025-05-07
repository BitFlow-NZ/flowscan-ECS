using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class OCRItemRequestDto
    {
        [Required]
        public required int ItemId { get; set; }

        public int? UnitId { get; set; }
        [Required]
        public required string OCRKeyword { get; set; }
    }
}