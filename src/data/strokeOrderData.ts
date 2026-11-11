export interface StrokeSpec {
  d: string;
  startX: number;
  startY: number;
}

export interface KanaStrokeOrder {
  char: string;
  paths: StrokeSpec[];
}

// ViewBox: 0 0 100 100 — follows authentic Japanese stroke directions and counts
const BASE_KANA_STROKES: Record<string, StrokeSpec[]> = {
  // ===== HIRAGANA BASIC (46) =====
  'あ': [
    { d: 'M 22,29 Q 50,24 76,27', startX: 22, startY: 29 },
    { d: 'M 48,14 C 46,35 45,58 50,82', startX: 48, startY: 14 },
    { d: 'M 68,40 C 58,64 36,80 25,73 C 16,66 26,44 54,44 C 76,44 82,62 66,80', startX: 68, startY: 40 }
  ],
  'い': [
    { d: 'M 28,24 C 25,44 26,64 35,74 C 40,78 44,70 46,62', startX: 28, startY: 24 },
    { d: 'M 64,28 C 72,38 77,54 78,70', startX: 64, startY: 28 }
  ],
  'う': [
    { d: 'M 40,20 Q 50,24 58,29', startX: 40, startY: 20 },
    { d: 'M 30,40 C 48,30 70,34 69,52 C 68,69 52,80 35,84', startX: 30, startY: 40 }
  ],
  'え': [
    { d: 'M 39,19 Q 49,24 56,28', startX: 39, startY: 19 },
    { d: 'M 26,42 Q 50,35 66,36 C 53,50 38,65 23,77 C 38,64 49,58 54,67 C 58,76 66,77 79,73', startX: 26, startY: 42 }
  ],
  'お': [
    { d: 'M 22,31 Q 42,27 60,26', startX: 22, startY: 31 },
    { d: 'M 41,15 L 41,66 C 41,76 28,80 23,73 C 18,65 34,47 58,47 C 75,47 82,64 69,78', startX: 41, startY: 15 },
    { d: 'M 68,23 Q 75,28 80,35', startX: 68, startY: 23 }
  ],

  'か': [
    { d: 'M 22,36 C 38,32 54,28 57,42 C 58,56 54,72 47,76 C 44,78 39,73 35,68', startX: 22, startY: 36 },
    { d: 'M 40,18 C 36,42 30,62 21,78', startX: 40, startY: 18 },
    { d: 'M 66,27 C 73,34 79,43 82,53', startX: 66, startY: 27 }
  ],
  'き': [
    { d: 'M 26,28 Q 48,25 68,21', startX: 26, startY: 28 },
    { d: 'M 22,45 Q 50,41 72,36', startX: 22, startY: 45 },
    { d: 'M 44,14 C 49,31 55,47 61,60', startX: 44, startY: 14 },
    { d: 'M 33,62 C 28,72 36,82 54,82 C 61,82 67,80 71,78', startX: 33, startY: 62 }
  ],
  'く': [
    { d: 'M 62,18 C 50,32 36,43 29,50 C 39,60 53,71 65,83', startX: 62, startY: 18 }
  ],
  'け': [
    { d: 'M 26,22 C 23,44 23,63 27,76 L 35,65', startX: 26, startY: 22 },
    { d: 'M 46,35 Q 62,33 76,30', startX: 46, startY: 35 },
    { d: 'M 62,17 C 63,43 61,65 46,82', startX: 62, startY: 17 }
  ],
  'こ': [
    { d: 'M 32,29 Q 52,25 68,31', startX: 32, startY: 29 },
    { d: 'M 29,62 C 31,73 48,76 72,73', startX: 29, startY: 62 }
  ],

  'さ': [
    { d: 'M 24,35 Q 50,32 72,26', startX: 24, startY: 35 },
    { d: 'M 44,16 C 50,32 55,46 61,59', startX: 44, startY: 16 },
    { d: 'M 32,62 C 27,72 36,82 56,82 C 62,82 67,80 70,79', startX: 32, startY: 62 }
  ],
  'し': [
    { d: 'M 34,20 C 33,44 32,65 38,74 C 45,84 65,78 78,61', startX: 34, startY: 20 }
  ],
  'す': [
    { d: 'M 20,31 Q 49,29 79,27', startX: 20, startY: 31 },
    { d: 'M 54,15 L 54,54 C 54,62 42,64 39,55 C 36,45 50,42 55,50 C 60,60 54,75 40,84', startX: 54, startY: 15 }
  ],
  'せ': [
    { d: 'M 18,41 Q 50,36 82,34', startX: 18, startY: 41 },
    { d: 'M 64,18 C 64,34 62,48 56,57', startX: 64, startY: 18 },
    { d: 'M 36,21 L 36,64 C 36,75 46,78 73,75', startX: 36, startY: 21 }
  ],
  'そ': [
    { d: 'M 32,22 L 62,19 L 28,46 L 74,40 C 56,48 41,60 44,72 C 46,81 58,83 71,79', startX: 32, startY: 22 }
  ],

  'た': [
    { d: 'M 22,30 Q 36,28 50,25', startX: 22, startY: 30 },
    { d: 'M 38,16 C 33,42 28,63 21,81', startX: 38, startY: 16 },
    { d: 'M 54,43 Q 66,39 76,41', startX: 54, startY: 43 },
    { d: 'M 53,66 C 56,74 67,76 79,74', startX: 53, startY: 66 }
  ],
  'ち': [
    { d: 'M 24,32 Q 48,29 70,25', startX: 24, startY: 32 },
    { d: 'M 44,16 C 41,34 38,48 34,57 C 47,47 73,47 74,64 C 74,77 56,84 36,83', startX: 44, startY: 16 }
  ],
  'つ': [
    { d: 'M 20,42 C 40,27 77,28 77,51 C 77,69 57,79 34,82', startX: 20, startY: 42 }
  ],
  'て': [
    { d: 'M 22,28 C 44,24 64,22 76,22 C 54,32 40,49 41,64 C 42,76 55,81 71,79', startX: 22, startY: 28 }
  ],
  'と': [
    { d: 'M 35,20 C 37,33 41,43 45,50', startX: 35, startY: 20 },
    { d: 'M 71,32 C 51,42 29,56 30,68 C 31,79 52,81 74,77', startX: 71, startY: 32 }
  ],

  'な': [
    { d: 'M 20,31 Q 35,29 50,25', startX: 20, startY: 31 },
    { d: 'M 37,16 C 33,38 27,57 20,71', startX: 37, startY: 16 },
    { d: 'M 61,27 C 68,31 74,36 78,41', startX: 61, startY: 27 },
    { d: 'M 57,44 L 57,72 C 57,80 43,80 43,72 C 43,64 60,64 78,74', startX: 57, startY: 44 }
  ],
  'に': [
    { d: 'M 27,21 C 24,44 24,64 28,78 L 34,67', startX: 27, startY: 21 },
    { d: 'M 48,32 Q 62,29 75,30', startX: 48, startY: 32 },
    { d: 'M 47,65 C 51,74 63,75 78,73', startX: 47, startY: 65 }
  ],
  'ぬ': [
    { d: 'M 29,26 C 32,48 37,65 44,75', startX: 29, startY: 26 },
    { d: 'M 55,22 C 49,47 36,70 25,73 C 18,75 18,62 29,50 C 43,35 72,33 77,55 C 80,69 69,79 62,76 C 56,73 60,62 69,66 C 75,68 79,72 82,76', startX: 55, startY: 22 }
  ],
  'ね': [
    { d: 'M 30,17 L 30,83', startX: 30, startY: 17 },
    { d: 'M 18,37 L 41,33 L 20,66 C 39,40 66,30 72,49 C 76,63 68,78 58,76 C 51,74 52,63 61,64 C 68,65 76,71 81,76', startX: 18, startY: 37 }
  ],
  'の': [
    { d: 'M 52,32 C 50,55 39,72 28,72 C 19,72 19,53 31,38 C 45,23 76,24 79,48 C 81,66 67,79 48,83', startX: 52, startY: 32 }
  ],

  'は': [
    { d: 'M 26,22 C 23,44 23,64 27,78 L 34,66', startX: 26, startY: 22 },
    { d: 'M 44,35 Q 61,33 75,30', startX: 44, startY: 35 },
    { d: 'M 61,18 L 62,70 C 62,79 48,79 47,71 C 46,63 63,63 79,73', startX: 61, startY: 18 }
  ],
  'ひ': [
    { d: 'M 22,32 L 38,28 C 29,48 30,74 47,75 C 63,76 70,54 71,32 C 74,50 78,64 83,74', startX: 22, startY: 32 }
  ],
  'ふ': [
    { d: 'M 44,18 Q 51,21 55,26', startX: 44, startY: 18 },
    { d: 'M 43,34 C 54,41 59,54 55,67 C 53,74 47,76 41,72', startX: 43, startY: 34 },
    { d: 'M 26,53 C 22,60 19,67 18,73', startX: 26, startY: 53 },
    { d: 'M 71,52 C 77,57 81,64 84,71', startX: 71, startY: 52 }
  ],
  'へ': [
    { d: 'M 16,58 C 26,48 33,38 39,37 C 46,36 62,53 84,69', startX: 16, startY: 58 }
  ],
  'ほ': [
    { d: 'M 25,22 C 22,44 22,64 26,78 L 33,66', startX: 25, startY: 22 },
    { d: 'M 42,27 Q 60,25 75,23', startX: 42, startY: 27 },
    { d: 'M 42,46 Q 60,44 75,42', startX: 42, startY: 46 },
    { d: 'M 60,26 L 61,70 C 61,79 47,79 46,71 C 45,63 62,63 79,73', startX: 60, startY: 26 }
  ],

  'ま': [
    { d: 'M 24,30 Q 50,27 74,25', startX: 24, startY: 30 },
    { d: 'M 26,47 Q 50,44 72,42', startX: 26, startY: 47 },
    { d: 'M 52,16 L 53,70 C 53,79 37,80 35,71 C 33,62 56,62 76,74', startX: 52, startY: 16 }
  ],
  'み': [
    { d: 'M 24,29 L 53,24 C 45,45 36,62 27,66 C 19,69 19,54 36,52 C 53,49 71,53 81,64', startX: 24, startY: 29 },
    { d: 'M 71,44 C 68,58 63,71 54,82', startX: 71, startY: 44 }
  ],
  'む': [
    { d: 'M 22,32 Q 44,29 63,27', startX: 22, startY: 32 },
    { d: 'M 44,15 L 44,54 C 44,64 31,64 31,54 C 31,44 43,45 44,55 C 44,68 48,78 65,78 C 77,78 80,68 78,56', startX: 44, startY: 15 },
    { d: 'M 71,27 Q 78,31 82,36', startX: 71, startY: 27 }
  ],
  'め': [
    { d: 'M 29,26 C 32,48 37,65 44,75', startX: 29, startY: 26 },
    { d: 'M 57,22 C 50,48 37,70 25,73 C 18,75 19,61 30,49 C 44,35 74,35 78,56 C 80,68 70,79 53,82', startX: 57, startY: 22 }
  ],
  'も': [
    { d: 'M 49,16 C 44,44 41,66 47,75 C 54,83 71,78 75,62', startX: 49, startY: 16 },
    { d: 'M 28,34 Q 49,32 67,31', startX: 28, startY: 34 },
    { d: 'M 26,53 Q 47,51 66,49', startX: 26, startY: 53 }
  ],

  'や': [
    { d: 'M 21,47 C 43,35 72,32 76,48 C 79,60 66,70 54,67', startX: 21, startY: 47 },
    { d: 'M 53,19 C 57,24 60,29 61,35', startX: 53, startY: 19 },
    { d: 'M 33,24 C 40,46 47,65 55,83', startX: 33, startY: 24 }
  ],
  'ゆ': [
    { d: 'M 25,24 C 23,46 24,67 28,77 C 32,56 44,31 64,31 C 78,31 81,52 72,66 C 65,75 51,76 41,72', startX: 25, startY: 24 },
    { d: 'M 53,18 C 56,42 54,66 44,84', startX: 53, startY: 18 }
  ],
  'よ': [
    { d: 'M 48,35 Q 62,33 74,32', startX: 48, startY: 35 },
    { d: 'M 47,18 L 48,70 C 48,79 32,79 30,70 C 28,60 54,60 76,74', startX: 47, startY: 18 }
  ],

  'ら': [
    { d: 'M 40,18 Q 50,22 57,27', startX: 40, startY: 18 },
    { d: 'M 33,31 L 31,56 C 44,44 71,44 72,61 C 73,75 56,82 36,83', startX: 33, startY: 31 }
  ],
  'り': [
    { d: 'M 29,22 C 26,42 27,59 33,67 L 38,58', startX: 29, startY: 22 },
    { d: 'M 64,19 C 68,43 65,67 45,83', startX: 64, startY: 19 }
  ],
  'る': [
    { d: 'M 31,24 L 61,21 L 32,49 C 50,41 75,44 75,62 C 75,75 60,82 47,80 C 38,79 36,68 45,67 C 52,66 57,72 56,79', startX: 31, startY: 24 }
  ],
  'れ': [
    { d: 'M 30,17 L 30,83', startX: 30, startY: 17 },
    { d: 'M 18,37 L 41,33 L 19,68 C 40,42 58,31 64,43 C 67,52 63,68 68,75 C 72,80 79,76 83,68', startX: 18, startY: 37 }
  ],
  'ろ': [
    { d: 'M 31,24 L 62,21 L 32,49 C 52,40 76,45 75,63 C 74,77 56,82 39,81', startX: 31, startY: 24 }
  ],

  'わ': [
    { d: 'M 30,17 L 30,83', startX: 30, startY: 17 },
    { d: 'M 18,37 L 41,33 L 19,68 C 41,38 74,32 78,54 C 81,70 67,80 48,82', startX: 18, startY: 37 }
  ],
  'を': [
    { d: 'M 24,29 Q 48,26 69,24', startX: 24, startY: 29 },
    { d: 'M 44,17 C 41,28 37,39 31,47 C 43,39 58,41 58,54 L 58,64', startX: 44, startY: 17 },
    { d: 'M 76,49 C 50,53 33,62 35,73 C 37,82 56,83 76,78', startX: 76, startY: 49 }
  ],
  'ん': [
    { d: 'M 46,18 C 38,40 28,60 20,77 C 32,57 45,48 51,51 C 56,54 53,72 62,76 C 70,79 79,70 83,56', startX: 46, startY: 18 }
  ],

  // ===== KATAKANA BASIC (46) =====
  'ア': [
    { d: 'M 20,25 L 78,22 L 56,46', startX: 20, startY: 25 },
    { d: 'M 48,38 C 47,56 38,72 24,83', startX: 48, startY: 38 }
  ],
  'イ': [
    { d: 'M 65,19 C 50,35 33,48 18,56', startX: 65, startY: 19 },
    { d: 'M 52,40 L 52,83', startX: 52, startY: 40 }
  ],
  'ウ': [
    { d: 'M 49,15 L 49,30', startX: 49, startY: 15 },
    { d: 'M 24,30 L 24,49', startX: 24, startY: 30 },
    { d: 'M 24,32 L 75,30 C 73,53 59,72 34,83', startX: 24, startY: 32 }
  ],
  'エ': [
    { d: 'M 25,28 L 75,28', startX: 25, startY: 28 },
    { d: 'M 50,28 L 50,74', startX: 50, startY: 28 },
    { d: 'M 18,74 L 82,74', startX: 18, startY: 74 }
  ],
  'オ': [
    { d: 'M 19,35 L 81,35', startX: 19, startY: 35 },
    { d: 'M 56,17 L 56,77 C 56,83 49,82 42,74', startX: 56, startY: 17 },
    { d: 'M 56,36 C 44,53 31,66 19,73', startX: 56, startY: 36 }
  ],

  'カ': [
    { d: 'M 21,34 L 74,31 C 73,54 68,74 59,80 C 54,83 49,77 45,71', startX: 21, startY: 34 },
    { d: 'M 48,17 C 44,44 34,67 19,82', startX: 48, startY: 17 }
  ],
  'キ': [
    { d: 'M 26,34 L 72,27', startX: 26, startY: 34 },
    { d: 'M 20,56 L 80,47', startX: 20, startY: 56 },
    { d: 'M 46,16 L 56,84', startX: 46, startY: 16 }
  ],
  'ク': [
    { d: 'M 46,17 C 40,29 31,41 21,49', startX: 46, startY: 17 },
    { d: 'M 42,27 L 72,25 C 66,50 49,71 25,83', startX: 42, startY: 27 }
  ],
  'ケ': [
    { d: 'M 40,18 C 34,33 27,46 19,56', startX: 40, startY: 18 },
    { d: 'M 33,36 L 81,33', startX: 33, startY: 36 },
    { d: 'M 58,36 C 56,55 46,72 28,83', startX: 58, startY: 36 }
  ],
  'コ': [
    { d: 'M 25,28 L 73,28 L 71,72', startX: 25, startY: 28 },
    { d: 'M 23,72 L 73,72', startX: 23, startY: 72 }
  ],

  'サ': [
    { d: 'M 18,37 L 82,35', startX: 18, startY: 37 },
    { d: 'M 35,20 L 35,55', startX: 35, startY: 20 },
    { d: 'M 63,18 L 63,46 C 63,64 53,77 35,83', startX: 63, startY: 18 }
  ],
  'シ': [
    { d: 'M 25,24 L 38,31', startX: 25, startY: 24 },
    { d: 'M 19,46 L 32,53', startX: 19, startY: 46 },
    { d: 'M 27,79 C 48,71 66,53 78,28', startX: 27, startY: 79 }
  ],
  'ス': [
    { d: 'M 24,27 L 69,25 C 58,48 40,67 19,79', startX: 24, startY: 27 },
    { d: 'M 52,51 C 63,59 73,68 82,78', startX: 52, startY: 51 }
  ],
  'セ': [
    { d: 'M 18,41 L 80,32 L 62,55', startX: 18, startY: 41 },
    { d: 'M 38,18 L 38,67 C 38,76 47,78 78,76', startX: 38, startY: 18 }
  ],
  'ソ': [
    { d: 'M 27,23 C 31,31 35,38 38,45', startX: 27, startY: 23 },
    { d: 'M 73,21 C 64,48 47,70 25,82', startX: 73, startY: 21 }
  ],

  'タ': [
    { d: 'M 47,17 C 40,31 30,44 20,53', startX: 47, startY: 17 },
    { d: 'M 42,27 L 71,25 C 63,51 45,72 22,83', startX: 42, startY: 27 },
    { d: 'M 36,44 C 44,49 51,54 57,59', startX: 36, startY: 44 }
  ],
  'チ': [
    { d: 'M 67,18 C 53,23 39,27 25,29', startX: 67, startY: 18 },
    { d: 'M 18,47 L 82,47', startX: 18, startY: 47 },
    { d: 'M 51,26 L 51,52 C 51,67 42,78 27,84', startX: 51, startY: 26 }
  ],
  'ツ': [
    { d: 'M 24,23 C 27,31 31,38 33,44', startX: 24, startY: 23 },
    { d: 'M 45,19 C 48,27 51,35 53,41', startX: 45, startY: 19 },
    { d: 'M 77,23 C 68,51 50,72 26,83', startX: 77, startY: 23 }
  ],
  'テ': [
    { d: 'M 27,25 L 72,25', startX: 27, startY: 25 },
    { d: 'M 18,44 L 82,44', startX: 18, startY: 44 },
    { d: 'M 52,44 C 50,62 41,75 26,83', startX: 52, startY: 44 }
  ],
  'ト': [
    { d: 'M 38,16 L 38,84', startX: 38, startY: 16 },
    { d: 'M 38,44 C 51,48 63,54 73,61', startX: 38, startY: 44 }
  ],

  'ナ': [
    { d: 'M 19,38 L 81,36', startX: 19, startY: 38 },
    { d: 'M 52,17 L 52,44 C 52,63 42,76 25,83', startX: 52, startY: 17 }
  ],
  'ニ': [
    { d: 'M 26,33 L 73,33', startX: 26, startY: 33 },
    { d: 'M 18,70 L 82,70', startX: 18, startY: 70 }
  ],
  'ヌ': [
    { d: 'M 24,27 L 71,24 C 60,51 41,72 19,83', startX: 24, startY: 27 },
    { d: 'M 36,44 C 51,54 65,66 78,80', startX: 36, startY: 44 }
  ],
  'ネ': [
    { d: 'M 47,16 L 54,26', startX: 47, startY: 16 },
    { d: 'M 22,36 L 73,33 C 58,49 38,63 19,70', startX: 22, startY: 36 },
    { d: 'M 50,49 L 50,84', startX: 50, startY: 49 },
    { d: 'M 55,56 C 65,61 74,67 82,74', startX: 55, startY: 56 }
  ],
  'ノ': [
    { d: 'M 69,20 C 57,49 39,70 21,82', startX: 69, startY: 20 }
  ],

  'ハ': [
    { d: 'M 37,27 C 32,47 25,64 16,78', startX: 37, startY: 27 },
    { d: 'M 60,27 C 66,46 74,63 84,78', startX: 60, startY: 27 }
  ],
  'ヒ': [
    { d: 'M 72,34 C 58,41 44,46 31,49', startX: 72, startY: 34 },
    { d: 'M 31,20 L 31,66 C 31,76 41,78 76,75', startX: 31, startY: 20 }
  ],
  'フ': [
    { d: 'M 22,29 L 75,27 C 66,54 48,74 24,83', startX: 22, startY: 29 }
  ],
  'ヘ': [
    { d: 'M 16,58 L 39,37 L 84,69', startX: 16, startY: 58 }
  ],
  'ホ': [
    { d: 'M 21,36 L 79,36', startX: 21, startY: 36 },
    { d: 'M 50,17 L 50,77 C 50,83 44,82 38,74', startX: 50, startY: 17 },
    { d: 'M 32,51 C 27,60 22,68 16,75', startX: 32, startY: 51 },
    { d: 'M 68,51 C 74,59 79,67 84,75', startX: 68, startY: 51 }
  ],

  'マ': [
    { d: 'M 19,29 L 79,27 L 52,58', startX: 19, startY: 29 },
    { d: 'M 35,48 C 46,57 56,67 66,78', startX: 35, startY: 48 }
  ],
  'ミ': [
    { d: 'M 30,22 C 44,24 58,28 71,33', startX: 30, startY: 22 },
    { d: 'M 28,45 C 43,48 57,52 70,57', startX: 28, startY: 45 },
    { d: 'M 24,69 C 43,72 60,76 76,82', startX: 24, startY: 69 }
  ],
  'ム': [
    { d: 'M 50,20 L 22,74 L 74,69', startX: 50, startY: 20 },
    { d: 'M 63,52 C 70,60 76,69 81,80', startX: 63, startY: 52 }
  ],
  'メ': [
    { d: 'M 69,19 C 56,47 38,68 19,81', startX: 69, startY: 19 },
    { d: 'M 33,38 C 47,47 61,57 74,69', startX: 33, startY: 38 }
  ],
  'モ': [
    { d: 'M 24,29 L 74,29', startX: 24, startY: 29 },
    { d: 'M 18,50 L 81,50', startX: 18, startY: 50 },
    { d: 'M 47,29 L 47,68 C 47,76 55,78 79,76', startX: 47, startY: 29 }
  ],

  'ヤ': [
    { d: 'M 19,42 L 80,31 L 60,57', startX: 19, startY: 42 },
    { d: 'M 37,17 L 54,84', startX: 37, startY: 17 }
  ],
  'ユ': [
    { d: 'M 27,30 L 68,30 L 64,73', startX: 27, startY: 30 },
    { d: 'M 18,73 L 82,73', startX: 18, startY: 73 }
  ],
  'ヨ': [
    { d: 'M 26,28 L 72,28 L 72,74', startX: 26, startY: 28 },
    { d: 'M 27,51 L 72,51', startX: 27, startY: 51 },
    { d: 'M 25,74 L 74,74', startX: 25, startY: 74 }
  ],

  'ラ': [
    { d: 'M 29,23 L 69,23', startX: 29, startY: 23 },
    { d: 'M 22,41 L 75,41 C 68,61 52,75 29,83', startX: 22, startY: 41 }
  ],
  'リ': [
    { d: 'M 33,22 L 33,55', startX: 33, startY: 22 },
    { d: 'M 65,19 L 65,48 C 65,64 56,76 38,83', startX: 65, startY: 19 }
  ],
  'ル': [
    { d: 'M 34,26 C 32,49 27,68 18,80', startX: 34, startY: 26 },
    { d: 'M 55,22 L 55,77 C 66,70 76,60 84,48', startX: 55, startY: 22 }
  ],
  'レ': [
    { d: 'M 32,21 L 32,78 C 51,71 68,58 80,41', startX: 32, startY: 21 }
  ],
  'ロ': [
    { d: 'M 24,27 L 26,75', startX: 24, startY: 27 },
    { d: 'M 24,28 L 75,28 L 73,74', startX: 24, startY: 28 },
    { d: 'M 26,74 L 74,74', startX: 26, startY: 74 }
  ],

  'ワ': [
    { d: 'M 24,25 L 24,52', startX: 24, startY: 25 },
    { d: 'M 24,27 L 75,26 C 72,53 56,74 31,83', startX: 24, startY: 27 }
  ],
  'ヲ': [
    { d: 'M 22,28 L 75,28 C 70,51 54,71 31,82', startX: 22, startY: 28 },
    { d: 'M 24,49 L 69,49', startX: 24, startY: 49 },
    { d: 'M 50,28 C 48,49 38,68 25,80', startX: 50, startY: 28 }
  ],
  'ン': [
    { d: 'M 24,27 L 41,37', startX: 24, startY: 27 },
    { d: 'M 26,78 C 49,69 68,51 80,27', startX: 26, startY: 78 }
  ],

  // Small yoon vowels
  'ゃ': [
    { d: 'M 21,47 C 43,35 72,32 76,48 C 79,60 66,70 54,67', startX: 21, startY: 47 },
    { d: 'M 53,19 C 57,24 60,29 61,35', startX: 53, startY: 19 },
    { d: 'M 33,24 C 40,46 47,65 55,83', startX: 33, startY: 24 }
  ],
  'ゅ': [
    { d: 'M 25,24 C 23,46 24,67 28,77 C 32,56 44,31 64,31 C 78,31 81,52 72,66 C 65,75 51,76 41,72', startX: 25, startY: 24 },
    { d: 'M 53,18 C 56,42 54,66 44,84', startX: 53, startY: 18 }
  ],
  'ょ': [
    { d: 'M 48,35 Q 62,33 74,32', startX: 48, startY: 35 },
    { d: 'M 47,18 L 48,70 C 48,79 32,79 30,70 C 28,60 54,60 76,74', startX: 47, startY: 18 }
  ]
};

const DAKUTEN_MAP: Record<string, { base: string; type: 'daku' | 'handaku' }> = {
  'が': { base: 'か', type: 'daku' },
  'ぎ': { base: 'き', type: 'daku' },
  'ぐ': { base: 'く', type: 'daku' },
  'げ': { base: 'け', type: 'daku' },
  'ご': { base: 'こ', type: 'daku' },
  'ざ': { base: 'さ', type: 'daku' },
  'じ': { base: 'し', type: 'daku' },
  'ず': { base: 'す', type: 'daku' },
  'ぜ': { base: 'せ', type: 'daku' },
  'ぞ': { base: 'そ', type: 'daku' },
  'だ': { base: 'た', type: 'daku' },
  'ぢ': { base: 'ち', type: 'daku' },
  'づ': { base: 'つ', type: 'daku' },
  'で': { base: 'て', type: 'daku' },
  'ど': { base: 'と', type: 'daku' },
  'ば': { base: 'は', type: 'daku' },
  'び': { base: 'ひ', type: 'daku' },
  'ぶ': { base: 'ふ', type: 'daku' },
  'べ': { base: 'へ', type: 'daku' },
  'ぼ': { base: 'ほ', type: 'daku' },
  'ぱ': { base: 'は', type: 'handaku' },
  'ぴ': { base: 'ひ', type: 'handaku' },
  'ぷ': { base: 'ふ', type: 'handaku' },
  'ぺ': { base: 'へ', type: 'handaku' },
  'ぽ': { base: 'ほ', type: 'handaku' },

  'ガ': { base: 'カ', type: 'daku' },
  'ギ': { base: 'キ', type: 'daku' },
  'グ': { base: 'ク', type: 'daku' },
  'ゲ': { base: 'ケ', type: 'daku' },
  'ゴ': { base: 'コ', type: 'daku' },
  'ザ': { base: 'サ', type: 'daku' },
  'ジ': { base: 'シ', type: 'daku' },
  'ズ': { base: 'ス', type: 'daku' },
  'ゼ': { base: 'セ', type: 'daku' },
  'ゾ': { base: 'ソ', type: 'daku' },
  'ダ': { base: 'タ', type: 'daku' },
  'ヂ': { base: 'チ', type: 'daku' },
  'ヅ': { base: 'ツ', type: 'daku' },
  'デ': { base: 'テ', type: 'daku' },
  'ド': { base: 'ト', type: 'daku' },
  'バ': { base: 'ハ', type: 'daku' },
  'ビ': { base: 'ヒ', type: 'daku' },
  'ブ': { base: 'フ', type: 'daku' },
  'ベ': { base: 'ヘ', type: 'daku' },
  'ボ': { base: 'ホ', type: 'daku' },
  'パ': { base: 'ハ', type: 'handaku' },
  'ピ': { base: 'ヒ', type: 'handaku' },
  'プ': { base: 'フ', type: 'handaku' },
  'ペ': { base: 'ヘ', type: 'handaku' },
  'ポ': { base: 'ホ', type: 'handaku' }
};

const DAKUTEN_MARKS: StrokeSpec[] = [
  { d: 'M 77,15 L 82,27', startX: 77, startY: 15 },
  { d: 'M 86,13 L 91,25', startX: 86, startY: 13 }
];

const HANDAKUTEN_MARK: StrokeSpec[] = [
  {
    d: 'M 83,14 A 7,7 0 1,1 82.9,14 Z',
    startX: 83,
    startY: 14
  }
];

function transformPath(d: string, scale: number, dx: number, dy: number): string {
  // Replace coordinate pairs "x,y" inside SVG path string
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_m, xStr, yStr) => {
    const x = Number(xStr) * scale + dx;
    const y = Number(yStr) * scale + dy;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

function getSingleCharStrokes(ch: string): StrokeSpec[] {
  if (BASE_KANA_STROKES[ch]) {
    return BASE_KANA_STROKES[ch];
  }
  const daku = DAKUTEN_MAP[ch];
  if (daku && BASE_KANA_STROKES[daku.base]) {
    const base = BASE_KANA_STROKES[daku.base];
    return [...base, ...(daku.type === 'daku' ? DAKUTEN_MARKS : HANDAKUTEN_MARK)];
  }
  return [];
}

export function getStrokeOrderSpec(char: string): KanaStrokeOrder {
  const chars = Array.from(char.trim());
  if (chars.length <= 1) {
    return {
      char,
      paths: getSingleCharStrokes(chars[0] || char)
    };
  }

  // Composite two-character kana (e.g. きゃ, しゃ, ちゃ) cleanly inside 0..100 box
  const left = getSingleCharStrokes(chars[0]).map((s) => ({
    d: transformPath(s.d, 0.58, 0, 18),
    startX: Number((s.startX * 0.58).toFixed(1)),
    startY: Number((s.startY * 0.58 + 18).toFixed(1))
  }));
  const right = getSingleCharStrokes(chars[1]).map((s) => ({
    d: transformPath(s.d, 0.44, 52, 40),
    startX: Number((s.startX * 0.44 + 52).toFixed(1)),
    startY: Number((s.startY * 0.44 + 40).toFixed(1))
  }));

  return {
    char,
    paths: [...left, ...right]
  };
}
