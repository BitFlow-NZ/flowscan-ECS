using System.Reflection;
using System.Text.Json.Serialization;
using API.Data;
using API.Filter;
using API.Middleware;
using API.Repositories;
using API.Services;
using API.Utils.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddScoped<ImgService>();
builder.Services.AddScoped<HttpRequestHelper>();
builder.Services.AddScoped<OCRItemService>();
builder.Services.AddScoped<BarCodeRepository>();
builder.Services.AddScoped<BarCodeService>();

// Add services to the container.
builder.Services.AddControllers(options =>
{
    // Add the exception filter globally
    options.Filters.Add<ForeignKeyValidationExceptionFilterAttribute>();
    options.Filters.Add<DBExceptionFilterAttribute>();
    options.Filters.Add<HttpExceptionFilter>();
    options.Filters.Add<NotMatchExceptionFilter>();
}).AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

// Configure MySQL connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<StoreContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Bitflow API 🔮",
        Description = "An ASP.NET Core Web API for Bitflow application. "
    });



    // Require token
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
}
);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder
           .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5001);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bitflow API v1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});
// }

app.UseCors("AllowAllOrigins");
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseHttpsRedirection();

app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    //create database if not exists
    context.Database.Migrate();
    logger.LogInformation("Database schema updated successfully.");
    // Seed the database
    DBInitializer.Initialize(context);
    logger.LogInformation("Database seeded successfully.");
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during database initialization.");
}

app.Run();
