

namespace API.Models.DTOs.Base
{
    public class BaseItemDto
    {
        public int Id { get; set; }


        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime LastEditTime { get; set; }


        public string Img { get; set; }
    }
}