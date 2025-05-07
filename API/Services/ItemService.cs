using API.Data;
using API.DTOs.Responses;
using API.Models.Entities;
using API.Models.DTOs.Requests.Item;
using API.Models.DTOs.Responses;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Models.DTOs.Responses.Item;
using API.Repositories;

namespace API.Services
{
    public class ItemService
    {
        private readonly ItemRepository _itemRepository;
        private readonly StoreContext _storeContext;

        public ItemService(StoreContext storeContext)
        {
            _itemRepository = new ItemRepository(storeContext);
            _storeContext = storeContext;
        }

        public async Task<Item> AddItemAsync(AddItemRequestDto itemRequestDto)
        {
            var item = new Item()
            {
                Name = itemRequestDto.Name,
                Description = itemRequestDto.Description,
                Img = itemRequestDto.Img,
                LastEditTime = DateTime.Now
            };
            return await _itemRepository.AddItemAsync(item);
        }

        public async Task<ItemListResponseDto> GetAllItemsAsync(int page, int pageSize, string? search)
        {
            List<Item> items = await _itemRepository.GetItemsByFilterDescAsync(page, pageSize, search);
            int total = await _itemRepository.GetItemsCountFilteredBySearchAsync(search);
            var responseItems = new List<ItemBasicInfoResponseDto>();
            foreach (var item in items)
            {
                var responseItem = new ItemBasicInfoResponseDto(item);
                responseItems.Add(responseItem);
            }

            ItemListResponseDto itemListResponseDto = new()
            {
                Items = responseItems,
                Total = total
            };

            return itemListResponseDto;
        }

        public async Task<ItemResponseDto> GetItemById(int id)
        {
            var item = await _itemRepository.GetItemByIdAsync(id);
            var ItemResponseDto = new ItemResponseDto(item);
            return ItemResponseDto;
        }

        public async Task<Item> UpdateItemAsync(UpdateItemRequestDto itemDto)
        {
            Item item = new()
            {
                Id = itemDto.Id,
                Name = itemDto.Name,
                Description = itemDto.Description,
                Img = itemDto.Img,
                LastEditTime = DateTime.Now
            };
            await _itemRepository.UpdateItemAsync(item);
            return item;
        }





        public async Task<List<ItemOCRResponseDto>> SearchItemByName(string name)
        {
            List<ItemOCRResponseDto> itemOCRResponseDtos = new();
            var items = await _itemRepository.SearchItemsByNameAsync(name);
            UnitService unitService = new(_storeContext);
            foreach (var item in items)
            {
                var itemId = item.Id;
                List<UnitResponseDto> unitResponseDtos = await unitService.GetUnitsByItemIdAsync(itemId);

                ItemOCRResponseDto itemOCRResponseDto = new()
                {
                    Id = itemId,
                    defaultUnitId = null,
                    Name = item.Name,
                    Description = item.Description,
                    Img = item.Img,
                    Units = unitResponseDtos,
                    LastEditTime = item.LastEditTime
                };

                itemOCRResponseDtos.Add(itemOCRResponseDto);
            }

            return itemOCRResponseDtos;
        }

        public async Task DeleteItemAsync(int id)
        {
            await _itemRepository.DeleteItemAsync(id);
        }
    }
}