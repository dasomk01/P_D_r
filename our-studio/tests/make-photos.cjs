// 테스트용 샘플 "사진" 생성 (그라데이션 + 라벨, 4:3 JPEG)
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const shots = [
    ["sea", "#9cc3d5", "#1b2540", "Gangneung · Sea"],
    ["tofu", "#f3ecdf", "#b97f84", "Chodang Sundubu"],
    ["cafe", "#d8aeb0", "#2f3b5c", "Anmok Coffee Street"],
    ["street", "#c9b79c", "#1b2540", "Old Street"],
    ["hotel", "#e8dfcf", "#6f6a62", "Hotel Room"],
  ];
  for (const [name, a, c, label] of shots) {
    await p.setContent(`<div style="width:1200px;height:900px;background:linear-gradient(135deg,${a},${c});display:flex;align-items:flex-end;padding:60px;box-sizing:border-box;font:600 72px Georgia;color:white">${label}</div>`);
    await p.screenshot({ path: path.join(__dirname, ".artifacts/photos", `${name}.jpg`), type: "jpeg", quality: 85 });
  }
  await b.close();
})();
