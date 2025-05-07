
using API.Models.Entities;
using API.Models.DTOs.Base; // Ensure this is the correct namespace for BaseItemDto


namespace API.Models.DTOs

{
    public class ItemRequestDto : BaseItemDto
    {
        public ItemRequestDto(Item item) : base()
        {
            Id = item.Id;
            Name = item.Name;
            Description = item.Description;
            Img = item.Img;
        }
    }
}