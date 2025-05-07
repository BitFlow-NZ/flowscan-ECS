
using API.Data;
using API.Models.Entities;
using API.Exceptions;

using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class EventRepository
    {

        private readonly StoreContext _context;

        public EventRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }


        public async Task<Event> GetEventByIdAsync(int id)
        {
            var eventEntity = await _context.Events.FindAsync(id) ?? throw new EventNotExistException(id);
            return eventEntity;
        }

        public async Task<List<Event>> GetEventsByPageAsync(int page, int pageSize)
        {
            return await _context.Events.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<List<Event>> GetEventsByPageAndTimeAsync(int page, int pageSize, DateTime startTime, DateTime endTime)
        {
            return await _context.Events.Where(e => e.Time >= startTime && e.Time <= endTime)
                .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<List<Event>> GetEventsByfilterDescAsync(int page, int pageSize, string filterDesc, DateTime startTime, DateTime endTime)
        {
            if (filterDesc == "") return await _context.Events.Where(e => e.Time >= startTime && e.Time <= endTime)
                .OrderByDescending(e => e.Time)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return await _context.Events.Where(e =>
                    (e.Name.Contains(filterDesc) || e.DoctorName.Contains(filterDesc) || e.PatientName.Contains(filterDesc)) &&
                    e.Time >= startTime && e.Time <= endTime)
                .OrderByDescending(e => e.Time)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetEventsTotalNumberAsync(string filterDesc, DateTime startTime, DateTime endTime)
        {
            if (filterDesc == "")
                return await _context.Events.Where(e => e.Time >= startTime && e.Time <= endTime).CountAsync();
            return await _context.Events.Where(e =>
                    (e.Name.Contains(filterDesc) || e.DoctorName.Contains(filterDesc) || e.PatientName.Contains(filterDesc)) &&
                    e.Time >= startTime && e.Time <= endTime)
                .CountAsync();
        }




        public async Task<int> AddEventAsync(Event eventEntity)
        {
            await _context.Events.AddAsync(eventEntity);
            await _context.SaveChangesAsync();
            return eventEntity.Id;
        }

        public async Task DeleteEventAsync(int id)
        {
            var eventEntity = await _context.Events.FindAsync(id) ?? throw new EventNotExistException(id);

            _context.Events.Remove(eventEntity);
            await _context.SaveChangesAsync();

        }

        public async Task UpdateEventAsync(Event eventEntity)
        {
            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();

        }
    }
}