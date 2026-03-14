using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class BlobService
{
    private readonly string _connectionString;
    private readonly string _containerName = "toeic-media";

    public BlobService(IConfiguration configuration)
    {
       _connectionString = configuration["AzureStorageSettings:ConnectionString"];
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0) return null;

        // 1. Connect to Azure
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(_containerName);
        
        // Ensure container exists (optional, but safe)
        await blobContainerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        // 2. Generate a safe, unique filename (e.g., audios/part1/GUID.mp3)
        var fileExtension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{folderName}/{Guid.NewGuid()}{fileExtension}";
        
        var blobClient = blobContainerClient.GetBlobClient(uniqueFileName);

        // 3. Set the content type so browsers know if it's an image or audio
        var blobHttpHeaders = new BlobHttpHeaders { ContentType = file.ContentType };

        // 4. Upload the file
        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = blobHttpHeaders });
        }

        // 5. Return the full public URL so you can save it to your SQL Database
        return blobClient.Uri.ToString();
    }
    public async Task<bool> DeleteFileAsync(string fileUrl)
{
    if (string.IsNullOrEmpty(fileUrl)) return false;

    try
    {
        // 1. Parse the URL to get the blob name
        var uri = new Uri(fileUrl);
        
        // uri.AbsolutePath looks like "/toeic-media/audios/part3/guid.mp3"
        // We need to strip out the "/toeic-media/" part to get the actual blob name
        var blobName = uri.AbsolutePath.Substring($"/{_containerName}/".Length);

        // 2. Connect to Azure
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = blobContainerClient.GetBlobClient(blobName);

        // 3. Delete the file if it exists
        var response = await blobClient.DeleteIfExistsAsync();
        
        return response.Value;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[LỖI XÓA AZURE BLOB] Lỗi khi xóa file {fileUrl}: {ex.Message}");
        return false;
    }
}
}