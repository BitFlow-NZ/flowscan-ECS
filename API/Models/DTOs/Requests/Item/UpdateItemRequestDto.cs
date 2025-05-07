

using API.DTOs;

namespace API.Models.DTOs.Requests.Item
{
    public class UpdateItemRequestDto : AddItemRequestDto
    {
        public int Id { get; set; }
        public new required List<UnitRequestDto> Units { get; set; }
    }
}