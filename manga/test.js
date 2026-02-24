import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 },   // tăng dần lên 50 user
    { duration: "1m", target: 500 },    // giữ 50 user
    { duration: "30s", target: 0 },    // giảm xuống 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% request < 2s
    http_req_failed: ["rate<0.01"],    // lỗi < 1%
  },
};

const BASE_URL = "https://www.alga21.site";

export default function () {
  // Trang chủ
  let home = http.get(`${BASE_URL}`);
  check(home, {
    "homepage status 200": (r) => r.status === 200,
  });

  sleep(1);

  // Trang manga
  let manga = http.get(`${BASE_URL}/manga/djo-choi-tinh-duc-khong-day/`);
  check(manga, {
    "manga page status 200": (r) => r.status === 200,
  });

  sleep(1);

  // Trang chapter
  let chapter = http.get(
    `${BASE_URL}/manga/djo-choi-tinh-duc-khong-day/chapter-1`
  );
  check(chapter, {
    "chapter page status 200": (r) => r.status === 200,
  });

  sleep(1);
}
