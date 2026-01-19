using Google.Cloud.TextToSpeech.V1;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System.Net;
using ToeicMaster.API.Helpers;
using ToeicMaster.API.Controllers;
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
        public async Task<string> TextToSpeechAsync(string text, string languageCode = "en-US", string voiceName = "en-US-Chirp3-HD-Achernar")
        {
            try
            {
                // 1. Chuyển text thành audio bằng Google TTS
                var synthesisInput = new SynthesisInput { Text = text };
                var voiceSelectionParams = new VoiceSelectionParams
                {
                    LanguageCode = languageCode,
                    Name = voiceName,
                    SsmlGender = SsmlVoiceGender.Female
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
        public async Task<string> UploadToS3Async(byte[] audioData, string key)
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

        /// <summary>
        /// Tạo audio bytes từ text (không upload S3 ngay)
        /// </summary>
        public async Task<byte[]> GenerateAudioBytesAsync(string text, string voiceName, bool useSSML = false)
        {
            try
            {
                SynthesisInput synthesisInput;

                if (useSSML)
                {
                    // Nếu dùng SSML, bọc text với <speak> tags
                    synthesisInput = new SynthesisInput { Ssml = $"<speak>{text}</speak>" };
                }
                else
                {
                    synthesisInput = new SynthesisInput { Text = text };
                }

                var voiceSelectionParams = new VoiceSelectionParams
                {
                    LanguageCode = "en-US",
                    Name = voiceName
                };
                var audioConfig = new AudioConfig { AudioEncoding = AudioEncoding.Mp3 };

                var response = await _ttsClient.SynthesizeSpeechAsync(new SynthesizeSpeechRequest
                {
                    Input = synthesisInput,
                    Voice = voiceSelectionParams,
                    AudioConfig = audioConfig
                });

                return response.AudioContent.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi tạo audio bytes: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Nối các đoạn audio lại với nhau (ghép file)
        /// </summary>
        public byte[] CombineAudioClips(List<byte[]> audioClips)
        {
            using (var outputStream = new MemoryStream())
            {
                foreach (var clip in audioClips)
                {
                    outputStream.Write(clip, 0, clip.Length);
                }
                return outputStream.ToArray();
            }
        }

        public async Task<string> GenerateFullPart3AudioAsync(
   List<DialogueLine> dialogueLines,
   List<string> questions,
   string? introText)
        {
            try
            {
                // Null checks
                if (dialogueLines == null)
                {
                    Console.WriteLine("[AUDIO ERROR] dialogueLines is NULL!");
                    throw new ArgumentNullException(nameof(dialogueLines), "Dialogue lines không được null");
                }
                if (questions == null)
                {
                    Console.WriteLine("[AUDIO ERROR] questions is NULL!");
                    throw new ArgumentNullException(nameof(questions), "Questions list không được null");
                }

                // Cấu hình giọng
                string voiceMan = "en-US-Chirp3-HD-Fenrir";
                string voiceWoman = "en-US-Chirp3-HD-Achernar";
                string voiceNarrator = "en-US-Neural2-D";

                // List Tasks để chạy song song (Tối ưu tốc độ import)
                var masterParts = new List<byte[]>();

                // 1. DIALOGUE
                Console.WriteLine($"[AUDIO] Tổng dialogue lines: {dialogueLines.Count}");
                var dialogueTasks = dialogueLines.Select(line =>
                {
                    string currentVoice = line.Speaker == "M" ? voiceMan : voiceWoman;
                    string ssml = $"<speak><prosody rate=\"1.0\">{line.Text}</prosody></speak>";
                    return GenerateAudioBytesAsync(ssml, currentVoice, useSSML: true);
                }).ToList();

                // 2. QUESTIONS
                Console.WriteLine($"[AUDIO] Tổng questions: {questions.Count}");
                var questionTasks = questions.Select(qText =>
                {
                    string ssml = $"<speak><prosody rate=\"1.0\">{qText}</prosody></speak>";
                    return GenerateAudioBytesAsync(ssml, voiceNarrator, useSSML: true);
                }).ToList();

                // Chờ AI generate xong hết
                if (dialogueTasks.Count > 0 || questionTasks.Count > 0)
                {
                    Console.WriteLine("[AUDIO] Chờ TTS generate audio...");
                    await Task.WhenAll(dialogueTasks.Cast<Task>().Concat(questionTasks.Cast<Task>()));
                    Console.WriteLine("[AUDIO] TTS generate xong!");
                }

                // 3. GHÉP FILE (Logic AudioHelper)

                // Dialogue (Nghỉ 0.5s giữa các câu)
                if (dialogueTasks.Count > 0)
                {
                    var dialogueBytes = dialogueTasks.Select(t => t.Result).ToList();
                    Console.WriteLine($"[AUDIO] Dialogue bytes count: {dialogueBytes.Count}, total size: {dialogueBytes.Sum(b => b?.Length ?? 0)} bytes");
                    
                    if (dialogueBytes.Any(b => b != null))
                    {
                        var fullDialogue = AudioHelper.MergeAudioWithSilence(dialogueBytes, 500);
                        if (fullDialogue != null)
                        {
                            masterParts.Add(fullDialogue);
                            Console.WriteLine($"[AUDIO] Full dialogue size: {fullDialogue.Length} bytes");
                        }
                    }
                }

                // Questions (Ghép các câu hỏi, nghỉ 8s sau mỗi câu)
                if (questionTasks.Count > 0)
                {
                    var questionBytes = questionTasks.Select(t => t.Result).ToList();
                    Console.WriteLine($"[AUDIO] Question bytes count: {questionBytes.Count}, total size: {questionBytes.Sum(b => b?.Length ?? 0)} bytes");
                    
                    if (questionBytes.Any(b => b != null))
                    {
                        var fullQuestions = AudioHelper.MergeAudioWithSilence(questionBytes, 8000);
                        if (fullQuestions != null)
                        {
                            masterParts.Add(fullQuestions);
                            Console.WriteLine($"[AUDIO] Full questions size: {fullQuestions.Length} bytes");
                        }
                    }
                }

                if (masterParts.Count == 0)
                {
                    throw new Exception("Không có audio data để upload!");
                }

                var finalBytes = AudioHelper.MergeAudioWithSilence(masterParts, 2000);
                if (finalBytes == null || finalBytes.Length == 0)
                {
                    throw new Exception("Final audio bytes rỗng!");
                }

                string s3FileName = $"part3/auto_import_{Guid.NewGuid()}.mp3";
                Console.WriteLine($"[AUDIO] Uploading to S3: {s3FileName}, size: {finalBytes.Length} bytes");

                return await UploadToS3Async(finalBytes, s3FileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AUDIO FATAL ERROR] {ex.GetType().Name}: {ex.Message}");
                Console.WriteLine($"[AUDIO STACK TRACE] {ex.StackTrace}");
                throw;
            }
        }

    }
}
