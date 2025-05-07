
using API.Data;
using API.Models.Entities;
using API.Exceptions;
using API.Models.DTOs.Requests.Unit;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UnitRepository
    {
        private readonly StoreContext _context;

        public UnitRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<List<Unit>> GetAllUnits()
        {
            return await _context.Units.ToListAsync();
        }

        public async Task<Unit> GetUnitById(int id)
        {
            return await _context.Units.FindAsync(id) ?? throw new UnitNotExistException(id);
        }

        public async Task<Unit> AddUnit(Unit unit)
        {
            var entityEntry = await _context.Units.AddAsync(unit);
            await _context.SaveChangesAsync();
            return entityEntry.Entity;
        }

        public async Task UpdateUnit(Unit unit)
        {
            _context.Units.Update(unit);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUnit(int id)
        {
            var unit = await _context.Units.FindAsync(id) ?? throw new UnitNotExistException(id);

            _context.Units.Remove(unit);
            await _context.SaveChangesAsync();

        }



        public async Task<List<Unit>> GetUnitsByItemIdAsync(int id)
        {
            return await _context.Units.Where(u => u.ItemId == id).ToListAsync();
        }

    }
}