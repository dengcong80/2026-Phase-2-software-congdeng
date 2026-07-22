export interface OfficialQuest {
  id: string;
  title: string;
  description: string;
  category: 'explore' | 'nature' | 'culture' | 'food' | 'university' | 'community';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardXp: number;
  latitude: number;
  longitude: number;
  completionType: 'photo' | 'checkin' | 'text' | 'review';
  completionHint?: string;
  images?: string[];
}

// Auckland coordinates reference: -36.8485, 174.7633
export const OFFICIAL_QUESTS: OfficialQuest[] = [
  // ① Explore Auckland (5 quests)
  {
    id: 'de000000-0000-0000-0000-000000000001',
    title: 'Mission Bay Explorer',
    description: 'Visit Mission Bay and upload a photo of the beach.',
    category: 'explore',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8523,
    longitude: 174.8313,
    completionType: 'photo',
    completionHint: 'Take a photo at Mission Bay beach',
    images: [
      'https://images.unsplash.com/photo-1506968430851-2fa378871b32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'de000000-0000-0000-0000-000000000002',
    title: 'Auckland Waterfront Walk',
    description: 'Walk along Viaduct Harbour and check in.',
    category: 'explore',
    difficulty: 'Easy',
    rewardXp: 70,
    latitude: -36.8435,
    longitude: 174.7615,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'de000000-0000-0000-0000-000000000003',
    title: 'Britomart Discovery',
    description: 'Find the Britomart Clock Tower and take a photo.',
    category: 'explore',
    difficulty: 'Easy',
    rewardXp: 60,
    latitude: -36.8441,
    longitude: 174.7677,
    completionType: 'photo',
    completionHint: 'Find the historic clock tower',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'de000000-0000-0000-0000-000000000004',
    title: 'Wynyard Quarter Explorer',
    description: 'Visit the public art installations in Wynyard Quarter.',
    category: 'explore',
    difficulty: 'Medium',
    rewardXp: 90,
    latitude: -36.8395,
    longitude: 174.7575,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'de000000-0000-0000-0000-000000000005',
    title: 'Auckland Night Lights',
    description: 'Share your favourite Auckland skyline photo after sunset.',
    category: 'explore',
    difficulty: 'Hard',
    rewardXp: 120,
    latitude: -36.8406,
    longitude: 174.7400,
    completionType: 'photo',
    completionHint: 'Take a photo after sunset',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop',
    ]
  },

  // ② Nature & Parks (5 quests)
  {
    id: 'da000000-0000-0000-0000-000000000001',
    title: 'Mt Eden Summit',
    description: 'Climb to the summit of Mt Eden and enjoy the panoramic views.',
    category: 'nature',
    difficulty: 'Medium',
    rewardXp: 120,
    latitude: -36.8760,
    longitude: 174.7644,
    completionType: 'photo',
    completionHint: 'Take a photo from the summit',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'da000000-0000-0000-0000-000000000002',
    title: 'Cornwall Park Picnic',
    description: 'Have a relaxing picnic at Cornwall Park.',
    category: 'nature',
    difficulty: 'Easy',
    rewardXp: 70,
    latitude: -36.9005,
    longitude: 174.7830,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'da000000-0000-0000-0000-000000000003',
    title: 'One Tree Hill Explorer',
    description: 'Visit One Tree Hill and learn about its history.',
    category: 'nature',
    difficulty: 'Medium',
    rewardXp: 100,
    latitude: -36.9026,
    longitude: 174.7850,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'da000000-0000-0000-0000-000000000004',
    title: 'Auckland Domain Adventure',
    description: 'Explore the beautiful Auckland Domain gardens.',
    category: 'nature',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8606,
    longitude: 174.7762,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'da000000-0000-0000-0000-000000000005',
    title: 'Western Springs Wildlife',
    description: 'Spot native birds at Western Springs Park.',
    category: 'nature',
    difficulty: 'Medium',
    rewardXp: 100,
    latitude: -36.8670,
    longitude: 174.7185,
    completionType: 'photo',
    completionHint: 'Take a photo of native birds',
    images: [
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop',
    ]
  },

  // ③ Culture & History (5 quests)
  {
    id: 'dc000000-0000-0000-0000-000000000001',
    title: 'Auckland War Memorial Museum',
    description: 'Visit the Auckland War Memorial Museum and explore NZ history.',
    category: 'culture',
    difficulty: 'Medium',
    rewardXp: 120,
    latitude: -36.8606,
    longitude: 174.7778,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1566127444979-b3d2b64bee43?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dc000000-0000-0000-0000-000000000002',
    title: 'Auckland Art Gallery',
    description: 'Explore contemporary and traditional art at Auckland Art Gallery.',
    category: 'culture',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8506,
    longitude: 174.7655,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dc000000-0000-0000-0000-000000000003',
    title: 'Albert Park History Walk',
    description: 'Take a walk through historic Albert Park.',
    category: 'culture',
    difficulty: 'Easy',
    rewardXp: 70,
    latitude: -36.8515,
    longitude: 174.7671,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511715282680-fbf93a50e721?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dc000000-0000-0000-0000-000000000004',
    title: 'High Street Heritage Hunt',
    description: 'Discover the heritage buildings along High Street.',
    category: 'culture',
    difficulty: 'Medium',
    rewardXp: 90,
    latitude: -36.8475,
    longitude: 174.7650,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1470293102895-1bf92d4c2d13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dc000000-0000-0000-0000-000000000005',
    title: 'Learn a Māori Greeting',
    description: 'Learn and use a traditional Māori greeting. Type "Kia ora" to complete!',
    category: 'culture',
    difficulty: 'Easy',
    rewardXp: 60,
    latitude: -36.8485,
    longitude: 174.7633,
    completionType: 'text',
    completionHint: 'Type: Kia ora',
    images: [
      'https://images.unsplash.com/photo-1583952734674-c0e0e0c0f682?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ]
  },

  // ④ Food & Coffee (5 quests)
  {
    id: 'df000000-0000-0000-0000-000000000001',
    title: 'Hidden Café Hunt',
    description: 'Find and visit a hidden café in Auckland CBD.',
    category: 'food',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8465,
    longitude: 174.7645,
    completionType: 'review',
    completionHint: 'Upload photo + write a review',
    images: [
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'df000000-0000-0000-0000-000000000002',
    title: 'Best Flat White Challenge',
    description: 'Try the best flat white in Auckland and share your review.',
    category: 'food',
    difficulty: 'Easy',
    rewardXp: 90,
    latitude: -36.8445,
    longitude: 174.7635,
    completionType: 'review',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'df000000-0000-0000-0000-000000000003',
    title: 'Auckland Night Market',
    description: 'Visit a night market and try international street food.',
    category: 'food',
    difficulty: 'Medium',
    rewardXp: 110,
    latitude: -36.8700,
    longitude: 174.7850,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'df000000-0000-0000-0000-000000000004',
    title: 'Eat Fish & Chips by the Sea',
    description: 'Enjoy classic Kiwi fish and chips with an ocean view.',
    category: 'food',
    difficulty: 'Easy',
    rewardXp: 70,
    latitude: -36.8523,
    longitude: 174.8313,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1580217593608-61931cefc821?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'df000000-0000-0000-0000-000000000005',
    title: 'Try a Kiwi Pie',
    description: 'Try an authentic New Zealand meat pie.',
    category: 'food',
    difficulty: 'Easy',
    rewardXp: 60,
    latitude: -36.8480,
    longitude: 174.7625,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop',
    ]
  },

  // ⑤ University Explorer (5 quests)
  {
    id: 'db000000-0000-0000-0000-000000000001',
    title: 'Old Arts Building - UoA',
    description: 'Visit the iconic Old Arts Building at University of Auckland.',
    category: 'university',
    difficulty: 'Easy',
    rewardXp: 60,
    latitude: -36.8523,
    longitude: 174.7691,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'db000000-0000-0000-0000-000000000002',
    title: 'General Library - UoA',
    description: 'Check in at the General Library, UoA.',
    category: 'university',
    difficulty: 'Easy',
    rewardXp: 70,
    latitude: -36.8520,
    longitude: 174.7680,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'db000000-0000-0000-0000-000000000003',
    title: 'Clock Tower - UoA',
    description: 'Find the famous Clock Tower at University of Auckland.',
    category: 'university',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8525,
    longitude: 174.7685,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541339907325-e6ccdfb9211b?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'db000000-0000-0000-0000-000000000004',
    title: 'AUT City Campus',
    description: 'Explore AUT City Campus and check in.',
    category: 'university',
    difficulty: 'Easy',
    rewardXp: 60,
    latitude: -36.8515,
    longitude: 174.7595,
    completionType: 'checkin',
    images: [
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'db000000-0000-0000-0000-000000000005',
    title: 'Massey Albany Explorer',
    description: 'Visit Massey University Albany Campus.',
    category: 'university',
    difficulty: 'Medium',
    rewardXp: 100,
    latitude: -36.7295,
    longitude: 174.7020,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1541339907325-e6ccdfb9211b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    ]
  },

  // ⑥ Community Challenge (5 quests)
  {
    id: 'dd000000-0000-0000-0000-000000000001',
    title: 'Recommend Your Favourite Study Spot',
    description: 'Share your go-to study spot with the community.',
    category: 'community',
    difficulty: 'Easy',
    rewardXp: 80,
    latitude: -36.8485,
    longitude: 174.7633,
    completionType: 'review',
    completionHint: 'Upload photo + recommendation',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dd000000-0000-0000-0000-000000000002',
    title: 'Hidden Street Art',
    description: 'Discover and photograph hidden street art in Auckland.',
    category: 'community',
    difficulty: 'Medium',
    rewardXp: 100,
    latitude: -36.8490,
    longitude: 174.7620,
    completionType: 'photo',
    images: [
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dd000000-0000-0000-0000-000000000003',
    title: 'Sunset Photo Challenge',
    description: 'Capture the most beautiful Auckland sunset.',
    category: 'community',
    difficulty: 'Hard',
    rewardXp: 120,
    latitude: -36.8485,
    longitude: 174.7633,
    completionType: 'photo',
    completionHint: 'Best sunset photo wins!',
    images: [
      'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dd000000-0000-0000-0000-000000000004',
    title: 'Favourite Weekend Walk',
    description: 'Share your favourite weekend walking route.',
    category: 'community',
    difficulty: 'Easy',
    rewardXp: 90,
    latitude: -36.8485,
    longitude: 174.7633,
    completionType: 'review',
    images: [
      'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    ]
  },
  {
    id: 'dd000000-0000-0000-0000-000000000005',
    title: 'Local Secret Challenge',
    description: 'Share a local secret spot that tourists don\'t know about.',
    category: 'community',
    difficulty: 'Hard',
    rewardXp: 150,
    latitude: -36.8485,
    longitude: 174.7633,
    completionType: 'review',
    completionHint: 'Share your hidden gem!',
    images: [
      'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
    ]
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  explore: 'Explore Auckland',
  nature: 'Nature & Parks',
  culture: 'Culture & History',
  food: 'Food & Coffee',
  university: 'University Explorer',
  community: 'Community Challenge'
};
