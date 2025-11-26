(() => {
  if (window.__YUNGU_GRADE_BRIDGE_PAGE__) return;
  window.__YUNGU_GRADE_BRIDGE_PAGE__ = true;

  const currentScript = document.currentScript || {};
  const targetKeyword = currentScript.dataset?.targetKeyword || "listLearningOverview";
  const bridgeEvent = currentScript.dataset?.bridgeEvent || "YUNGU_GRADE_DATA";

  const originalFetch = window.fetch;
  const originalXhrOpen = XMLHttpRequest.prototype.open;

  const notify = (payload) => {
    if (!payload) return;
    window.postMessage({ source: bridgeEvent, payload }, window.location.origin);
  };

  const handleText = (text) => {
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.content) {
        notify(parsed);
      }
    } catch (err) {
      console.warn("[Yungu] 页面脚本解析失败", err);
    }
  };

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    try {
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
      if (url?.includes(targetKeyword)) {
        response
          .clone()
          .text()
          .then(handleText)
          .catch((err) => console.warn("[Yungu] fetch 克隆失败", err));
      }
    } catch (err) {
      console.warn("[Yungu] fetch 处理失败", err);
    }
    return response;
  };

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (url?.includes(targetKeyword)) {
      this.addEventListener("load", () => handleText(this.responseText));
    }
    return originalXhrOpen.call(this, method, url, ...rest);
  };
})();

