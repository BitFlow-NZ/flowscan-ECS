using API.Data;
using API.DTOs;
using API.Models.Entities;
using API.Models.DTOs.Requests.Unit;
using API.Models.DTOs.Responses;
using API.Repositories;

namespace API.Services
{
    public class UnitService(StoreContext storeContext)
    {
        private readonly UnitRepository _unitRepository = new UnitRepository(storeContext);

        public async Task<List<Unit>> BulkAddUnitAsync(List<UnitRequestDto> unitRequestDtos, int itemId)
        {
            List<Unit> units = [];
            foreach (var unitRequestDto in unitRequestDtos)
            {
                var unitCreated = await AddUnitAsync(unitRequestDto, itemId);
                units.Add(unitCreated);
            }
            return units;
        }

        public async Task UpdateUnitsAsync(List<UnitRequestDto> unitRequestDtoList, int itemId)
        {
            var units = await _unitRepository.GetUnitsByItemIdAsync(itemId);
            foreach (var unitRequestDto in unitRequestDtoList)
            {
                var unit = units.Find(u => u.Id == unitRequestDto.Id) ?? throw new Exception("Unit not Exist");
                // if unit exist update unit
                unit.Name = unitRequestDto.Name;
                unit.Img = unitRequestDto.Img;
                await _unitRepository.UpdateUnit(unit);
            }
            // if current unit not exist in request delete it
            foreach (var unit in units)
            {
                if (!unitRequestDtoList.Any(u => u.Id == unit.Id))
                {
                    await _unitRepository.DeleteUnit(unit.Id);
                }
            }
        }

        public async Task<Unit> AddUnitAsync(UnitRequestDto unitRequestDto, int itemId)
        {
            var unit = new Unit()
            {
                Name = unitRequestDto.Name,
                ItemId = itemId,
                Img = unitRequestDto.Img
            };

            return await _unitRepository.AddUnit(unit);
        }


        public async Task<List<UnitResponseDto>> GetUnitsByItemIdAsync(int id)
        {
            var units = await _unitRepository.GetUnitsByItemIdAsync(id);

            List<UnitResponseDto> unitDtos = [.. units.Select(u => new UnitResponseDto(u))];

            return unitDtos;

        }
    }
}