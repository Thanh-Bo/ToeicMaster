using System.Text;
using System.Text.Json;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Exam;
using Microsoft.EntityFrameworkCore;

namespace ToeicMaster.API.Services
{
    public class ToeicScoreService
    {
        private readonly AppDbContext _efContext;

        public ToeicScoreService(AppDbContext efContext)
        {
            _efContext = efContext;
        }

        public async Task<TestResultDetailDto> CalculateScoreAsync(int listeningCorrect, int readingCorrect)
        {
            var scoreTable = await _efContext.ScoreConversions.ToListAsync();

            var listeningScore = scoreTable
                .FirstOrDefault(x => x.CorrectCount == listeningCorrect)?.ListeningScore ?? 5;

            var readingScore = scoreTable
                .FirstOrDefault(x => x.CorrectCount == readingCorrect)?.ReadingScore ?? 5;

            return new TestResultDetailDto
            {
                ListeningScore = listeningScore,
                ReadingScore = readingScore,
                TotalScore = listeningScore + readingScore
            };
        }
    }
}