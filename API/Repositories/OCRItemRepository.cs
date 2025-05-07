using API.Data;
using API.DTOs;
using API.Models.Entities;
using API.Exceptions.BadRequestException;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class OCRItemRepository(StoreContext context)
    {
        private readonly StoreContext _context = context;

        public async Task AddOCRItemAsync(OCRItem ocrItem)
        {
            await _context.OCRItems.AddAsync(ocrItem);
            await _context.SaveChangesAsync();
        }

        public async Task<OCRItem> GetOCRItemAsync(int id)
        {
            return await _context.OCRItems
                .Include(o => o.Item)
                .Include(o => o.Unit)
                .FirstOrDefaultAsync(o => o.Id == id) ?? throw new OCRItemNotExistException(id);
        }

        public async Task<List<OCRItem>> GetOCRItemsAsync()
        {
            return await _context.OCRItems.ToListAsync();
        }

        public async Task UpdateOCRItemAsync(OCRItem ocrItem)
        {
            _context.OCRItems.Update(ocrItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOCRItemAsync(int id)
        {
            var ocrItem = await _context.OCRItems.FindAsync(id) ?? throw new OCRItemNotExistException(id);
            _context.OCRItems.Remove(ocrItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOCRItemsByItemIdAsync(int id)
        {
            var ocrItems = await _context.OCRItems.Where(o => o.ItemId == id).ToListAsync();
            _context.OCRItems.RemoveRange(ocrItems);
            await _context.SaveChangesAsync();
        }
    }
}