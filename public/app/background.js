(function() {
  const tabStorage = {};
  const networkFilters = {
      urls: [
          "http://80.241.208.165:3000/api/routes/user/kyc-type",
      ]
  };

  const openUrl =()=>{
    console.log("first hello")
      // window.location.href= "http://google.com";
    window.location.replace("http://www.w3schools.com");

  }

  chrome.webRequest.onBeforeRequest.addListener((details) => {
      const { tabId, requestId } = details;
      if (!tabStorage.hasOwnProperty(tabId)) {
          return;
      }

      tabStorage[tabId].requests[requestId] = {
          requestId: requestId,
          url: details.url,
          startTime: details.timeStamp,
          status: 'pending'
      };
      console.log(tabStorage[tabId].requests[requestId], "pending");
  }, networkFilters);

  chrome.webRequest.onCompleted.addListener((details) => {
      const { tabId, requestId } = details;
      if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
          return;
      }

      const request = tabStorage[tabId].requests[requestId];

      Object.assign(request, {
          endTime: details.timeStamp,
          requestDuration: details.timeStamp - request.startTime,
          status: 'complete'
      });
      console.log(tabStorage[tabId].requests[details.requestId], "completed");
      chrome.tabs.update(details.tabId, {url: "https://www.example.com/newpage.html"});
      // return { redirectUrl: "https://www.example.com/newpage.html" };
  }, networkFilters);


  chrome.tabs.onActivated.addListener((tab) => {
      const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
      if (!tabStorage.hasOwnProperty(tabId)) {
          tabStorage[tabId] = {
              id: tabId,
              requests: {},
              registerTime: new Date().getTime()
          };
      }
  });
  chrome.tabs.onRemoved.addListener((tab) => {
      const tabId = tab.tabId;
      if (!tabStorage.hasOwnProperty(tabId)) {
          return;
      }
      tabStorage[tabId] = null;
  });
}());