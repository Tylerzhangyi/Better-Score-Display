chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "GRADE_DATA" || !message.payload) {
    return;
  }

  chrome.storage.local.set(
    {
      gradeData: message.payload,
      gradeUpdatedAt: Date.now(),
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("[Yungu] 缓存成绩失败", chrome.runtime.lastError);
      } else {
        console.log("[Yungu] 成绩已更新");
      }
    }
  );
});
