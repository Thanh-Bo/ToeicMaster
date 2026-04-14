using ToeicMaster.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using OfficeOpenXml;
using ToeicMaster.API.Services;


var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký các dịch vụ (Services)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// B. Đăng ký DB Context cho Entity Framework 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Đăng ký Swagger (Swashbuckle) để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<ToeicScoreService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IGrammarService, GrammarService>();

builder.Services.AddHttpClient<AiExplanationService>();

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
                "https://luyendetoeic.online",
                "https://www.luyendetoeic.online",
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