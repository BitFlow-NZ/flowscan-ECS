
using API.Data;
using API.Models.Entities;
using API.Models.DTOs.Requests.Event;
using API.Models.DTOs.Responses.Event;
using API.Models.Response;
using API.Repositories;
using API.Utils;
namespace API.Services
{
    public class EventService
    {
        private EventRepository _eventRepository;

        public EventService(StoreContext storeContext)
        {
            _eventRepository = new EventRepository(storeContext);
        }

        public async Task<List<EventResponseDto>> GetAllEvents()
        {
            var events = await _eventRepository.GetAllEventsAsync();

            List<EventResponseDto> eventResponseList = events.Select(e => new EventResponseDto(e)).ToList();
            return eventResponseList;
        }

        public async Task<EventResponseDto> GetEventById(int id)
        {
            var eventEntity = await _eventRepository.GetEventByIdAsync(id);
            return new EventResponseDto(eventEntity);
        }

        public async Task<List<EventResponseDto>> GetEventsByPage(int page, int pageSize)
        {
            var events = await _eventRepository.GetEventsByPageAsync(page, pageSize);
            List<EventResponseDto> eventResponseList = events.Select(e => new EventResponseDto(e)).ToList();
            return eventResponseList;
        }

        public async Task<List<EventResponseDto>> GetEventsByPageAndTime(DateTime startTime, DateTime endTime, int page, int pageSize)
        {
            var events = await _eventRepository.GetEventsByPageAndTimeAsync(page, pageSize, startTime, endTime);
            List<EventResponseDto> eventResponseList = events.Select(e => new EventResponseDto(e)).ToList();
            return eventResponseList;
        }

        public async Task<EventListResponseDto> GetEventsByfilterDescAsync(int page, int pageSize, string filterDesc, DateTime startTime, DateTime endTime)
        {
            var events = await _eventRepository.GetEventsByfilterDescAsync(page, pageSize, filterDesc, startTime, endTime);
            int total = await _eventRepository.GetEventsTotalNumberAsync(filterDesc, startTime, endTime);
            List<EventResponseDto> eventResponseList = events.Select(e => new EventResponseDto(e)).ToList();
            return new EventListResponseDto(eventResponseList, total);
        }


        public async Task<int> CreateEvent(EventAddRequestDto eventDto)
        {
            var eventEntity = new Event
            {
                Name = eventDto.Name,
                Time = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(eventDto.Time, DateTimeKind.Utc)),
                DoctorName = eventDto.DoctorName,
                PatientName = eventDto.PatientName,
                TheaterNumber = eventDto?.TheaterNumber,
                LastEditTime = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)),
                LastEditPerson = eventDto.LastEditPerson
            };

            return await _eventRepository.AddEventAsync(eventEntity);

        }

        public async Task UpdateEvent(EventUpdateRequestDto eventDto)
        {
            var eventEntity = await _eventRepository.GetEventByIdAsync(eventDto.Id);

            eventEntity.Name = eventDto.Name;
            eventEntity.Time = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(eventDto.Time, DateTimeKind.Utc));
            eventEntity.DoctorName = eventDto.DoctorName;
            eventEntity.PatientName = eventDto.PatientName;
            eventEntity.TheaterNumber = eventDto?.TheaterNumber;
            eventEntity.LastEditTime = TimeZoneConverter.ConvertUtcToNzdt(DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc));
            eventEntity.LastEditPerson = eventDto.LastEditPerson;

            await _eventRepository.UpdateEventAsync(eventEntity);
        }

        public async Task<SuccessResponse<string>> DeleteEvent(int id)
        {
            await _eventRepository.DeleteEventAsync(id);
            return new SuccessResponse<string>($"Event {id} deleted successfully");
        }

    }
}