"use strict";

/* global chrome */

const CLOSE_TAB = "CLOSE_TAB";
const SHOW_BLOCKED_INFO_PAGE = "SHOW_BLOCKED_INFO_PAGE";

const RESOLUTIONS = [
  CLOSE_TAB,
  SHOW_BLOCKED_INFO_PAGE,
];
// var port = chrome.runtime.connect();
// window.addEventListener("message", function(event) {
//   // We only accept messages from ourselves
//   if (event.source != window)
//     return;

//   if (event.data.type && (event.data.type == "FROM_PAGE")) {
//     console.log("Content script received: " + event.data.text);
//     // chrome.runtime.sendMessage("showOptions");
//       port.postMessage(event.data.text);
//   }
// }, false);
// chrome.runtime.onMessage.addListener((request) => {
//   if (request === "showOptions") {
//     chrome.runtime.openOptionsPage();
//   }
// });
chrome.runtime.onMessageExternal.addListener(request => {
  if(request ==="showOptions"){
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    if (typeof local.enabled !== "boolean") {
      chrome.storage.local.set({ enabled: false });
    }

    if (!Array.isArray(local.blocked)) {
      chrome.storage.local.set({ blocked: [] });
    }

    if (!RESOLUTIONS.includes(local.resolution)) {
      chrome.storage.local.set({ resolution: CLOSE_TAB });
    }
  });
});

const __removeProtocol = (url) => url.replace(/^http(s?):\/\//, "");
const __removeWww = (url) => url.replace(/^www\./, "");
const __removeTrailingSlash = (url) => url.endsWith("/") ? url.slice(0, -1) : url;

// "https://www.youtube.com/" => "youtube.com"
// "https://www.youtube.com/feed/explore" => "youtube.com/feed/explore"
// "https://music.youtube.com/" => "music.youtube.com"
// "https://music.youtube.com/explore" => "music.youtube.com/explore"
const normalizeUrl = (url) => [url]
  .map(__removeProtocol)
  .map(__removeWww)
  .map(__removeTrailingSlash)
  .pop();

// ["youtube.com", "!music.youtube.com"] => [{ path: "music.youtube.com", type: "allow" }, { path: "youtube.com", type: "block" }]
// ["https://youtube.com/", "!https://music.youtube.com/"] => [{ path: "music.youtube.com", type: "allow" }, { path: "youtube.com", type: "block" }]
const getRules = (blocked) => {
  const allowList = blocked
    .filter((item) => item.startsWith("!"))
    .map((item) => normalizeUrl(item.substring(1)));

  const blockList = blocked
    .filter((item) => !item.startsWith("!"))
    .map(normalizeUrl);

  const rules = [
    ...allowList.map((path) => ({ path, type: "allow" })),
    ...blockList.map((path) => ({ path, type: "block" })),
  ].sort((a, b) => b.path.length - a.path.length); // order the rules by their specificity; the longer the rule, the more specific

  return rules;
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  const url = changeInfo.pendingUrl || changeInfo.url;
  if (!url || !url.startsWith("http")) {
    return;
  }

  const normalizedUrl = normalizeUrl(url);

  chrome.storage.local.get(["enabled", "blocked", "resolution"], function (local) {
    const { enabled, blocked, resolution } = local;
    if (!enabled || !Array.isArray(blocked) || blocked.length === 0 || !RESOLUTIONS.includes(resolution)) {
      return;
    }

    const rules = getRules(blocked);
    const foundRule = rules.find((rule) => normalizedUrl.startsWith(rule.path) || normalizedUrl.endsWith(rule.path));
    if (!foundRule || foundRule.type === "allow") {
      return;
    }

    switch (resolution) {
    case CLOSE_TAB:
      alert("Site is blocked! Go study la!")
      chrome.tabs.remove(tabId);
      break;
    case SHOW_BLOCKED_INFO_PAGE:
      chrome.tabs.update(tabId, { url: `${chrome.runtime.getURL("blocked.html")}?url=${url}` });
      break;
    }
  });

});