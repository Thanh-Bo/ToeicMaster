using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration; // <--- 1. BẮT BUỘC PHẢI CÓ DÒNG NÀY

namespace ToeicMaster.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }

    public class EmailService : IEmailService
    {
        // Khai báo biến để lưu trữ cấu hình
        private readonly string _fromEmail;
        private readonly string _appPassword;
        private readonly string _senderName;
        private readonly string _smtpHost;
        private readonly int _smtpPort;

        // --- 2. THÊM CONSTRUCTOR NÀY ĐỂ LẤY DỮ LIỆU TỪ APPSETTINGS.JSON ---
        public EmailService(IConfiguration configuration)
        {
            // Đọc dữ liệu từ file json gán vào biến
            _fromEmail = configuration["EmailSettings:FromEmail"];
            _senderName = configuration["EmailSettings:SenderName"];
            _appPassword = configuration["EmailSettings:AppPassword"];
            _smtpHost = configuration["EmailSettings:SmtpHost"];
            _smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"]);
        }
        // -------------------------------------------------------------------

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var mailMessage = new MailMessage
            {
                // Lúc này _fromEmail đã có dữ liệu, không còn bị null nữa
                From = new MailAddress(_fromEmail, _senderName),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            
            mailMessage.To.Add(toEmail);

            using (var smtpClient = new SmtpClient(_smtpHost, _smtpPort))
            {
                smtpClient.EnableSsl = true;
                // _appPassword cũng đã có dữ liệu
                smtpClient.Credentials = new NetworkCredential(_fromEmail, _appPassword);
                
                await smtpClient.SendMailAsync(mailMessage);
            }
        }
    }
}