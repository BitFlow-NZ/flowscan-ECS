using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class EventItem
    {
        public int Id { get; set; }
        [Required]
        public int EventId { get; set; }

        [ForeignKey("EventId")]
        public required Event Event { get; set; }

        public int ItemId { get; set; }
        [ForeignKey("ItemId")]
        public Item? Item { get; set; }

        [Required]
        public required int Quantity { get; set; }


        public Unit? Unit { get; set; }
        [Required]
        public int UnitId { get; set; }



        [Required]
        public required DateTime EditTime { get; set; }

    }
}