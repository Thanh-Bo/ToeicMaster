# 📚 VOCABULARY MODULE - FULL STRUCTURE

## 🏗️ FRONTEND ARCHITECTURE

### 📂 Folder Structure
```
toeic-web/app/
├── vocabulary/
│   ├── page.tsx                    # 🆕 Main vocabulary list page (just created)
│   └── [topicId]/
│       └── page.tsx                # Study page for specific topic
├── components/vocabulary/
│   ├── Flashcard.tsx               # Flip card learning component
│   ├── MatchingGame.tsx            # Word matching game
│   └── TopicCard.tsx               # Topic card component
├── services/
│   └── vocabularyService.ts        # API calls for vocabulary
└── types.ts                        # TypeScript interfaces (VocabWord, VocabStats)
```

---

## 🎨 PAGE COMPONENTS

### 1️⃣ `app/vocabulary/page.tsx` (Main Vocabulary Page)
**Purpose:** Display list of vocabulary topics

**Features:**
- ✅ Grid layout of topic cards
- ✅ Search functionality by topic name
- ✅ Topic statistics (word count, progress)
- ✅ Bookmark indicator for bookmarked topics
- ✅ Dark mode support
- ✅ Loading state with spinner
- ✅ Error handling

**Key Functions:**
```typescript
fetchTopics()    // GET /api/vocabulary/topics - Fetch all topics
```

**Interface:**
```typescript
interface VocabularyTopic {
  id: number;
  name: string;
  description: string;
  wordCount: number;
  bookmarked: boolean;
}
```

---

### 2️⃣ `app/vocabulary/[topicId]/page.tsx` (Study Page)
**Purpose:** Interactive vocabulary learning for a specific topic

**Learning Phases:**
1. **LEARN** - Flashcard mode (flip to see meaning)
2. **PRACTICE_GAME** - Matching game (EN ↔ VI pairs)
3. **TEST** - Mini vocabulary test
4. **COMPLETED** - Completion screen

**Key Features:**
- 📊 Progress bar showing learning phases
- 🎴 Flashcard with flip animation
- 🎮 Matching game with instant feedback
- 📝 Status tracking (NEW → LEARNING → MASTERED)
- ⬅️ Navigate between cards

**Key Data:**
```typescript
interface VocabWord {
  id: number;
  word: string;                    // English word
  type: string;                    // Part of speech (n, v, adj, etc)
  pronunciation: string;           // /ˈɪksæmpl/
  meaning: string;                 // Vietnamese meaning
  exampleSentenceEn: string;      // English example
  exampleSentenceVi: string;      // Vietnamese example
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  isBookmarked: boolean;
  wordFamilies: WordFamily[];     // Related word forms
}

interface WordFamily {
  word: string;      // "compete" (verb form of competition)
  type: string;      // 'v' (verb)
  meaning?: string;  // Vietnamese meaning
}
```

---

## 🧩 REUSABLE COMPONENTS

### 1️⃣ `Flashcard.tsx`
**Purpose:** Interactive flip card for learning

**Props:**
```typescript
interface Props {
  word: VocabWord;
  onStatusChange: (status: 'LEARNING' | 'MASTERED') => void;
  onBookmark: () => void;
}
```

**Features:**
- 🔄 3D flip animation (click to flip)
- 🔊 Audio pronunciation (Web Speech API or mp3 file)
- 📖 Word family display on back
- ⭐ Bookmark button
- 😎 Smart review buttons (Hard / Mastered)

**Styling:**
- Perspective 3D effect
- Smooth 700ms transition
- Border: gray on front, blue on back

---

### 2️⃣ `MatchingGame.tsx`
**Purpose:** Fun matching game for reinforcement

**Props:**
```typescript
interface Props {
  words: VocabWord[];
  onComplete: () => void;
}
```

**Game Logic:**
1. Create cards from words + meanings
2. Shuffle all cards (4 columns)
3. Click 2 cards to match EN ↔ VI
4. ✅ Match = Green + matched state
5. ❌ Wrong = Red + shake animation + reset
6. Win when all pairs matched

**Card States:**
- `default` - Gray, clickable
- `selected` - Blue, clicked
- `matched` - Green, disabled
- `wrong` - Red, shake animation

---

### 3️⃣ `TopicCard.tsx`
**Purpose:** Display topic summary card

**Props:**
```typescript
interface Props {
  topic: Topic;
  onStart: (id: number) => void;
}
```

**Features:**
- 📊 Progress bar (learned/total words)
- 🏆 Award icon if 100% completed
- 🎯 Level badge (Basic/Intermediate/Advanced)
- ▶️ Start/Continue button

**Level Colors:**
- Basic → Green
- Intermediate → Blue
- Advanced → Purple

---

## 📡 API SERVICE (`vocabularyService.ts`)

```typescript
vocabularyService = {
  // Get all vocabularies with filters
  getVocabularies(params?: {
    category?: string;
    difficulty?: number;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<VocabularyItem[]>

  // Get vocabulary categories
  getCategories(): Promise<string[]>

  // Get flashcards for spaced repetition
  getFlashcards(count = 20, category?: string): Promise<{
    cards: Flashcard[];
    newCount: number;
    reviewCount: number;
  }>

  // Review flashcard (track learning)
  reviewFlashcard(vocabId: number, remembered: boolean): Promise<any>

  // Get learning statistics
  getStats(): Promise<VocabStats>

  // Add new vocabulary
  addVocabulary(vocab: Partial<VocabularyItem>): Promise<any>

  // Bulk import vocabularies
  importVocabularies(vocabularies: Partial<VocabularyItem>[]): Promise<any>
}
```

---

## 🗄️ BACKEND STRUCTURE

### 📂 Entity Relationships
```
Vocabulary (1) ──────→ (M) UserVocabulary
    ↓
  Topic
    ↓
WordFamily
```

### 📋 Database Entities

#### 1️⃣ **Vocabulary.cs** (Word database)
```csharp
public class Vocabulary {
  public int Id { get; set; }
  public string Word { get; set; }              // "Contract"
  public string Meaning { get; set; }           // "Hợp đồng"
  public string Pronunciation { get; set; }    // "/ˈkɒntrækt/"
  public string PartOfSpeech { get; set; }     // "n" (noun)
  public string Example { get; set; }          // "We signed..."
  public string ExampleTranslation { get; set; }
  public string AudioUrl { get; set; }         // MP3 file
  public string ImageUrl { get; set; }         // Illustration
  public string Icon { get; set; }             // Optional icon
  public int Difficulty { get; set; }          // 1-5
  public int TopicId { get; set; }
  
  // Navigation Properties
  public virtual Topic Topic { get; set; }
  public virtual ICollection<WordFamily> WordFamilies { get; set; }
  public virtual ICollection<UserVocabulary> UserVocabularies { get; set; }
}
```

#### 2️⃣ **WordFamily.cs** (Word forms)
```csharp
public class WordFamily {
  public int Id { get; set; }
  public int VocabularyId { get; set; }    // FK to Vocabulary
  public string Word { get; set; }         // "compete" (verb form)
  public string PartOfSpeech { get; set; } // "v"
  public string Meaning { get; set; }      // "thi đua"
  
  public virtual Vocabulary Vocabulary { get; set; }
}
```

#### 3️⃣ **UserVocabulary.cs** (User progress)
```csharp
public class UserVocabulary {
  public int Id { get; set; }
  public int UserId { get; set; }
  public int VocabularyId { get; set; }
  public int Status { get; set; }         // 0=New, 1=Learning, 3=Mastered
  public DateTime CreatedAt { get; set; }
  public DateTime LastReviewedAt { get; set; }
  public DateTime NextReviewAt { get; set; } // Spaced repetition
  
  public virtual User User { get; set; }
  public virtual Vocabulary Vocabulary { get; set; }
}
```

---

## 🔌 API ENDPOINTS

### Base Route: `/api/v1/vocabulary`

#### 📖 **Learning APIs**

```http
GET /topics
Response: [{
  id: 1,
  title: "Contracts",
  level: "Intermediate",
  levelRange: "401-600",
  imageUrl: "...",
  totalWords: 45,
  learnedWords: 12
}]

GET /topics/{topicId}/words
Response: [{
  id: 1,
  word: "Contract",
  meaning: "Hợp đồng",
  pronunciation: "/ˈkɒntrækt/",
  partOfSpeech: "n",
  example: "We signed the contract",
  exampleTranslation: "Chúng tôi đã ký hợp đồng",
  audioUrl: "...",
  imageUrl: "...",
  wordFamilies: [
    { word: "compete", partOfSpeech: "v", meaning: "thi đua" }
  ],
  status: 0  // User's learning status
}]

GET /flashcards?count=20&topicId=1
Response: {
  cards: [...],
  newCount: 5,
  reviewCount: 3
}

PUT /{id}/status
Body: { status: 1 | 3 }  // 1=Learning, 3=Mastered
Response: { message: "Status updated" }
```

#### 📚 **Admin APIs**

```http
GET /?topicId=1&difficulty=2&search=contract&page=1&pageSize=20
Response: {
  items: [...],
  total: 150,
  page: 1,
  pageSize: 20,
  totalPages: 8
}

POST /
Body: {
  word: "Contract",
  meaning: "Hợp đồng",
  pronunciation: "...",
  topicId: 1,
  wordFamilies: [
    { word: "compete", partOfSpeech: "v", meaning: "..." }
  ]
}
Response: { message: "Đã thêm từ vựng", vocabId: 1 }

POST /import
Body: [{ word: "...", meaning: "...", topicId: 1 }, ...]
Response: { message: "Đã import 50 từ vựng" }

PUT /{id}
Body: { word: "...", meaning: "..." }

DELETE /{id}

DELETE /delete-all [Admin only]
```

---

## 📊 Data Flow

### Learning Flow (User Perspective)
```
1. User opens /vocabulary
   ↓
2. Fetch topics from GET /topics
   ↓
3. User clicks topic card
   ↓
4. Navigate to /vocabulary/[topicId]
   ↓
5. Fetch words from GET /topics/{id}/words
   ↓
6. Display Flashcards → Update status with PUT /{id}/status
   ↓
7. Play matching game
   ↓
8. Take mini test
   ↓
9. Show completion screen
```

### Progress Tracking (Spaced Repetition)
```
New Word (Status 0)
    ↓ (User marks as learned)
Learning (Status 1) → Review due in 1 day
    ↓ (Reviewed correctly)
Mastered (Status 3) → Review due in 30 days
```

---

## 🎯 Types Definition (`types.ts`)

```typescript
interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty?: number;
  status?: number;
  wordFamilies?: WordFamily[];
}

interface Flashcard extends VocabularyItem {
  // Same as VocabularyItem
}

interface VocabStats {
  totalLearned: number;
  totalMastered: number;
  learningStreak: number;
  lastReviewedAt?: Date;
}

interface WordFamily {
  word: string;
  partOfSpeech: string;
  meaning?: string;
}
```

---

## 🚀 Key Features Summary

| Feature | Frontend | Backend |
|---------|----------|---------|
| View topics | ✅ page.tsx | ✅ GET /topics |
| Flashcard learning | ✅ Flashcard.tsx | ✅ GET /topics/{id}/words |
| Matching game | ✅ MatchingGame.tsx | - |
| Track progress | ✅ [topicId]/page.tsx | ✅ PUT /{id}/status |
| Spaced repetition | ✅ vocabularyService | ✅ GET /flashcards |
| Bookmark words | ✅ Flashcard.tsx | - (ready to implement) |
| Word families | ✅ Flashcard.tsx | ✅ WordFamily.cs |
| Admin management | - | ✅ POST/PUT/DELETE |
| Bulk import | - | ✅ POST /import |
| Statistics | ✅ Service ready | ✅ GET /stats |

---

## 🔧 Missing Implementations

### Frontend
- [ ] Bookmark functionality (UI ready, API call needed)
- [ ] Statistics page (stats data ready)
- [ ] Search/filter vocabulary
- [ ] Audio pronunciation validation
- [ ] Image lazy loading

### Backend
- [ ] GET /stats endpoint (Returns VocabStats)
- [ ] User bookmark management
- [ ] Detailed statistics (daily streak, mastery percentage)
- [ ] Difficulty filtering logic
- [ ] Recommended review list based on spaced repetition

---

## 📝 Notes

1. **Status codes:**
   - 0 = New (not learned)
   - 1 = Learning (in progress)
   - 3 = Mastered (complete)

2. **Next review calculation:**
   - Learning → +1 day
   - Mastered → +30 days

3. **Spaced repetition:** Uses `NextReviewAt` timestamp

4. **Word families example:**
   - Main word: "competition" (noun)
   - Family: "compete" (verb), "competitor" (noun), "competitive" (adj)

5. **Topics levels:**
   - Basic: 0-400 score
   - Intermediate: 401-600 score
   - Advanced: 601-990 score

