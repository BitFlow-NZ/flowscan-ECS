using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace API.Models.Entities
{
    public class Unit
    {
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }

        public required string Img { get; set; }

        [ForeignKey("ItemId")]
        public Item Item { get; set; }

        [Required]
        public required int ItemId { get; set; }

        public ICollection<OCRItem>? OCRItems { get; set; }

        public ICollection<BarCode>? BarCodes { get; set; }
    }
}