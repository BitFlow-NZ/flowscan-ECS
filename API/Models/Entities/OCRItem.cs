using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class OCRItem
    {
        public int Id { get; set; }
        [ForeignKey("ItemId")]
        public Item Item { get; set; }
        [Required]
        public int ItemId { get; set; }
        [Required]
        public required string OCRKeyword { get; set; }
        [ForeignKey("UnitId")]
        public Unit? Unit { get; set; }

        public int? UnitId { get; set; }


    }
}