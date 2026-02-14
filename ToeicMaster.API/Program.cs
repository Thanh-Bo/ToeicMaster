using ToeicMaster.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using OfficeOpenXml;
using ToeicMaster.API.Services;
using Amazon;
using Amazon.S3;
using Amazon.Runtime;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký các dịch vụ (Services)
builder.Services.AddControllers();

// B. Đăng ký DB Context cho Entity Framework 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Đăng ký Swagger (Swashbuckle) để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<ToeicScoreService>();

builder.Services.AddHttpClient<AiExplanationService>();

// Đăng ký TextToSpeechService
builder.Services.AddScoped<TextToSpeechService>();

// Đăng ký MoMoService cho payment
builder.Services.AddScoped<MoMoService>();
builder.Services.AddHttpClient<MoMoService>();

// Đăng ký AWS S3 Client
var awsAccessKey = builder.Configuration["AWS:AccessKey"];
var awsSecretKey = builder.Configuration["AWS:SecretKey"];
var awsRegion = builder.Configuration["AWS:S3:Region"];

if (!string.IsNullOrEmpty(awsAccessKey) && !string.IsNullOrEmpty(awsSecretKey))
{
    var credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
    builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client(
        credentials,
        RegionEndpoint.GetBySystemName(awsRegion ?? "ap-southeast-1")
    ));
}
else
{
    // Nếu không có credentials, dùng AWS SDK default
    builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client(
        RegionEndpoint.GetBySystemName("ap-southeast-1")
    ));
}


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



app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseHttpsRedirection();

app.UseCors("AllowNextJs");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();