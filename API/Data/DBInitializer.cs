
using API.Models.Entities;
using Microsoft.EntityFrameworkCore; // Add this line if Item class is in the Models namespace

namespace API.Data
{
    public class DBInitializer
    {
        public static void Initialize(StoreContext context)
        {
            if (context.Items.Any() || context.Units.Any() || context.OCRItems.Any() || context.Events.Any() || context.EventItems.Any() || context.BarCodes.Any() || context.Credentials.Any())
            {
                // Database has been seeded already
                return;
            }


            try
            {
                ExecuteSqlScript(context);

                // Check if data was successfully loaded from script
                if (context.Items.Any())
                {
                    Console.WriteLine("Database initialized from SQL script.");
                    return;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing SQL script: {ex.Message}");
                // Continue to fallback seeding method
            }
        }

        private static void ExecuteSqlScript(StoreContext context)
        {
            string sqlFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "init.sql");

            // For development, you might need to adjust the path
            if (!File.Exists(sqlFilePath))
            {
                sqlFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "init.sql");
            }

            if (!File.Exists(sqlFilePath))
            {
                throw new FileNotFoundException("Could not find init.sql file");
            }

            string script = File.ReadAllText(sqlFilePath);

            // Split script by GO statements if your SQL server requires it
            var commands = script.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);

            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var command in commands)
                    {
                        if (!string.IsNullOrWhiteSpace(command))
                        {
                            context.Database.ExecuteSqlRaw(command);
                        }
                    }

                    transaction.Commit();
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}