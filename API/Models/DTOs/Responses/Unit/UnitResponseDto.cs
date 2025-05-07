
using API.Models.Entities;


namespace API.Models.DTOs.Responses
{
    public class UnitResponseDto : BaseUnitDto
    {
        public UnitResponseDto(Unit unit)
        {
            Id = unit.Id;
            Name = unit.Name;
            Img = unit.Img;
            ItemId = unit.ItemId;
        }
        public int ItemId { get; set; }
    }
}