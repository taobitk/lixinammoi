// Gemini API has been removed as requested.
// This file exports a static list of wishes used by the App.

export const TET_WISHES = [
  "Tiền vào như nước, tiền ra nhỏ giọt!",
  "Năm mới phát tài, lộc lá đầy nhà.",
  "Hay ăn chóng lớn, tiền đầy túi!",
  "Sức khỏe dồi dào, an khang thịnh vượng.",
  "Vạn sự như ý, tỷ sự như mơ.",
  "Cung hỷ phát tài, tấn tài tấn lộc.",
  "Ăn tết to, không lo hết tiền.",
  "Năm mới vui vẻ, tiền đẻ ra tiền.",
  "Lộc biếc mai vàng, xuân sang hạnh phúc.",
  "Sự nghiệp thăng tiến, tiền về như lũ."
];

export const getRandomWish = () => {
  return TET_WISHES[Math.floor(Math.random() * TET_WISHES.length)];
};
