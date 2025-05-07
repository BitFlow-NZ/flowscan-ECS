
using API.Data;
using API.Models.Entities;
using API.Models.DTOs.Requests.OCRItem;
using API.Repositories;
using API.Utils.Http;

namespace API.Services
{
    public class OCRItemService(StoreContext context, HttpRequestHelper httpRequestHelper)
    {
        private readonly StoreContext _context = context;
        private readonly OCRItemRepository _ocrItemRepository = new(context);
        private readonly UnitRepository _unitRepository = new(context);
        private readonly HttpRequestHelper _httpRequestHelper = httpRequestHelper;

        public async Task<List<OCRItem>> GetOCRItemsAsync()
        {
            return await _ocrItemRepository.GetOCRItemsAsync();
        }

        public async Task<OCRItem> GetOCRItemAsync(int id)
        {
            return await _ocrItemRepository.GetOCRItemAsync(id);
        }

        public async Task<List<OCRItem>> BulkAddOCRItemsAsync(List<AddOCRItemsRequestDto> ocrItemRequestDtos, int itemId)
        {
            List<OCRItem> ocrItems = [];
            List<Unit> units = await _unitRepository.GetUnitsByItemIdAsync(itemId);
            foreach (var ocrItemRequestDto in ocrItemRequestDtos)
            {
                int? unitId = null;
                // Unit? unit = null;
                // Item itemEntity = await _context.Items.FindAsync(itemId) ?? throw new ItemNotExistException(itemId);
                if (ocrItemRequestDto.UnitName != null)
                {
                    Unit unit = units.Find(u => u.Name == ocrItemRequestDto.UnitName)!;
                    unitId = unit.Id;
                }
                var ocrItem = new OCRItem()
                {
                    // Item = itemEntity,
                    // Unit = unit,
                    ItemId = itemId,
                    UnitId = unitId,
                    OCRKeyword = ocrItemRequestDto.OCRKeyword
                };
                await AddOCRItemAsync(ocrItem);
                ocrItems.Add(ocrItem);
            }
            await _httpRequestHelper.SendPostRequestWithRetryAsync<string>("/update-cache");
            return ocrItems;
        }


        public async Task AddOCRItemAsync(OCRItem ocrItemEntity)
        {
            await _ocrItemRepository.AddOCRItemAsync(ocrItemEntity);
        }

        public async Task DeleteOCRItemsByItemIdAsync(int id)
        {
            await _ocrItemRepository.DeleteOCRItemsByItemIdAsync(id);
            await _httpRequestHelper.SendPostRequestWithRetryAsync<string>("/update-cache");
        }

        public async Task DeleteOCRItemAsync(int id)
        {
            await _ocrItemRepository.DeleteOCRItemAsync(id);
            await _httpRequestHelper.SendPostRequestWithRetryAsync<string>("/update-cache");
        }

    }
}