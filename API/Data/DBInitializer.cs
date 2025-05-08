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

            // Extract only INSERT statements from the SQL script
            var insertStatements = ExtractInsertStatements(script);

            using var transaction = context.Database.BeginTransaction();
            try
            {
                foreach (var statement in insertStatements)
                {
                    if (!string.IsNullOrWhiteSpace(statement))
                    {
                        context.Database.ExecuteSqlRaw(statement);
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

        private static List<string> ExtractInsertStatements(string script)
        {
            var insertStatements = new List<string>();
            var lines = script.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            var currentStatement = new StringBuilder();
            var insideInsert = false;

            foreach (var line in lines)
            {
                var trimmedLine = line.Trim();

                // Skip comment lines and drop/create table statements
                if (trimmedLine.StartsWith("--") ||
                    trimmedLine.StartsWith("/*") ||
                    trimmedLine.StartsWith("DROP TABLE") ||
                    trimmedLine.StartsWith("CREATE TABLE") ||
                    trimmedLine.StartsWith("SET ") ||
                    trimmedLine.StartsWith("ALTER "))
                {
                    // If we were building an insert statement, terminate it
                    if (insideInsert)
                    {
                        insideInsert = false;
                        if (currentStatement.Length > 0)
                        {
                            insertStatements.Add(currentStatement.ToString());
                            currentStatement.Clear();
                        }
                    }
                    continue;
                }

                // Process INSERT statements
                if (trimmedLine.StartsWith("INSERT INTO", StringComparison.OrdinalIgnoreCase))
                {
                    insideInsert = true;
                    currentStatement.Clear();
                    currentStatement.AppendLine(trimmedLine);
                }
                else if (insideInsert)
                {
                    currentStatement.AppendLine(trimmedLine);

                    // Check if this line ends the insert statement
                    if (trimmedLine.EndsWith(";"))
                    {
                        insertStatements.Add(currentStatement.ToString());
                        currentStatement.Clear();
                        insideInsert = false;
                    }
                }
            }

            // Add any remaining statement
            if (insideInsert && currentStatement.Length > 0)
            {
                insertStatements.Add(currentStatement.ToString());
            }

            return insertStatements;
        }
    }
}