
using System.Text.Json;
using System.Text.Json.Nodes;
using API.Data;
using API.Exceptions;
using API.Models.DTOs.Requests.Img;
using API.Models.DTOs.Responses;
using API.Models.DTOs.Responses.ImgRecognition;
using API.Utils.Http;

namespace API.Services
{
    public class ImgService
    {
        private readonly HttpRequestHelper _httpRequestHelper;
        private readonly StoreContext _storeContext;

        public ImgService(HttpRequestHelper HttpRequestHelper, StoreContext storeContext)
        {
            _storeContext = storeContext;
            _httpRequestHelper = HttpRequestHelper;
        }
        public async Task<string> ExtractTextAsync(ImgRequestDto imgRequestDto)
        {
            var apiUrl = "/extract-text";
            var res = await _httpRequestHelper.SendPostRequestWithRetryAsync(apiUrl, new { image_url = imgRequestDto.ImageUrl });
            JsonObject jsonObject = HttpRequestHelper.ProcessStringToJsonObject(res);
            string text = jsonObject["data"]!.ToString();
            return text;
        }
        public async Task<List<ItemOCRResponseDto>> RecognizeImgAsync(ImgRequestDto imgRequestDto)
        {
            var apiUrl = "/process-image";
            var res = await _httpRequestHelper.SendPostRequestWithRetryAsync(apiUrl, new { image_url = imgRequestDto.ImageUrl });
            var jsonDoc = JsonDocument.Parse(res);
            List<ItemOCRResponseDto> matchedItemList = await ProcessResponse(jsonDoc);
            return matchedItemList;
        }

        private async Task<List<ItemOCRResponseDto>> ProcessResponse(JsonDocument jsonDoc)
        {
            HandleNoMatch(jsonDoc);

            List<ItemOCRResponseDto> items = [];

            if (jsonDoc.RootElement.TryGetProperty("data", out JsonElement dataElement))
            {
                items = await HandleArray(dataElement);
            }


            return items;
        }

        private static void HandleNoMatch(JsonDocument jsonDoc)
        {
            if (jsonDoc.RootElement.TryGetProperty("success", out JsonElement successElement))
            {
                bool success = successElement.GetBoolean();
                if (!success)
                {
                    string message = jsonDoc.RootElement.GetProperty("message").GetString()!;
                    throw new NoMatchException(message);
                }
            }

        }

        private async Task<List<ItemOCRResponseDto>> HandleArray(JsonElement dataElement)
        {
            List<ItemOCRResponseDto> itemOCRResponseDtos = new();
            ItemService itemService = new(_storeContext);
            UnitService unitService = new(_storeContext);
            foreach (var item in dataElement.EnumerateArray())
            {
                int itemId = item.GetProperty("item_id").GetInt32();
                int? unitId = null;

                if (item.TryGetProperty("unit_id", out JsonElement unitIdElement) && unitIdElement.ValueKind == JsonValueKind.Number)
                {
                    unitId = unitIdElement.GetInt32();

                }

                var itemResponseDto = await itemService.GetItemById(itemId);

                List<UnitResponseDto> unitResponseDtos = await unitService.GetUnitsByItemIdAsync(itemId);

                ItemOCRResponseDto itemOCRResponseDto = new()
                {
                    Id = itemId,
                    defaultUnitId = unitId,
                    Name = itemResponseDto.Name,
                    Description = itemResponseDto.Description,
                    Img = itemResponseDto.Img,
                    Units = unitResponseDtos
                };
                itemOCRResponseDtos.Add(itemOCRResponseDto);
            }

            return itemOCRResponseDtos;
        }


    }
}