using API.Data;
using API.DTOs;
using API.DTOs.Responses;
using API.Models.DTOs.Requests.Item;
using API.Models.DTOs.Requests.OCRItem;
using API.Models.DTOs.Requests.Unit;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.DTOs.Responses.Item;
using API.Models.Response;
using API.Services;
using API.Utils.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;


namespace API.Controllers.Item
{

    public class ItemController(StoreContext context, HttpRequestHelper httpRequestHelper) : BaseApiController
    {
        private readonly StoreContext _context = context;
        private readonly ItemService _itemService = new(context);
        private readonly UnitService _unitService = new(context);
        private readonly OCRItemService _ocrItemService = new(context, httpRequestHelper);

        /// <summary>
        /// Get items by page and filter by name or desc, including its units array and OCRItems array
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(typeof(SuccessResponse<ItemListResponseDto>), 200)]
        public async Task<ActionResult<SuccessResponse<ItemListResponseDto>>> GetItems(int page, int pageSize, string? search)
        {
            ItemListResponseDto ItemListResponseDto = await _itemService.GetAllItemsAsync(page, pageSize, search);
            var result = new SuccessResponse<ItemListResponseDto>(ItemListResponseDto);
            return Ok(result);
        }

        /// <summary>
        /// Search items by name, used when creating event
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        [HttpGet("search")]
        [ProducesResponseType(typeof(SuccessResponse<List<ItemOCRResponseDto>>), 200)]
        public async Task<ActionResult<SuccessResponse<List<ItemOCRResponseDto>>>> SearchItems([FromQuery] string name)
        {
            var itemList = await _itemService.SearchItemByName(name);
            var result = new SuccessResponse<List<ItemOCRResponseDto>>(itemList);
            return Ok(result);
        }

        /// <summary>
        /// Get item by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ItemResponseDto), 200)]
        public async Task<ActionResult<SuccessResponse<ItemResponseDto>>> GetItem(int id)
        {
            var ItemResponseDto = await _itemService.GetItemById(id);
            return Ok(new SuccessResponse<ItemResponseDto>(ItemResponseDto));
        }

        /// <summary>
        /// Create item, including units and OCRItems
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        [HttpPost]
        [ProducesResponseType(typeof(SuccessResponse<ItemResponseDto>), 200)]
        public async Task<ActionResult<ItemResponseDto>> CreateItem(AddItemRequestDto item)
        {
            List<UnitRequestDto> units = [];
            foreach (var unit in item.Units)
            {
                UnitRequestDto unitRequestDto = new()
                {
                    Name = unit.Name,
                    Img = unit.Img,
                    Id = null
                };
                units.Add(unitRequestDto);
            }
            if (!CheckIfUnitNameIncludedInUnit(item.OCRItems, units))
            {
                return BadRequest(new ErrorResponse<string>("unitName in OCRItems is not included in Units"));
            }

            var itemEntity = await _itemService.AddItemAsync(item);
            int itemId = itemEntity.Id;
            await _unitService.BulkAddUnitAsync(units, itemId);
            await _ocrItemService.BulkAddOCRItemsAsync(item.OCRItems, itemId);

            return Ok(new SuccessResponse<ItemResponseDto>(new ItemResponseDto(itemEntity)));
        }

        /// <summary>
        /// Update item, including units and OCRItems
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        [HttpPut]
        [ProducesResponseType(typeof(SuccessResponse<ItemResponseDto>), 200)]
        public async Task<ActionResult<ItemResponseDto>> UpdateItem(UpdateItemRequestDto item)
        {
            if (!CheckIfUnitNameIncludedInUnit(item.OCRItems, item.Units))
            {
                return BadRequest(new ErrorResponse<string>("unitName in OCRItems is not included in Units"));
            }
            if (CheckIfUnitNameIsDuplicate(item.Units))
            {
                return BadRequest(new ErrorResponse<string>("unitName in Units is duplicate"));
            }
            using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // update item
                var itemEntity = await _itemService.UpdateItemAsync(item);
                // delete all OCRItems of the item
                await _ocrItemService.DeleteOCRItemsByItemIdAsync(item.Id);
                var unitsList = item.Units.ToList();
                //filter out unit that id is not null(existing units)
                List<UnitRequestDto> ExistingUnits = unitsList.Where(u => u.Id != null).ToList();
                await _unitService.UpdateUnitsAsync(ExistingUnits, item.Id);
                //filter out unit that id is null(new units)
                List<UnitRequestDto> NewUnits = unitsList.Where(u => u.Id == null).ToList();
                await _unitService.BulkAddUnitAsync(NewUnits, item.Id);
                // add new OCRItems
                await _ocrItemService.BulkAddOCRItemsAsync(item.OCRItems, item.Id);

                await transaction.CommitAsync();

                return Ok(new SuccessResponse<ItemResponseDto>(new ItemResponseDto(itemEntity)));
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }

        }


        private static bool CheckIfUnitNameIncludedInUnit(List<AddOCRItemsRequestDto> ocrItems, List<UnitRequestDto> units)
        {
            // check if every unitName in OCRItems is included in units.name
            foreach (var ocrItem in ocrItems)
            {
                if (ocrItem.UnitName == null) continue;

                if (!units.Any(u => u.Name == ocrItem.UnitName))
                {
                    return false;
                }
            }
            return true;
        }

        private static bool CheckIfUnitNameIsDuplicate(List<UnitRequestDto> units)
        {

            return units.GroupBy(u => u.Name.ToLower()).Any(g => g.Count() > 1);

        }

        /// <summary>
        /// Delete item, the according units and OCRItems will be deleted as well
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(SuccessResponse<string>), 200)]
        public async Task<ActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return NotFound();
            _context.Remove(item);
            await _context.SaveChangesAsync();
            return Ok(new SuccessResponse<string>("Item deleted successfully"));
        }
    }
}