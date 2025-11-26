(() => {
  const TARGET_KEYWORD = "listLearningOverview";
  const BRIDGE_EVENT = "YUNGU_GRADE_DATA";
  const SCRIPT_FLAG = "__YUNGU_GRADE_BRIDGE__";

  const injectBridge = () => {
    if (window[SCRIPT_FLAG]) return;
    window[SCRIPT_FLAG] = true;

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("pageBridge.js");
    script.dataset.targetKeyword = TARGET_KEYWORD;
    script.dataset.bridgeEvent = BRIDGE_EVENT;
    script.onload = () => script.remove();
    script.onerror = (err) => {
      console.error("[Yungu] 注入页面脚本失败", err);
      script.remove();
    };
    document.documentElement.appendChild(script);
  };

  const setupBridgeListener = () => {
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;
      if (event.data?.source !== BRIDGE_EVENT) return;

      chrome.runtime.sendMessage({
        type: "GRADE_DATA",
        payload: event.data.payload,
      });
    });
  };

  if (document.documentElement) {
    injectBridge();
  } else {
    document.addEventListener("DOMContentLoaded", injectBridge, { once: true });
  }
  setupBridgeListener();
})();

