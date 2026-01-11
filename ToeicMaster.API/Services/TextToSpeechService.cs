using Google.Cloud.TextToSpeech.V1;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace ToeicMaster.API.Services
{
    public class TextToSpeechService
    {
        private readonly TextToSpeechClient _ttsClient;
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _config;
        private readonly string _bucketName;
        private readonly string _s3Region;

        public TextToSpeechService(IConfiguration config, IAmazonS3 s3Client)
        {
            _config = config;
            _s3Client = s3Client;
            
            // Lấy credentials từ environment
            var googleCredentials = config["Google:CredentialsPath"];
            if (!string.IsNullOrEmpty(googleCredentials))
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", googleCredentials);
            }
            
            _ttsClient = TextToSpeechClient.Create();
            _bucketName = config["AWS:S3:BucketName"] ?? "toeicmaster-audio";
            _s3Region = config["AWS:S3:Region"] ?? "ap-southeast-1";
        }

        /// <summary>
        /// Chuyển text thành audio và upload lên S3
        /// </summary>
        public async Task<string> TextToSpeechAsync(string text, string languageCode = "en-US", string voiceName = "en-US-Neural2-F")
        {
            try
            {
                // 1. Chuyển text thành audio bằng Google TTS
                var synthesisInput = new SynthesisInput { Text = text };
                var voiceSelectionParams = new VoiceSelectionParams
                {
                    LanguageCode = languageCode,
                    Name = voiceName,
                    SsmlGender = SsmlVoiceGender.Male
                };
                var audioConfig = new AudioConfig { AudioEncoding = AudioEncoding.Mp3 };

                var response = await _ttsClient.SynthesizeSpeechAsync(
                    new SynthesizeSpeechRequest
                    {
                        Input = synthesisInput,
                        Voice = voiceSelectionParams,
                        AudioConfig = audioConfig
                    }
                );

                // 2. Upload audio lên S3
                var fileName = $"audio/{Guid.NewGuid()}.mp3";
                var s3Url = await UploadToS3Async(response.AudioContent.ToByteArray(), fileName);

                return s3Url;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi Text-to-Speech: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Upload file audio lên AWS S3
        /// </summary>
        private async Task<string> UploadToS3Async(byte[] audioData, string key)
        {
            try
            {
                var putRequest = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = new MemoryStream(audioData),
                    ContentType = "audio/mpeg",
                    
                };
                // CannedACL = S3CannedACL.PublicRead 
                var response = await _s3Client.PutObjectAsync(putRequest);

                if (response.HttpStatusCode == HttpStatusCode.OK)
                {
                    // Trả về URL của file
                    return $"https://{_bucketName}.s3.{_s3Region}.amazonaws.com/{key}";
                }
                else
                {
                    throw new Exception($"Lỗi upload S3: {response.HttpStatusCode}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi upload S3: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Lấy danh sách voice có sẵn
        /// </summary>
        public async Task<List<string>> GetAvailableVoicesAsync(string languageCode = "en-US")
        {
            try
            {
                var response = await _ttsClient.ListVoicesAsync(
                    new ListVoicesRequest { LanguageCode = languageCode }
                );

                return response.Voices
                    .Select(v => v.Name)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi lấy voice list: {ex.Message}", ex);
            }
        }
    }
}
