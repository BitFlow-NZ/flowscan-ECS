
using API.Models.DTOs.Base;


namespace API.Models.DTOs.Responses.Item
{
    public class ItemBasicInfoResponseDto : BaseItemDto
    {
        public ItemBasicInfoResponseDto(Entities.Item item)
        {
            Id = item.Id;
            Name = item.Name;
            Description = item.Description;
            Img = item.Img;
            LastEditTime = item.LastEditTime;

        }
    }

}