
using API.Data;
using API.Models.Entities;
using API.Exceptions;

using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class EventItemRepository(StoreContext context)
    {
        private readonly StoreContext _context = context;

        public async Task AddEventItemAsync(EventItem eventItem)
        {
            await _context.EventItems.AddAsync(eventItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEventItemAsync(int id)
        {
            var eventItem = _context.EventItems.Find(id) ?? throw new EventItemNotExistException(id);

            _context.EventItems.Remove(eventItem);
            await _context.SaveChangesAsync();


        }

        public async Task<List<EventItem>> GetAllEventItemsAsync()
        {
            return await _context.EventItems
                 .Include(e => e.Event)
                 .Include(e => e.Item)
                 .Include(e => e.Unit)
                 .ToListAsync();
        }


        public async Task<EventItem> GetEventItemByIdAsync(int id)
        {
            return await _context.EventItems
                     .Include(e => e.Event)
                     .Include(e => e.Item)
                     .Include(e => e.Unit)
                     .FirstOrDefaultAsync(e => e.Id == id) ?? throw new EventItemNotExistException(id);
        }

        public Task UpdateEventItemAsync(EventItem eventItem)
        {
            _context.EventItems.Update(eventItem);
            return _context.SaveChangesAsync();
        }

        public async Task<List<EventItem>> GetEventItemsByEventIdAsync(int id)
        {
            return await _context.EventItems
                .Include(e => e.Event)
                .Include(e => e.Item)
                .Include(e => e.Unit)
                .Where(e => e.EventId == id)
                .ToListAsync();
        }
    }
}