using System.ComponentModel.DataAnnotations;
using API.Models.Entities;
using API.Models.DTOs.Base;
using API.Models.DTOs.Responses;

namespace API.DTOs
{
    /// <summary>
    /// Represents the data transfer object for the unit request in unit controller.
    /// </summary>
    public class UnitRequestDto : BaseUnitDto
    {
        public new int? Id { get; set; }
    }
}