

using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class Item
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Img { get; set; }

        [Required]
        public required DateTime LastEditTime { get; set; }

        public ICollection<OCRItem>? OCRItems { get; set; }

        public ICollection<Unit>? Units { get; set; }

    }
}