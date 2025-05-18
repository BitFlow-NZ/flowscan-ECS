namespace API.Models.DTOs.Responses.ImgRecognition
{
    public class ItemOCRResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }

        public DateTime LastEditTime { get; set; }
        public int? defaultUnitId { get; set; }
        public List<UnitResponseDto> Units { get; set; }

        public int? Confidence { get; set; } = 100;
    }
}