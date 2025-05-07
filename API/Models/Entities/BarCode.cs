
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;



namespace API.Models.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BarCodeType
    {
        [EnumMember(Value = "code_128")]
        code_128,

        [EnumMember(Value = "data_matrix")]
        data_matrix,

        [EnumMember(Value = "ean_13")]
        ean_13,

        [EnumMember(Value = "itf")]
        itf,

        [EnumMember(Value = "upc_a")]
        upc_a
    }
    public class BarCode
    {

        public int Id { get; set; }
        [Required]
        public required BarCodeType Type { get; set; }
        [Required]
        public required string Content { get; set; }

        [ForeignKey("UnitId")]
        public Unit Unit { get; set; }

        [Required]
        public required int UnitId { get; set; }

    }
}