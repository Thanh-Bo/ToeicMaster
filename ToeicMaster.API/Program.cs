using ToeicMaster.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using OfficeOpenXml;
using ToeicMaster.API.Services;


var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction() &&
    (string.IsNullOrWhiteSpace(builder.Configuration["PAYOS_CLIENT_ID"]) ||
     string.IsNullOrWhiteSpace(builder.Configuration["PAYOS_API_KEY"]) ||
     string.IsNullOrWhiteSpace(builder.Configuration["PAYOS_CHECKSUM_KEY"])))
{
    throw new InvalidOperationException("PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY are required in production.");
}

// 1. Đăng ký các dịch vụ (Services)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        // Tránh lỗi circular reference khi Include navigation properties (vd: QuestionGrammar ↔ Answers)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// B. Đăng ký DB Context cho Entity Framework 
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.CommandTimeout(120) // Tăng timeout lên 120 giây
    );
});


// Đăng ký Swagger (Swashbuckle) để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddMemoryCache();

// Redis distributed cache for high-performance caching of static educational data.
// Falls back to an in-process cache when no Redis connection string is configured (local dev without Redis).
var redisConnectionString = builder.Configuration["Redis:ConnectionString"];
if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnectionString;
        options.InstanceName = "ToeicMaster_";
    });
}
else
{
    builder.Services.AddDistributedMemoryCache();
}

builder.Services.AddScoped<ToeicScoreService>();
builder.Services.AddHttpClient<IPaymentService, PaymentService>();
builder.Services.AddScoped<IPremiumService, PremiumService>();
builder.Services.AddSingleton<ISubscriptionPlanService, SubscriptionPlanService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IGrammarService, GrammarService>();

builder.Services.AddHttpClient<AiExplanationService>();
builder.Services.AddHttpClient<GrammarAiExplanationService>();

// Azure Blood Storage
builder.Services.AddScoped<BlobService>();



// Đăng ký DapperContext (Kết nối SQL)
builder.Services.AddSingleton<DapperContext>();

// 1. Đăng ký dịch vụ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "https://toeicmasters.com",
                "https://www.toeicmasters.com",
                "https://toeic-master-sigma.vercel.app"  // Vercel default domain
            )
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Cho phép gửi Cookies
        });
});

// 1. Cấu hình Authentication JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ClockSkew = TimeSpan.Zero // Chặn việc token hết hạn vẫn dùng được thêm 5 phút
    };
});




ExcelPackage.LicenseContext = LicenseContext.NonCommercial;


var app = builder.Build();
// thanks

// Add exception handling middleware
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new
        {
            error = ex.Message,
            stackTrace = ex.StackTrace,
            innerException = ex.InnerException?.Message
        });
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseCors("AllowNextJs");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
