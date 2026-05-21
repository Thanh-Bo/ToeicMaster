using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ToeicMaster.API.Services;

public interface IPaymentService
{
    Task<PayOsPaymentLinkData> CreatePaymentLinkAsync(
        long orderCode,
        int amount,
        string description,
        string returnUrl,
        string cancelUrl,
        string itemName,
        CancellationToken cancellationToken = default);

    bool IsValidWebhook(PayOsWebhookRequest webhook);
}

public class PaymentService : IPaymentService
{
    private const string PayOsBaseUrl = "https://api-merchant.payos.vn";
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public PaymentService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<PayOsPaymentLinkData> CreatePaymentLinkAsync(
        long orderCode,
        int amount,
        string description,
        string returnUrl,
        string cancelUrl,
        string itemName,
        CancellationToken cancellationToken = default)
    {
        var clientId = GetRequiredSetting("PAYOS_CLIENT_ID");
        var apiKey = GetRequiredSetting("PAYOS_API_KEY");

        var request = new PayOsCreatePaymentRequest
        {
            OrderCode = orderCode,
            Amount = amount,
            Description = description,
            ReturnUrl = returnUrl,
            CancelUrl = cancelUrl,
            Items =
            [
                new PayOsPaymentItem
                {
                    Name = itemName,
                    Quantity = 1,
                    Price = amount
                }
            ]
        };

        request.Signature = CreatePaymentRequestSignature(request);

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{PayOsBaseUrl}/v2/payment-requests");
        httpRequest.Headers.TryAddWithoutValidation("x-client-id", clientId);
        httpRequest.Headers.TryAddWithoutValidation("x-api-key", apiKey);
        httpRequest.Content = new StringContent(
            JsonSerializer.Serialize(request, _jsonOptions),
            Encoding.UTF8,
            "application/json");

        using var response = await _httpClient.SendAsync(httpRequest, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"payOS create payment failed: HTTP {(int)response.StatusCode} - {body}");

        var payOsResponse = JsonSerializer.Deserialize<PayOsResponse<PayOsPaymentLinkData>>(body, _jsonOptions);
        if (payOsResponse?.Code != "00" || payOsResponse.Data == null)
            throw new InvalidOperationException($"payOS create payment failed: {payOsResponse?.Desc ?? body}");

        return payOsResponse.Data;
    }

    public bool IsValidWebhook(PayOsWebhookRequest webhook)
    {
        if (webhook.Data == null || string.IsNullOrWhiteSpace(webhook.Signature))
            return false;

        var expectedSignature = CreateSignatureFromDictionary(webhook.Data);
        return FixedTimeEquals(expectedSignature, webhook.Signature);
    }

    private string CreatePaymentRequestSignature(PayOsCreatePaymentRequest request)
    {
        var data = new SortedDictionary<string, string>
        {
            ["amount"] = request.Amount.ToString(CultureInfo.InvariantCulture),
            ["cancelUrl"] = request.CancelUrl,
            ["description"] = request.Description,
            ["orderCode"] = request.OrderCode.ToString(CultureInfo.InvariantCulture),
            ["returnUrl"] = request.ReturnUrl
        };

        return CreateSignature(data);
    }

    private string CreateSignatureFromDictionary(IReadOnlyDictionary<string, JsonElement> data)
    {
        var sortedData = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var (key, value) in data)
        {
            sortedData[key] = JsonElementToPayOsString(value);
        }

        return CreateSignature(sortedData);
    }

    private string CreateSignature(IEnumerable<KeyValuePair<string, string>> sortedData)
    {
        var checksumKey = GetRequiredSetting("PAYOS_CHECKSUM_KEY");
        var data = string.Join("&", sortedData.Select(pair => $"{pair.Key}={pair.Value}"));

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(checksumKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string JsonElementToPayOsString(JsonElement value)
    {
        return value.ValueKind switch
        {
            JsonValueKind.Null or JsonValueKind.Undefined => "",
            JsonValueKind.String => NormalizeNullableString(value.GetString()),
            JsonValueKind.Number => value.GetRawText(),
            JsonValueKind.True => "true",
            JsonValueKind.False => "false",
            JsonValueKind.Array => JsonSerializer.Serialize(
                value.EnumerateArray().Select(SortJsonElementObject).ToArray(),
                new JsonSerializerOptions { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping }),
            JsonValueKind.Object => JsonSerializer.Serialize(
                SortJsonElementObject(value),
                new JsonSerializerOptions { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping }),
            _ => value.GetRawText()
        };
    }

    private static object SortJsonElementObject(JsonElement value)
    {
        if (value.ValueKind != JsonValueKind.Object)
            return JsonElementToPlainValue(value);

        return value.EnumerateObject()
            .OrderBy(property => property.Name, StringComparer.Ordinal)
            .ToDictionary(property => property.Name, property => JsonElementToPlainValue(property.Value));
    }

    private static object? JsonElementToPlainValue(JsonElement value)
    {
        return value.ValueKind switch
        {
            JsonValueKind.Null or JsonValueKind.Undefined => null,
            JsonValueKind.String => NormalizeNullableString(value.GetString()),
            JsonValueKind.Number => value.TryGetInt64(out var longValue) ? longValue : value.GetDecimal(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Array => value.EnumerateArray().Select(SortJsonElementObject).ToArray(),
            JsonValueKind.Object => SortJsonElementObject(value),
            _ => value.GetRawText()
        };
    }

    private static string NormalizeNullableString(string? value)
    {
        return value is null or "null" or "undefined" ? "" : value;
    }

    private static bool FixedTimeEquals(string expected, string actual)
    {
        var expectedBytes = Encoding.UTF8.GetBytes(expected.ToLowerInvariant());
        var actualBytes = Encoding.UTF8.GetBytes(actual.ToLowerInvariant());
        return expectedBytes.Length == actualBytes.Length &&
               CryptographicOperations.FixedTimeEquals(expectedBytes, actualBytes);
    }

    private string GetRequiredSetting(string key)
    {
        return _configuration[key]
            ?? throw new InvalidOperationException($"{key} is not configured.");
    }
}

public class PayOsCreatePaymentRequest
{
    public long OrderCode { get; set; }
    public int Amount { get; set; }
    public string Description { get; set; } = null!;
    public string CancelUrl { get; set; } = null!;
    public string ReturnUrl { get; set; } = null!;
    public List<PayOsPaymentItem> Items { get; set; } = [];
    public string Signature { get; set; } = null!;
}

public class PayOsPaymentItem
{
    public string Name { get; set; } = null!;
    public int Quantity { get; set; }
    public int Price { get; set; }
}

public class PayOsResponse<T>
{
    public string? Code { get; set; }
    public string? Desc { get; set; }
    public T? Data { get; set; }
    public string? Signature { get; set; }
}

public class PayOsPaymentLinkData
{
    public string? Bin { get; set; }
    public string? AccountNumber { get; set; }
    public string? AccountName { get; set; }
    public int Amount { get; set; }
    public string? Description { get; set; }
    public long OrderCode { get; set; }
    public string? Currency { get; set; }
    public string? PaymentLinkId { get; set; }
    public string? Status { get; set; }
    public string? CheckoutUrl { get; set; }
    public string? QrCode { get; set; }
}

public class PayOsWebhookRequest
{
    public string? Code { get; set; }
    public string? Desc { get; set; }
    public bool Success { get; set; }
    public Dictionary<string, JsonElement>? Data { get; set; }
    public string? Signature { get; set; }
}
