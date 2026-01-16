using NAudio.Wave;
using NAudio.Lame;
using System.IO;
using System.Collections.Generic;

namespace ToeicMaster.API.Helpers
{
    public class AudioHelper
    {
        /// <summary>
        /// Nối danh sách các file MP3 (byte[]) và chèn khoảng lặng vào giữa
        /// </summary>
        public static byte[]? MergeAudioWithSilence(List<byte[]> audioClips, int silenceDurationMs = 500)
        {
            if (audioClips == null || audioClips.Count == 0) 
                return null;

            try
            {
                using (var outputStream = new MemoryStream())
                {
                    WaveFormat? commonFormat = null;
                    LameMP3FileWriter? writer = null;
                    bool isFirstClip = true;

                    foreach (var clipBytes in audioClips)
                    {
                        if (clipBytes == null || clipBytes.Length == 0)
                            continue;

                        try
                        {
                            using (var clipStream = new MemoryStream(clipBytes))
                            using (var reader = new Mp3FileReader(clipStream))
                            {
                                // Khởi tạo writer lần đầu
                                if (isFirstClip)
                                {
                                    commonFormat = reader.WaveFormat;
                                    writer = new LameMP3FileWriter(outputStream, commonFormat, LAMEPreset.STANDARD);
                                    isFirstClip = false;
                                }

                                // Kiểm tra format
                                if (commonFormat != null && reader.WaveFormat.SampleRate != commonFormat.SampleRate)
                                {
                                    continue;
                                }

                                // Ghi audio
                                if (writer != null)
                                {
                                    reader.CopyTo(writer);

                                    // Chèn silence sau mỗi clip
                                    if (silenceDurationMs > 0 && commonFormat != null)
                                    {
                                        byte[] silenceBytes = GenerateSilence(commonFormat, silenceDurationMs);
                                        writer.Write(silenceBytes, 0, silenceBytes.Length);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            System.Diagnostics.Debug.WriteLine($"Lỗi xử lý clip: {ex.Message}");
                            continue;
                        }
                    }

                    // Đóng writer
                    if (writer != null)
                    {
                        writer.Flush();
                        writer.Dispose();
                    }

                    var result = outputStream.ToArray();
                    return result.Length > 0 ? result : null;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Lỗi merge audio: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Thuật toán sinh ra khoảng lặng (Silence) với proper WAV format
        /// </summary>
        private static byte[] GenerateSilence(WaveFormat format, int durationMs)
        {
            if (format == null) return new byte[0];

            try
            {
                // Tính số byte cần thiết dựa trên sample rate, channels, và bits per sample
                int bytesPerSample = format.BitsPerSample / 8;
                int samplesPerSecond = format.SampleRate;
                int totalSamples = (int)((samplesPerSecond * durationMs) / 1000.0);
                int totalBytes = totalSamples * format.Channels * bytesPerSample;

                // Tạo buffer im lặng (tất cả bytes = 0)
                byte[] silenceBuffer = new byte[totalBytes];
                return silenceBuffer;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Lỗi tạo silence: {ex.Message}");
                return new byte[0];
            }
        }

        /// <summary>
        /// Thuật toán sinh ra khoảng lặng (Silence) - CŨ (KO DÙNG NỮA)
        /// </summary>
        private static void AddSilence(LameMP3FileWriter? writer, WaveFormat? format, int durationMs)
        {
            // DEPRECATED: Sử dụng GenerateSilence thay vì hàm này
        }
    }
}
