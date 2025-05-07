using API.Models.DTOs.Base;
using API.Models.DTOs.Requests.OCRItem;
using API.Models.DTOs.Requests.Unit;



namespace API.Models.DTOs.Requests.Item
{
    public class AddItemRequestDto
    {
        public required string Name { get; set; }

        public required string Description { get; set; }

        public required string Img { get; set; }

        public virtual List<UnitAddRequestDto> Units { get; set; }

        public required List<AddOCRItemsRequestDto> OCRItems { get; set; }
    }


}