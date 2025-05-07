
using API.Data;
using API.Models.Entities;
using API.Exceptions;
using Microsoft.EntityFrameworkCore;



namespace API.Repositories
{
    public class ItemRepository
    {
        private readonly StoreContext _context;

        public ItemRepository(StoreContext context)
        {
            _context = context;
        }
        public async Task<Item> AddItemAsync(Item item)
        {
            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task DeleteItemAsync(int id)
        {
            var item = await _context.Items.FindAsync(id) ?? throw new ItemNotExistException(id);

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Item>> GetAllItemsAsync()
        {
            return await _context.Items
                .ToListAsync();
        }

        public async Task<int> GetItemsCountFilteredBySearchAsync(string? search)
        {
            if (search == null) return await _context.Items.CountAsync();
            return await _context.Items
                .Where(i => i.Name.Contains(search) || i.Description.Contains(search))
                .CountAsync();
        }

        public async Task<List<Item>> GetItemsByFilterDescAsync(int page, int pageSize, string? search)
        {
            if (search == null) return await _context.Items
                .OrderByDescending(i => i.LastEditTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return await _context.Items
                .Where(i => i.Name.Contains(search) || i.Description.Contains(search))
                .OrderByDescending(i => i.LastEditTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }


        public async Task<Item> GetItemByIdAsync(int id)
        {
            //add navigation properties, include units and ocrItems
            return await _context.Items
                .Include(i => i.Units)
                .Include(i => i.OCRItems)
                .FirstOrDefaultAsync(i => i.Id == id) ?? throw new ItemNotExistException(id);
        }

        public async Task UpdateItemAsync(Item item)
        {
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
        }



        public async Task<List<Item>> SearchItemsByNameAsync(string name)
        {
            return await _context.Items
                .Where(i => EF.Functions.Like(i.Name, $"%{name}%"))
                .Take(10)
                .ToListAsync();
        }

    }
}