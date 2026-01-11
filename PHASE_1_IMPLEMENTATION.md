# SRS Progress Bar - Phase 1 Implementation ✅

## Overview
Implemented static 5-level SRS progress visualization across backend and frontend. This is the foundation for all subsequent phases.

---

## Backend Changes

### 1. **VocabularyController.cs** - Enhanced `GetTopics()` endpoint
**File**: `ToeicMaster.API/Controllers/VocabularyController.cs`

**Changes Made**:
- Added 5 new fields to TopicDto response:
  - `CurrentLevel` (0-5): Highest SRS level user achieved in this topic
  - `NextReviewAt` (DateTime?): When next review becomes available
  - `WordCounts` (Dictionary<int,int>): Distribution of words by level {0:12, 1:8, 2:5, ...}
  - `CanReviewNow` (bool): Whether any words in this topic are due for review
  - `TimeUntilReady` (string): Human-readable countdown (e.g., "12h 30m")

**Logic**:
```csharp
// Get user ID safely (0 if not logged in)
var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
int userId = userIdStr != null ? int.Parse(userIdStr) : 0;

// For each topic, calculate:
1. CurrentLevel = Max(Level) among all user's words in topic
2. NextReviewAt = Min(NextReviewAt) where NextReviewAt > now
3. WordCounts = Count words grouped by Level for this user
4. CanReviewNow = Any word has NextReviewAt <= now && Status < 3
5. TimeUntilReady = Format remaining time nicely
```

**Helper Function**:
```csharp
private string CalculateTimeRemaining(DateTime nextReviewAt)
{
    // Returns: "1d 5h", "12h 30m", "45m 20s", or ""
}
```

### 2. **VocabularyDto.cs** - Updated TopicDto structure
**File**: `ToeicMaster.API/Models/Vocabulary/VocabularyDto.cs`

**New Properties Added**:
```csharp
public class TopicDto
{
    // ... existing fields ...
    
    // SRS Progress (Phase 1-4)
    public int CurrentLevel { get; set; }
    public DateTime? NextReviewAt { get; set; }
    public Dictionary<int, int> WordCounts { get; set; } = new();
    public bool CanReviewNow { get; set; }
    public string TimeUntilReady { get; set; } = "";
}
```

---

## Frontend Changes

### 1. **TopicCard.tsx** - 5-Block Progress Visualization
**File**: `toeic-web/app/components/vocabulary/TopicCard.tsx`

**New Imports**:
- `useState`, `useEffect` from React (for countdown timer)
- `Clock`, `Zap` from lucide-react (new icons)

**Key Features Implemented**:

#### A. Countdown Timer (useEffect)
```typescript
useEffect(() => {
  // Updates every 60 seconds
  // Calculates: days, hours, minutes remaining
  // Formats: "1d 5h" or "12h 30m" or "45m"
}, [topic.nextReviewAt, topic.canReviewNow])
```

#### B. 5-Segment Progress Block
```tsx
<div className="flex gap-2 mb-4">
  {[1, 2, 3, 4, 5].map((level) => (
    <div
      // Filled: Blue gradient (level <= currentLevel)
      // Empty: Gray (level > currentLevel)
      // Shows word count: topic.wordCounts[level]
    />
  ))}
</div>
```

#### C. Status Display
- **Mastered** (level === 5): Trophy icon ⭐
- **Ready** (canReviewNow): Zap icon ⚡ with pulse animation
- **Cooldown** (waiting): Clock icon 🕐 with countdown time

#### D. Dynamic Button Text
```typescript
{topic.currentLevel === 5
  ? "Ôn tập tự do"                    // Mastered
  : topic.canReviewNow
  ? `Ôn tập Lv ${topic.currentLevel + 1}`  // Ready
  : progress === 0
  ? "Bắt đầu học"                    // New
  : "Tiếp tục học"}                  // Learning
```

#### E. Dynamic Button Colors
- **Blue**: Normal learning state
- **Amber**: Ready state (glow effect)
- **Yellow**: Mastered state

### 2. **vocabulary/page.tsx** - No Changes Needed
**File**: `toeic-web/app/vocabulary/page.tsx`

- Existing `fetchTopics()` already calls the enhanced endpoint
- TopicCard automatically receives all new fields
- Review queue section was already removed in previous phase

---

## Data Flow

```
┌─────────────────────┐
│ Backend: GetTopics()│ ← Enhanced with SRS calculations
└──────────┬──────────┘
           │
           ↓ Returns TopicDto with:
    ┌──────────────────┐
    │ currentLevel     │
    │ nextReviewAt     │
    │ wordCounts       │
    │ canReviewNow     │
    │ timeUntilReady   │
    └────────┬─────────┘
             │
             ↓ Passed to <TopicCard />
    ┌──────────────────────────┐
    │ Renders 5-block progress │
    │ Shows countdown timer    │
    │ Updates button text/color│
    └──────────────────────────┘
```

---

## Visual Changes

### Before (Old Design)
```
┌─────────────────────────────┐
│ Topic Title      [Level]  ⭐ │
│                             │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← % progress bar
│ 8/12 từ đã học             │
│                             │
│ [  Tiếp tục học  ]         │
└─────────────────────────────┘
```

### After (Phase 1)
```
┌─────────────────────────────┐
│ Topic Title      [Level]  ⭐ │
│                             │
│ Cấp độ ghi nhớ    2/5       │
│ ┌────┐┌────┐┌────┐┌──┐┌──┐│
│ │ 12 ││ 8  ││ 5  ││3 ││2 ││  ← 5 blocks
│ └────┘└────┘└────┘└──┘└──┘│
│                             │
│ ⚡ Cần ôn ngay              │
│ 8/12 từ đã học             │
│                             │
│ [ Ôn tập Lv 3 ]            │
└─────────────────────────────┘
```

---

## States Visualization

### Cooldown State (Waiting for next review)
```
Status Text: 🕐 Quay lại sau 12h 30m
Button: [Tiếp tục học] (Blue)
Blocks: 3 filled (blue), 2 empty (gray)
```

### Ready State (Can review now)
```
Status Text: ⚡ Cần ôn ngay (pulsing)
Button: [Ôn tập Lv 3] (Amber highlight)
Blocks: 2 filled (blue), 3 empty (gray)
```

### Mastered State (Level 5)
```
Status Text: ⭐ Đã thành thạo
Button: [Ôn tập tự do] (Yellow)
Blocks: 5/5 filled (gold gradient)
```

---

## Testing Checklist

- [ ] Backend: GetTopics() returns all 5 new fields
- [ ] Frontend: 5 blocks render correctly
- [ ] Countdown timer updates every minute
- [ ] Button text changes based on state
- [ ] Button color changes based on state
- [ ] Word counts display in blocks
- [ ] Status icon and text change correctly
- [ ] Mastered state shows trophy properly

---

## Next Steps: Phase 2

**Expected in Phase 2**:
1. Block animations (entrance stagger)
2. Pulse animation for ready state
3. Better color transitions between states
4. Additional UX polish

---

## Commit Message
```
feat: Implement SRS 5-level progress bar - Phase 1

- Add CurrentLevel, NextReviewAt, WordCounts, CanReviewNow, TimeUntilReady to TopicDto
- Enhance VocabularyController.GetTopics() with SRS calculations
- Replace % progress bar with 5-segment visualization
- Add countdown timer to TopicCard
- Implement dynamic button text/color based on SRS state
- Add Clock and Zap icons for status display
```

---

## Architecture

### Database: UserVocabulary Entity
- `Level` (0-5) ✅
- `NextReviewAt` (DateTime) ✅
- Uses existing fields for SRS

### Service Layer: VocabularyService
- Already has helper functions for calculations
- Backend performs aggregation (not frontend)

### Component Hierarchy
```
vocabulary/page.tsx
  ├── fetchTopics() → API call
  ├── topics state
  └── TopicCard[] components
      ├── useEffect (countdown timer)
      ├── 5-block visualization
      ├── Status display
      └── Dynamic button
```

---

## Performance Considerations

✅ **Optimized**:
- Single API call (no extra requests per card)
- Countdown updated every 60 seconds (not every second)
- Calculations done on backend (cleaner frontend)

⚠️ **Future Optimization (Phase 3-4)**:
- Could cache WordCounts if needed
- Could batch multiple topic requests

---

