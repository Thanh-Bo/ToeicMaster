using ToeicMaster.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using OfficeOpenXml;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký các dịch vụ (Services)
builder.Services.AddControllers();

// B. Đăng ký DB Context cho Entity Framework 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Đăng ký Swagger (Swashbuckle) để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();


builder.Services.AddHttpClient<AiExplanationService>();


// Đăng ký DapperContext (Kết nối SQL)
builder.Services.AddSingleton<DapperContext>();

// 1. Đăng ký dịch vụ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Cho phép Next.js truy cập
                  .AllowAnyHeader()
                  .AllowAnyMethod();
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

// 2. Cấu hình Pipeline (Cách xử lý request)
// Luôn bật Swagger (ngay cả khi không phải Development để bạn dễ test lúc này)
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowNextJs");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();