
using API.Data;
using API.Models.DTOs.Requests.BarCode;
using API.Models.DTOs.Responses;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class BarCodeRepository(StoreContext context)
    {
        private readonly StoreContext _context = context;

        public async Task<ItemOCRResponseDto?> SearchItemByBarCode(BarCodeRequestDto barCode)
        {
            var matchedUnitId = await _context.BarCodes.Where(i => i.Type == barCode.Type && i.Content == barCode.Content).Select(i => i.UnitId).FirstOrDefaultAsync();
            if (matchedUnitId == 0)
            {
                return null;
            }

            var matchedUnit = await _context.Units
                .Include(i => i.Item)
                    .ThenInclude(item => item.Units)
                .FirstOrDefaultAsync(i => i.Id == matchedUnitId);

            var matchedItem = matchedUnit!.Item;
            var matchedItemResponse = new ItemOCRResponseDto
            {
                Id = matchedItem.Id,
                Name = matchedItem.Name,
                Description = matchedItem.Description,
                Img = matchedItem.Img,
                LastEditTime = matchedItem.LastEditTime,
                defaultUnitId = matchedUnit.Id,
                Units = [.. matchedItem.Units.Select(u => new UnitResponseDto(u))],

            };
            return matchedItemResponse;
        }
    }
}