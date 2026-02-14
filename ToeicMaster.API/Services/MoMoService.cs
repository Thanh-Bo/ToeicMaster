using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ToeicMaster.API.Services
{
    public class MoMoService
    {
        private readonly string _partnerCode;
        private readonly string _accessKey;
        private readonly string _secretKey;
        private readonly string _endpoint;
        private readonly HttpClient _httpClient;
        private readonly ILogger<MoMoService> _logger;

        public MoMoService(IConfiguration config, HttpClient httpClient, ILogger<MoMoService> logger)
        {
            var momoConfig = config.GetSection("MoMo");
            _partnerCode = momoConfig["PartnerCode"];
            _accessKey = momoConfig["AccessKey"];
            _secretKey = momoConfig["SecretKey"];
            _endpoint = momoConfig["Endpoint"];
            _httpClient = httpClient;
            _logger = logger;
        }

        /// <summary>
        /// Tạo payment request cho MoMo
        /// </summary>
        public async Task<MoMoCreatePaymentResponse> CreatePaymentAsync(
            long orderId,
            long amount,
            string orderInfo,
            string returnUrl,
            string notifyUrl)
        {
            try
            {
                var requestId = Guid.NewGuid().ToString();
                var requestType = "captureWallet";
                var extraData = "";
                var autoCapture = true;
                var lang = "vi";

                // Tạo signature
                var signatureRawData = $"accessKey={_accessKey}&amount={amount}&extraData={extraData}&" +
                    $"ipnUrl={notifyUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_partnerCode}&" +
                    $"redirectUrl={returnUrl}&requestId={requestId}&requestType={requestType}";

                var signature = GenerateSignature(signatureRawData, _secretKey);
                
                _logger.LogInformation($"MoMo Request Debug:");
                _logger.LogInformation($"  SignatureRawData: {signatureRawData}");
                _logger.LogInformation($"  Signature: {signature}");

                var request = new
                {
                    partnerCode = _partnerCode,
                    partnerName = "ToeicMaster",
                    storeId = "MoMoStore",
                    storeId2 = "",
                    requestId = requestId,
                    amount = amount,
                    orderId = orderId,
                    orderInfo = orderInfo,
                    redirectUrl = returnUrl,
                    ipnUrl = notifyUrl,
                    lang = lang,
                    autoCapture = autoCapture,
                    extraData = extraData,
                    requestType = requestType,
                    signature = signature
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync(_endpoint, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation($"MoMo Response: {responseContent}");

                var result = JsonSerializer.Deserialize<MoMoCreatePaymentResponse>(responseContent);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating MoMo payment: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Xác thực IPN callback từ MoMo
        /// </summary>
        public bool VerifyIpnSignature(Dictionary<string, object> responseData, string signature)
        {
            try
            {
                // Extract data for signature verification
                var rawSignature = $"accessKey={_accessKey}&amount={responseData["amount"]}&extraData={responseData["extraData"]}&" +
                    $"message={responseData["message"]}&orderId={responseData["orderId"]}&orderInfo={responseData["orderInfo"]}&" +
                    $"orderType={responseData["orderType"]}&partnerCode={_partnerCode}&payType={responseData["payType"]}&" +
                    $"requestId={responseData["requestId"]}&responseTime={responseData["responseTime"]}&resultCode={responseData["resultCode"]}&" +
                    $"transId={responseData["transId"]}";

                var computedSignature = GenerateSignature(rawSignature, _secretKey);
                return computedSignature.Equals(signature, StringComparison.OrdinalIgnoreCase);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error verifying MoMo signature: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Generate HMAC SHA256 signature
        /// </summary>
        private string GenerateSignature(string data, string key)
        {
            byte[] keyByte = Encoding.UTF8.GetBytes(key);
            byte[] messageBytes = Encoding.UTF8.GetBytes(data);

            using (var hmac = new HMACSHA256(keyByte))
            {
                byte[] hashMessage = hmac.ComputeHash(messageBytes);
                return BitConverter.ToString(hashMessage).Replace("-", "").ToLower();
            }
        }
    }

    public class MoMoCreatePaymentResponse
    {
        public string partnerCode { get; set; }
        public string orderId { get; set; }
        public string requestId { get; set; }
        public long amount { get; set; }
        public string orderInfo { get; set; }
        public int resultCode { get; set; }
        public string resultMessage { get; set; }
        public string payUrl { get; set; }
        public string deeplink { get; set; }
        public string qrCodeUrl { get; set; }
        public long responseTime { get; set; }
    }

    public class MoMoIpnRequest
    {
        public string partnerCode { get; set; }
        public string accessKey { get; set; }
        public long amount { get; set; }
        public string orderId { get; set; }
        public string orderInfo { get; set; }
        public string orderType { get; set; }
        public long transId { get; set; }
        public int resultCode { get; set; }
        public string message { get; set; }
        public string payType { get; set; }
        public long responseTime { get; set; }
        public string requestId { get; set; }
        public string extraData { get; set; }
        public string signature { get; set; }
    }
}
