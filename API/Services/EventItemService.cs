using API.Data;
using API.DTOs;
using API.DTOs.Responses;
using API.Models.Entities;
using API.Exceptions;
using API.Models.DTOs.Requests;
using API.Models.DTOs.Requests.EventItem;
using API.Models.Response;
using API.Repositories;
using API.Utils;



namespace API.Services
{
    public class EventItemService
    {

        private readonly EventItemRepository _eventItemRepository;

        private readonly UnitService _unitService;
        private static StoreContext _context;

        public EventItemService(StoreContext context, UnitService unitService)
        {
            _eventItemRepository = new EventItemRepository(context);
            _context = context;
            _unitService = unitService;
        }
        public EventItemService(StoreContext context)
        {
            _eventItemRepository = new EventItemRepository(context);
            _context = context;

        }

        public async Task<SuccessResponse<List<EventItemResponseDto>>> GetEventItems()
        {
            var eventItems = await _eventItemRepository.GetAllEventItemsAsync();

            var eventItemResponseList = eventItems.Select(e => new EventItemResponseDto(e)).ToList();

            return new SuccessResponse<List<EventItemResponseDto>>(eventItemResponseList);
        }
        public async Task<SuccessResponse<EventItemResponseDto>> GetEventItemById(int id)
        {
            var eventItem = await _eventItemRepository.GetEventItemByIdAsync(id);

            var eventItemResponseDto = new EventItemResponseDto(eventItem);

            return new SuccessResponse<EventItemResponseDto>(eventItemResponseDto);
        }

        public async Task<List<EventItemResponseDto>> GetEventItemsByEventId(int id)
        {
            var eventRepository = new EventRepository(_context);
            await eventRepository.GetEventByIdAsync(id);

            var eventItemsList = await _eventItemRepository.GetEventItemsByEventIdAsync(id);

            var eventItemResponseList = new List<EventItemResponseDto>();

            foreach (var eventItem in eventItemsList)
            {
                var units = await _unitService.GetUnitsByItemIdAsync(eventItem.ItemId);
                var eventItemResponse = new EventItemResponseDto(eventItem, units);
                eventItemResponseList.Add(eventItemResponse);
            }

            return eventItemResponseList;
        }

        public async Task<SuccessResponse<EventItemResponseDto>> AddEventItem(EventItemAddRequestDto eventItemDto)
        {
            var eventItemResponseDto = await AddEventItemAsync(eventItemDto);
            var result = new SuccessResponse<EventItemResponseDto>(eventItemResponseDto);

            return result;
        }

        private async Task<EventItemResponseDto> AddEventItemAsync(EventItemAddRequestDto eventItemDto)
        {
            var item = await _context.Items.FindAsync(eventItemDto.ItemId) ?? throw new ItemNotExistException(eventItemDto.ItemId);


            var unit = await _context.Units.FindAsync(eventItemDto.UnitId) ?? throw new UnitNotExistException(eventItemDto.UnitId);


            var eventEntity = await _context.Events.FindAsync(eventItemDto.EventId) ?? throw new EventNotExistException(eventItemDto.EventId);


            var eventItem = new EventItem
            {
                Item = item,
                Unit = unit,
                Event = eventEntity,
                EventId = eventItemDto.EventId,
                ItemId = eventItemDto.ItemId,
                Quantity = eventItemDto.Quantity,
                EditTime = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)),
                UnitId = eventItemDto.UnitId
            };

            await _eventItemRepository.AddEventItemAsync(eventItem);
            var eventItemResponseDto = new EventItemResponseDto(eventItem);
            return eventItemResponseDto;
        }

        private static async Task ValidateEventItem(EventItemAddRequestDto eventItemDto)

        {
            _ = await _context.Items.FindAsync(eventItemDto.ItemId) ?? throw new ItemNotExistException(eventItemDto.ItemId);

            _ = await _context.Units.FindAsync(eventItemDto.UnitId) ?? throw new UnitNotExistException(eventItemDto.UnitId);

            _ = await _context.Events.FindAsync(eventItemDto.EventId) ?? throw new EventNotExistException(eventItemDto.EventId);
        }

        private static async Task ValidateNewEventItem(EventItemAddIntoNewEventRequestDto eventItemDto)
        {
            _ = await _context.Items.FindAsync(eventItemDto.ItemId) ?? throw new ItemNotExistException(eventItemDto.ItemId);

            _ = await _context.Units.FindAsync(eventItemDto.UnitId) ?? throw new UnitNotExistException(eventItemDto.UnitId);
        }

        public async Task<SuccessResponse<List<EventItemResponseDto>>> BulkAddEventItemIntoAnEvent(List<EventItemAddIntoNewEventRequestDto> eventItemDtos, int EventId)
        {
            List<EventItemResponseDto> eventItemResponseDtos = [];

            foreach (var eventItemDto in eventItemDtos)
            {
                await ValidateNewEventItem(eventItemDto);
            }

            List<EventItemAddRequestDto> eventItemAddRequestDtos = eventItemDtos.Select(e => new EventItemAddRequestDto
            {
                EventId = EventId,
                ItemId = e.ItemId,
                Quantity = e.Quantity,
                UnitId = e.UnitId
            }).ToList();


            foreach (var eventItemAddRequestDto in eventItemAddRequestDtos)
            {
                var eventItemResponseDto = await AddEventItemAsync(eventItemAddRequestDto);
                eventItemResponseDtos.Add(eventItemResponseDto);
            }
            var result = new SuccessResponse<List<EventItemResponseDto>>(eventItemResponseDtos);
            return result;
        }

        private async Task deleteAllEventItemsByEventId(int eventId)
        {
            var eventItems = await _eventItemRepository.GetEventItemsByEventIdAsync(eventId);
            foreach (var eventItem in eventItems)
            {
                await _eventItemRepository.DeleteEventItemAsync(eventItem.Id);
            }
        }

        public async Task<SuccessResponse<List<EventItemResponseDto>>> BulkUpdateEventItem(List<EventItemAddIntoNewEventRequestDto> eventItemDtos, int EventId)
        {
            foreach (var eventItemDto in eventItemDtos)
            {
                await ValidateNewEventItem(eventItemDto);
            }

            await deleteAllEventItemsByEventId(EventId);


            var result = await BulkAddEventItemIntoAnEvent(eventItemDtos, EventId);
            return result;
        }

        public async Task<SuccessResponse<EventItemResponseDto>> UpdateEventItem(EventItemUpdateRequestDto eventItemDto)
        {
            var eventItem = await _context.EventItems.FindAsync(eventItemDto.Id) ?? throw new EventItemNotExistException(eventItemDto.Id);

            await ValidateEventItem(eventItemDto);

            eventItem.EventId = eventItemDto.EventId;
            eventItem.ItemId = eventItemDto.ItemId;
            eventItem.Quantity = eventItemDto.Quantity;
            eventItem.EditTime = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc));
            eventItem.UnitId = eventItemDto.UnitId;

            await _eventItemRepository.UpdateEventItemAsync(eventItem);
            var eventItemResponseDto = new EventItemResponseDto(eventItem);
            return new SuccessResponse<EventItemResponseDto>(eventItemResponseDto);
        }

        public async Task<SuccessResponse<string>> DeleteEventItem(int id)
        {
            await _eventItemRepository.DeleteEventItemAsync(id);
            return new SuccessResponse<string>("Event item deleted successfully");
        }
    }
}