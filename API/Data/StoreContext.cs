using Microsoft.EntityFrameworkCore;
using API.Models.Entities;

namespace API.Data
{
    public class StoreContext(DbContextOptions<StoreContext> options) : DbContext(options)
    {
        public DbSet<Item> Items { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<OCRItem> OCRItems { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventItem> EventItems { get; set; }
        public DbSet<Credential> Credentials { get; set; }
        public DbSet<BarCode> BarCodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<BarCode>()
                .HasOne(i => i.Unit)
                .WithMany(i => i.BarCodes)
                .HasForeignKey(i => i.UnitId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade);


            // required relationship
            modelBuilder.Entity<Unit>()
                .HasOne(i => i.Item)
                .WithMany(i => i.Units)
                .HasForeignKey(i => i.ItemId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade)
                ;

            //required relationship
            modelBuilder.Entity<OCRItem>()
                .HasOne(i => i.Item)
                .WithMany(i => i.OCRItems)
                .HasForeignKey(i => i.ItemId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade)
                ;

            //required relationship
            modelBuilder.Entity<OCRItem>()
                .HasOne(i => i.Unit)
                .WithMany(i => i.OCRItems)
                .HasForeignKey(i => i.UnitId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull)
                ;

            // requried relationship
            modelBuilder.Entity<EventItem>()
                .HasOne(i => i.Event)
                .WithMany(i => i.EventItems)
                .HasForeignKey(i => i.EventId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Cascade)
                ;

            // optional relationship
            modelBuilder.Entity<EventItem>()
                .HasOne(i => i.Unit)
                .WithMany()
                .HasForeignKey(i => i.UnitId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // optional relationship
            modelBuilder.Entity<EventItem>()
            .HasOne(i => i.Item)
            .WithMany()
            .HasForeignKey(i => i.ItemId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict)
            ;

        }
    }
}