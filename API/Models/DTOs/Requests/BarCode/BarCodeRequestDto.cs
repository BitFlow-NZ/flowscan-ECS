
using System.Text.Json.Serialization;
using API.Models.Entities;

namespace API.Models.DTOs.Requests.BarCode
{
    public class BarCodeRequestDto
    {

        public BarCodeType Type { get; set; }
        public string Content { get; set; }
    }
}