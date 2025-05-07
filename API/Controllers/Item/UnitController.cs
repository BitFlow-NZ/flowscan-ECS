using System.ComponentModel;
using API.Data;
using API.DTOs;
using API.DTOs.Responses;
using API.Models.DTOs.Responses;
using API.Models.Response;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers.Unit
{

    public partial class UnitController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly UnitService _unitService;
        public UnitController(StoreContext context)
        {
            _context = context;
            _unitService = new UnitService(context);

        }

        [HttpGet]
        public async Task<ActionResult<List<Models.Entities.Unit>>> GetUnits()
        {
            return await _context.Units
            .Include(u => u.Item)
            .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Entities.Unit>> GetUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return NotFound();
            return unit;

        }


        [HttpGet("item/{id}")]
        [Description("Get all units by item id")]
        [ProducesResponseType(typeof(SuccessResponse<List<UnitResponseDto>>), 200)]
        public async Task<ActionResult<SuccessResponse<List<UnitResponseDto>>>> GetUnitsByItemId(int id)
        {
            var unitDtos = await _unitService.GetUnitsByItemIdAsync(id);
            var result = new SuccessResponse<List<UnitResponseDto>>(unitDtos);
            return result;
        }

        // [HttpPost]
        // public async Task<ActionResult<Entities.Unit>> CreateUnit([FromBody] UnitRequestDto unitDto)
        // {
        //     if (unitDto == null) return BadRequest("Unit data is null");

        //     var item = await _context.Items.FindAsync(unitDto.Id);
        //     if (item == null) return NotFound(new ProblemDetails
        //     {
        //         Title = "Item not found",
        //         Status = 404
        //     });

        //     var unit = new Entities.Unit
        //     {
        //         Name = unitDto.Name,
        //         ItemId = unitDto.Id,
        //         Img = unitDto.Img,
        //         Item = item
        //     };


        //     _context.Units.Add(unit);
        //     await _context.SaveChangesAsync();
        //     return unit;
        // }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit == null) return NotFound();
            _context.Remove(unit);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}